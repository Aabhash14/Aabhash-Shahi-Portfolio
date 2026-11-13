// Builds the Ask Aabhash datasets from datasets/intents.json.
//
//   node datasets/build.mjs
//
// Outputs:
//   datasets/train.jsonl : large augmented training set   {"text","intent","source"}
//   datasets/dev.jsonl   : tuning set (seeds never seen in train)
//   datasets/test.jsonl  : final held-out test set (seeds never seen in train or dev)
//   datasets/all.jsonl   : every row with its split, for exporting to other tools
//   datasets/stats.json  : counts per intent and split
//   chat-data.js         : compact examples the website loads (ALL seeds + rewrites,
//                          since production should use every example)
//
// The split is done by SEED, before augmentation, so a test question's
// variants never leak into training. Output is deterministic (seeded PRNG).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const intents = JSON.parse(readFileSync(join(here, "intents.json"), "utf8"));
delete intents._about;

// ── deterministic PRNG ───────────────────────────────────
let seed = 20261113;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ── augmenters ───────────────────────────────────────────
// Second person -> third person ("do you" -> "does Aabhash"). Visitors write both.
const THIRD = [
  [/\bare you\b/gi, "is Aabhash"], [/\bdo you\b/gi, "does Aabhash"], [/\bhave you\b/gi, "has Aabhash"],
  [/\bcan you\b/gi, "can Aabhash"], [/\bwere you\b/gi, "was Aabhash"], [/\bdid you\b/gi, "did Aabhash"],
  [/\bwould you\b/gi, "would Aabhash"], [/\bwhat's your\b/gi, "what's Aabhash's"], [/\byour\b/gi, "Aabhash's"],
  [/\byourself\b/gi, "Aabhash"], [/\byou've\b/gi, "Aabhash has"], [/\byou're\b/gi, "Aabhash is"],
  [/\byou\b/gi, "Aabhash"],
];
const SKIP_THIRD = new Set(["hello", "thanks", "bot", "out_of_scope"]);
function thirdPerson(s) {
  let out = s;
  for (const [re, rep] of THIRD) out = out.replace(re, rep);
  return out !== s ? out.replace(/Aabhash's Aabhash/g, "Aabhash") : null;
}

const PREFIXES = [
  "", "", "", "can you tell me ", "I'd like to know ", "quick question: ", "hey, ", "just curious, ",
  "as a recruiter I want to know ", "please tell me ", "could you explain ", "I was wondering ",
  "hi! ", "so ", "ok, ", "one more thing: ", "I'm hiring for a QA role, ", "tell me, ",
];
const SUFFIXES = ["", "", "?", "?", "??", " please", " thanks", "!", " in short", " briefly", "...", " :)"];
const NO_WRAP = new Set(["hello", "thanks"]);

function typo(s) {
  const words = s.split(" ");
  const idx = words.map((w, i) => (w.length >= 5 ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return null;
  const i = pick(idx);
  const w = words[i];
  const p = 1 + Math.floor(rand() * (w.length - 2));
  const kind = Math.floor(rand() * 3);
  if (kind === 0) words[i] = w.slice(0, p) + w[p + 1] + w[p] + w.slice(p + 2);        // swap
  else if (kind === 1) words[i] = w.slice(0, p) + w.slice(p + 1);                       // drop
  else words[i] = w.slice(0, p) + w[p] + w.slice(p);                                    // double
  return words.join(" ");
}
function casing(s) {
  const r = rand();
  if (r < 0.5) return s.toLowerCase();
  if (r < 0.58) return s.toUpperCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function variant(base, intent) {
  let s = base;
  if (!NO_WRAP.has(intent)) s = pick(PREFIXES) + s.replace(/[?!.]+$/, "") + pick(SUFFIXES);
  if (rand() < 0.3) s = typo(s) || s;
  return casing(s).replace(/\s+/g, " ").trim();
}

// ── build ────────────────────────────────────────────────
// Seeds split 60% train / 20% dev / 20% test.
const TRAIN_VARIANTS = 10;    // augmented variants per training base
const EVAL_VARIANTS = 4;      // augmented variants per dev/test base
const train = [], dev = [], test = [], browser = [];
const stats = {};

for (const [intent, seeds] of Object.entries(intents)) {
  const uniq = [...new Set(seeds.map((s) => s.trim()))];
  const order = shuffle(uniq);
  stats[intent] = { seeds: uniq.length, train: 0, dev: 0, test: 0 };

  order.forEach((s, i) => {
    const split = i % 5 === 3 ? "dev" : i % 5 === 4 ? "test" : "train";
    const bases = [{ text: s, source: "seed" }];
    if (!SKIP_THIRD.has(intent)) {
      const t = thirdPerson(s);
      if (t) bases.push({ text: t, source: "third_person" });
    }
    // Browser data uses every seed + rewrite (no noise; the matcher handles typos itself).
    bases.forEach((b) => browser.push([b.text.toLowerCase(), intent]));

    const out = { train, dev, test }[split];
    const n = split === "train" ? TRAIN_VARIANTS : EVAL_VARIANTS;
    const seen = new Set();
    const push = (text, source) => {
      const key = text.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ text, intent, source });
      stats[intent][split]++;
    };
    bases.forEach((b) => {
      push(b.text, b.source);
      for (let k = 0; k < n; k++) push(variant(b.text, intent), b.source + "+aug");
    });
  });
}

const jsonl = (rows) => rows.map((r) => JSON.stringify(r)).join("\n") + "\n";
writeFileSync(join(here, "train.jsonl"), jsonl(shuffle(train)));
writeFileSync(join(here, "dev.jsonl"), jsonl(shuffle(dev)));
writeFileSync(join(here, "test.jsonl"), jsonl(shuffle(test)));
writeFileSync(join(here, "all.jsonl"), jsonl([...train.map((r) => ({ ...r, split: "train" })), ...dev.map((r) => ({ ...r, split: "dev" })), ...test.map((r) => ({ ...r, split: "test" }))]));
writeFileSync(join(here, "stats.json"), JSON.stringify({ total: { train: train.length, dev: dev.length, test: test.length, browser: browser.length }, intents: stats }, null, 2) + "\n");

const dedup = [...new Map(browser.map((r) => [r[0] + "|" + r[1], r])).values()];
writeFileSync(
  join(root, "chat-data.js"),
  "/* Generated by datasets/build.mjs from datasets/intents.json. Do not edit by hand. */\n" +
  "window.ASK_DATA=" + JSON.stringify(dedup) + ";\n"
);

console.log(`intents: ${Object.keys(intents).length}`);
console.log(`train rows: ${train.length}   dev rows: ${dev.length}   test rows: ${test.length}   browser examples: ${dedup.length}`);
