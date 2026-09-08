/* ============================================================
   Aabhash Shahi — portfolio behaviour
   Theme, navigation, reveals, email, case studies.
   No dependencies.
   ============================================================ */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ── theme ────────────────────────────────────────────── */
  var tbtn = document.getElementById("theme-btn");
  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (tbtn) tbtn.setAttribute("aria-pressed", String(mode === "dark"));
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  if (tbtn) {
    tbtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (err) {}
    if (!stored) applyTheme(e.matches ? "dark" : "light");
  });

  /* ── nav: scrolled state ──────────────────────────────── */
  var nav = document.querySelector(".nav");
  var queued = false;
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
    queued = false;
  }
  addEventListener("scroll", function () {
    if (!queued) { queued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ── nav: mobile panel ────────────────────────────────── */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("nav-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    panel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ── nav: active section on the current page ──────────── */
  var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"], .nav-panel a[href^="#"], .rail a[href^="#"]'));
  var seen = {};
  var targets = [];
  links.forEach(function (a) {
    var el = document.querySelector(a.hash);
    if (el && !seen[a.hash]) { seen[a.hash] = 1; targets.push(el); }
  });
  if ("IntersectionObserver" in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          if (a.hash === "#" + en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ── reveals ──────────────────────────────────────────── */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ── email, assembled at runtime so scrapers miss it ──── */
  var addr = ["aabhash", "shahi", "214"].join("") + String.fromCharCode(64) + "gmail.com";
  var printEmail = document.querySelector("#print-email .val");
  if (printEmail) printEmail.textContent = addr;
  var note = document.getElementById("copied");

  [].slice.call(document.querySelectorAll("[data-copy-email]")).forEach(function (btn) {
    var original = btn.innerHTML;
    var isContact = btn.closest(".contact-actions") !== null;
    btn.addEventListener("click", function () {
      function done() {
        btn.textContent = "Copied \u2014 " + addr;
        if (isContact && note) { note.textContent = addr + " copied to clipboard"; note.classList.add("show"); }
        setTimeout(function () {
          btn.innerHTML = original;
          if (note) note.classList.remove("show");
        }, 2800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, function () { location.href = "mailto:" + addr; });
      } else {
        location.href = "mailto:" + addr;
      }
    });
  });

  /* ══════════════════════════════════════════════════════
     CASE STUDIES
     One object per project. Edit the text here — the markup
     is generated. [brackets] are placeholders for real numbers.
     ══════════════════════════════════════════════════════ */
  var CASES = {
    agentic: {
      kind: "Agentic AI workflow",
      title: "One-flow QA: cases, scripts, run, ticket",
      lead: "A workflow that takes a feature and returns a filed bug ticket, with no manual handoff between steps.",
      problem: "As the only QA engineer across four products, every step of the cycle was a separate manual job: write the cases, write the scripts, run them, read the failures, write the bug report, raise the ticket. Each handoff cost time and each one was a place work stalled when I was pulled onto something else.",
      role: "Sole designer and implementer, alongside my regular QA responsibilities.",
      strategy: [
        "Treat the QA cycle as one pipeline rather than six tasks.",
        "Keep a human approval gate before anything reaches Azure DevOps.",
        "Generate into the team's existing system of record so nothing lives in a side channel."
      ],
      automation: [
        "Test cases generated from the application under test rather than written by hand.",
        "Executable scripts generated from those cases, structured on the Page Object Model so they stay maintainable.",
        "Execution, then failure triage on the results.",
        "Bug report drafted from the failure, and the ticket raised in Azure DevOps \u2014 in the same flow."
      ],
      challenges: "A wrong generated case is worse than no case, because it creates false confidence. Constraining generation to observed application state, and reviewing every batch before it lands, is what made the output trustworthy. Duplicate tickets were the other risk \u2014 an automated reporter that files the same bug twice loses the team's trust immediately.",
      results: [
        "Authoring time per module fell from <strong>[X] hours to [Y] minutes</strong>.",
        "<strong>[N] test cases</strong> generated and reviewed into the Azure DevOps library.",
        "<strong>[N] defects</strong> found and filed through the flow.",
        "Manual copy-paste transfer removed from the cycle entirely."
      ],
      flow: ["Feature", "Test cases", "Scripts", "Execution", "Bug report", "ADO ticket"],
      stack: ["Agentic AI", "Model Context Protocol", "Playwright", "TypeScript", "Azure DevOps API", "Page Object Model"]
    },

    docs: {
      kind: "AI documentation agent",
      title: "Technical and functional docs, generated",
      lead: "Documentation that used to be written by hand for every project, produced from the codebase instead.",
      problem: "Four products meant four sets of documentation, technical and functional, and documentation is the first thing to fall behind when one person covers everything. Out-of-date docs are worse than none, because people still trust them.",
      role: "Built and maintain the agent.",
      strategy: [
        "Generate from the source of truth \u2014 the codebase and the application itself \u2014 not from memory.",
        "Produce both registers: technical detail for developers, functional description for the client.",
        "Make regeneration cheap so docs can be refreshed rather than rewritten."
      ],
      automation: [
        "Agent reads the codebase and produces structured technical documentation.",
        "Functional documentation generated for client-facing use from the same pass.",
        "Output published to the project wiki alongside the rest of the project record.",
        "Templates keep structure consistent across all four products."
      ],
      challenges: "Generated documentation drifts toward describing code rather than explaining behaviour. Getting the functional register right \u2014 written for someone who does not read the repository \u2014 took more iteration than the technical one.",
      results: [
        "Documentation for <strong>[N] applications</strong> generated rather than hand-written.",
        "Turnaround per document down from <strong>[X] to [Y]</strong>.",
        "Docs now refreshed on change instead of going stale between releases."
      ],
      flow: ["Codebase", "Agent pass", "Technical docs", "Functional docs", "Wiki"],
      stack: ["Agentic AI", "Azure DevOps Wiki", "Prompt design", "Documentation templates"]
    },

    dashboard: {
      kind: "QA platform",
      title: "Client QA dashboard",
      lead: "One place holding all test data and documentation, instead of results scattered across pipeline logs.",
      problem: "Test results lived in pipeline logs, cases lived in Azure DevOps, and documentation lived somewhere else again. The client could not answer \u201cis this release safer than the last one?\u201d without someone assembling the answer by hand.",
      role: "Designed and built the dashboard; sole maintainer.",
      strategy: [
        "One place to answer questions about quality, rather than one place per data source.",
        "Store history, because a single run says almost nothing about stability.",
        "Built for the client to read, not just for me."
      ],
      automation: [
        "Test run output ingested and stored, building run-over-run history.",
        "Test cases, results and documentation held together per product.",
        "Pass rate, coverage movement and flaky specs surfaced as trends rather than single runs.",
        "Azure DevOps sync keeps the dashboard and the case library aligned."
      ],
      challenges: "Choosing what not to show. The first version exposed too much detail and stakeholders ignored it; the useful version answers one question \u2014 is this release safe \u2014 and links to detail for anyone who wants it.",
      results: [
        "Run history retained across <strong>[N] sprints</strong>.",
        "Release-risk questions answerable from one screen.",
        "Test data and documentation consolidated from <strong>[N] separate places</strong> into one."
      ],
      flow: ["Test runs", "Ingest", "History store", "Trends", "Client view"],
      stack: ["Node.js", "SQLite", "Azure DevOps API", "Playwright reporter", "Power BI"]
    },

    pipeline: {
      kind: "Automation framework",
      title: "Playwright suite in continuous regression",
      lead: "Introduced Playwright in 2023 and wired it into Azure Pipelines, so regression runs after every release rather than on request.",
      problem: "Regression was manual and therefore rationed \u2014 it happened when there was time, which meant it happened late. With four products and one tester, a manual full pass was never going to fit inside a sprint.",
      role: "Proposed, built and own the framework.",
      strategy: [
        "Automate the paths that get run every release first, not the ones that are easiest to automate.",
        "Structure for maintenance from the start; a suite nobody can edit is a suite that gets deleted.",
        "Run on every commit so failures surface next to the change that caused them."
      ],
      automation: [
        "Playwright suite built on the Page Object Model with reusable authentication state.",
        "Cross-browser execution across the products in scope.",
        "Azure Pipelines integration publishing JUnit and HTML results per run.",
        "Shared login module so an authentication change is one edit, not one per product."
      ],
      challenges: "Flaky specs undermine an automated suite faster than missing coverage does. Stabilising waits and authentication state, and triaging flake as its own class of defect, was most of the real work after the first version shipped.",
      results: [
        "Full regression from <strong>[X] hours manual to [Y] minutes automated</strong>.",
        "Regression now runs on <strong>every commit</strong> instead of on request.",
        "Coverage across <strong>[N] products</strong> from one pipeline definition."
      ],
      flow: ["Commit", "Azure Pipeline", "Playwright", "JUnit + HTML", "Sign-off"],
      stack: ["Playwright", "TypeScript", "Azure Pipelines", "JUnit", "Azure AD", "Page Object Model"]
    },

    api: {
      kind: "API automation",
      title: "API test automation in Postman",
      lead: "Moving API testing from manual request checks to an automated suite that runs with the rest of the pipeline.",
      problem: "API coverage existed as a folder of saved requests that someone had to click through. It only got exercised when a person remembered to do it, which meant contract and validation regressions reached the UI before anyone noticed.",
      role: "Built the automated API coverage across the products in scope.",
      strategy: [
        "Assert on contract, not just on status codes \u2014 shape and payload as well as 200.",
        "Cover the error paths, since that is where API behaviour actually diverges.",
        "Automate execution so coverage does not depend on someone remembering."
      ],
      automation: [
        "Postman collections built out across CRUD, status-code and error-path coverage.",
        "Response schema and payload assertions rather than status checks alone.",
        "Database verification in SQL behind the API, confirming what was written matched what was returned.",
        "Automated execution so API regression runs alongside UI regression."
      ],
      challenges: "Test data. API assertions are only as good as the state they run against, so building repeatable data setup mattered more than the assertions themselves.",
      results: [
        "<strong>[N] endpoints</strong> under automated coverage.",
        "API regression now runs automatically rather than on demand.",
        "Contract and validation defects caught before reaching the interface."
      ],
      flow: ["Request", "Status + schema", "Payload", "SQL check", "Report"],
      stack: ["Postman", "REST APIs", "SQL", "Azure Pipelines", "Newman"]
    },

    standards: {
      kind: "Quality process",
      title: "QA standards and test strategy from zero",
      lead: "There was no QA process to inherit. I wrote the one the team still works to.",
      problem: "When I moved from intern to trainee, testing at Proshore was ad hoc: no test plans, no case repository, no entry or exit criteria, no defect workflow. There was also a backlog of applications that had never been systematically tested at all.",
      role: "Authored the standards and worked the backlog down application by application.",
      strategy: [
        "Write the standard first, then apply it \u2014 otherwise every project invents its own.",
        "Work the untested backlog application by application rather than sampling across all of them.",
        "Prioritise by risk: pricing, contracts and access control before anything cosmetic."
      ],
      automation: [
        "Test case library established in Azure DevOps, giving the first traceable record of coverage.",
        "Test plans, entry and exit criteria, and severity definitions documented as team standards.",
        "Defect workflow defined from report through to verified closure.",
        "Automation introduced against the standard, so generated and hand-written cases follow the same structure."
      ],
      challenges: "Standards only work if the team uses them, and a process written by one person is easy to ignore. Keeping it light enough to follow \u2014 and applying it visibly to my own work first \u2014 was what got it adopted.",
      results: [
        "<strong>Every</strong> backlog application brought under documented coverage.",
        "First traceable test case library at the company, now <strong>[N] cases</strong>.",
        "Entry and exit criteria and a defect workflow the whole team works to."
      ],
      flow: ["Requirements", "Test plan", "Case library", "Execution", "Exit criteria"],
      stack: ["Azure DevOps Test Plans", "Test strategy", "Risk-based prioritisation", "Traceability"]
    }
  };

  /* ── testing labs: reveal the rest on demand ──────────── */
  var labsBtn = document.getElementById("labs-more");
  if (labsBtn) {
    labsBtn.addEventListener("click", function () {
      var open = labsBtn.getAttribute("aria-expanded") === "true";
      [].slice.call(document.querySelectorAll("#labs-grid .lab")).forEach(function (el, i) {
        if (i > 5) el.classList.toggle("is-hidden", open);
      });
      labsBtn.setAttribute("aria-expanded", String(!open));
      labsBtn.textContent = open ? "Show all 11 labs" : "Show fewer";
    });
  }

  /* ── section rail mirrors the nav's active state ───────── */
  var rail = [].slice.call(document.querySelectorAll(".rail a"));

  var dlg = document.getElementById("case");
  if (!dlg) return;
  var body = document.getElementById("case-body");
  var kindEl = document.getElementById("case-kind");
  var opener = null;

  /* horizontal test-flow diagram, generated from the flow array */
  function flowSvg(steps) {
    var w = 132, gap = 26, h = 44, pad = 8;
    var total = steps.length * w + (steps.length - 1) * gap;
    var vb = total + pad * 2;
    var parts = ['<svg viewBox="0 0 ' + vb + ' ' + (h + 16) + '" role="img" aria-label="Flow: ' + steps.join(" to ") + '">'];
    steps.forEach(function (s, i) {
      var x = pad + i * (w + gap);
      var cls = (i === 0 || i === steps.length - 1) ? "flow-box-accent" : "flow-box";
      parts.push('<rect class="' + cls + '" x="' + x + '" y="8" width="' + w + '" height="' + h + '" rx="6"/>');
      parts.push('<text class="flow-label" x="' + (x + w / 2) + '" y="' + (8 + h / 2 + 4) + '">' + s + '</text>');
      if (i < steps.length - 1) {
        var ax = x + w + 5, ax2 = x + w + gap - 6;
        parts.push('<path class="flow-arrow" d="M' + ax + ' ' + (8 + h / 2) + 'H' + ax2 + '"/>');
        parts.push('<path class="flow-arrow-head" d="M' + ax2 + ' ' + (8 + h / 2 - 3.2) + 'l4 3.2-4 3.2z"/>');
      }
    });
    parts.push("</svg>");
    return parts.join("");
  }

  function block(label, html) {
    return '<div class="case-block"><span class="label">' + label + "</span>" + html + "</div>";
  }
  function list(items) {
    return "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
  }

  function openCase(key, trigger) {
    var c = CASES[key];
    if (!c) return;
    opener = trigger || null;
    kindEl.textContent = c.kind;
    body.innerHTML =
      '<h2 id="case-title">' + c.title + "</h2>" +
      '<p class="case-lead">' + c.lead + "</p>" +
      (c.flow ? '<figure class="flow">' + flowSvg(c.flow) +
        '<figcaption class="small flow-cap">End-to-end flow</figcaption></figure>' : "") +
      block("Problem", "<p>" + c.problem + "</p>") +
      block("My role", "<p>" + c.role + "</p>") +
      block("Testing strategy", list(c.strategy)) +
      block("Automation", list(c.automation)) +
      block("Challenges", "<p>" + c.challenges + "</p>") +
      block("Results", list(c.results)) +
      block("Tech stack", '<div class="chips">' + c.stack.map(function (t) {
        return '<span class="chip">' + t + "</span>";
      }).join("") + "</div>");

    if (typeof dlg.showModal === "function") {
      dlg.showModal();
      dlg.querySelector(".case-scroll").scrollTop = 0;
      document.body.style.overflow = "hidden";
    }
  }

  [].slice.call(document.querySelectorAll("[data-case]")).forEach(function (btn) {
    btn.addEventListener("click", function () { openCase(btn.getAttribute("data-case"), btn); });
  });

  var closeBtn = document.getElementById("case-close");
  if (closeBtn) closeBtn.addEventListener("click", function () { dlg.close(); });

  /* backdrop only — a keyboard-fired click reports 0,0 and must not close */
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  dlg.addEventListener("close", function () {
    document.body.style.overflow = "";
    if (opener) { opener.focus(); opener = null; }
  });
})();
