// Evaluates the chatbot's local matcher on the held-out test set.
//
//   node datasets/build.mjs && node datasets/eval.mjs [--sweep] [--errors]
//
// The classifier is trained on the TRAIN split only (seed + third-person rows,
// the same kind of examples the website ships), then scored on test.jsonl.
// "out_of_scope" rows count as correct only when the bot falls back.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const args = new Set(process.argv.slice(2));
const readJsonl = (f) => readFileSync(join(here, f), "utf8").trim().split("\n").map((l) => JSON.parse(l));

// Load chat.js in a minimal fake browser so we test the real shipped code.
function loadBot() {
  const ctx = { document: { readyState: "loading", addEventListener() {} }, console };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(readFileSync(join(here, "..", "chat.js"), "utf8"), ctx);
  return ctx.AskBot;
}

const train = readJsonl("train.jsonl").filter((r) => r.source === "seed" || r.source === "third_person");
const dev = readJsonl("dev.jsonl");
const test = readJsonl("test.jsonl");

function score(bot, rows = test) {
  let ok = 0;
  const per = {}, confusion = {}, errors = [];
  for (const r of rows) {
    const got = bot.classify(r.text);
    const p = (per[r.intent] ||= { n: 0, ok: 0 });
    p.n++;
    if (got === r.intent) { ok++; p.ok++; }
    else {
      const key = `${r.intent} -> ${got}`;
      confusion[key] = (confusion[key] || 0) + 1;
      errors.push(`${r.intent.padEnd(15)} got ${got.padEnd(15)} "${r.text}"`);
    }
  }
  return { acc: ok / rows.length, per, confusion, errors };
}
const pct = (x) => (100 * x).toFixed(1) + "%";

const keywordOnly = score(loadBot());

const bot = loadBot();
bot.useData(train.map((r) => [r.text, r.intent]));

if (args.has("--sweep")) {
  // Grid search on DEV only; the test set stays untouched for the final number.
  let best = { acc: -1 };
  for (let nn = 0; nn <= 1.001; nn += 0.25) {
  bot.tune(0, 0, nn);
  const devScored = dev.map((r) => ({ intent: r.intent, ...bot.scores(r.text) })); // score once per nn
  for (let kw = 0; kw <= 0.161; kw += 0.02)
    for (let t = 0.1; t <= 0.61; t += 0.025) {
      bot.tune(t, kw, nn);
      let ok = 0;
      for (const d of devScored) if (bot.decide(d.sim, d.kw) === d.intent) ok++;
      const acc = ok / devScored.length;
      if (acc > best.acc) best = { acc, t, kw, nn };
    }
  }
  console.log(`best on dev: MIN_SIM=${best.t.toFixed(3)} KW_WEIGHT=${best.kw.toFixed(2)} NN_WEIGHT=${best.nn.toFixed(2)} -> dev ${pct(best.acc)}`);
  console.log("(copy these into chat.js to ship them)\n");
  bot.tune(best.t, best.kw, best.nn);
}

const res = score(bot);
console.log(`train examples: ${train.length}   dev rows: ${dev.length}   test rows: ${test.length}`);
console.log(`dev accuracy:                   ${pct(score(bot, dev).acc)}`);
console.log(`keyword-only baseline accuracy: ${pct(keywordOnly.acc)}`);
console.log(`TEST accuracy (held out):       ${pct(res.acc)}\n`);

console.log("per intent:");
for (const [k, v] of Object.entries(res.per).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n)) {
  console.log(`  ${k.padEnd(16)} ${pct(v.ok / v.n).padStart(6)}  (${v.ok}/${v.n})`);
}
console.log("\ntop confusions:");
Object.entries(res.confusion).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}  ${k}`));
if (args.has("--errors")) { console.log("\nerrors:"); res.errors.forEach((e) => console.log("  " + e)); }
