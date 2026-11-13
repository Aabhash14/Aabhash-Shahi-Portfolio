/* ============================================================
   Ask Aabhash: a chat assistant that answers visitors' questions
   about Aabhash, in Aabhash's own voice (first person, like the
   rest of the site), from the portfolio's own content.

   Two modes:
   1. Local (default): matches the question against the knowledge
      base below. No server, no API key, works on GitHub Pages.
   2. AI (optional): set ASK_ENDPOINT to the deployed Cloudflare
      Worker in /worker. Claude then answers freely, grounded in the
      same profile. If the Worker fails, the bot falls back to local.
   ============================================================ */
(function () {
  "use strict";

  // Paste the deployed Worker URL here to switch on AI answers, e.g.
  // "https://ask-aabhash.<your-subdomain>.workers.dev". Empty = local only.
  var ASK_ENDPOINT = "";

  // Email is assembled at runtime so scrapers miss it (same pattern as the site).
  var EMAIL = ["aabhash", "shahi", "214"].join("") + String.fromCharCode(64) + "gmail.com";
  var RESUME = "images/Aabhash_Shahi_QA_Resume.pdf";
  var LINKEDIN = "https://www.linkedin.com/in/aabhash-shahii/";
  var GITHUB = "https://github.com/Aabhash14/";
  var GAMES = "https://games.aabhashshahi.com.np/";

  function a(href, text, ext) {
    return '<a href="' + href + '"' + (ext ? ' target="_blank" rel="noreferrer"' : "") + ">" + text + "</a>";
  }
  var CONTACT_LINE =
    "Email me at " + a("mailto:" + EMAIL, EMAIL) + ", message me on " + a(LINKEDIN, "LinkedIn", true) +
    ", or call +977 9813504916.";

  /* ── knowledge base ──────────────────────────────────────
     k: keywords / phrases (a phrase match scores more).
     Answers only restate what the portfolio says. No invented figures. */
  var KB = [
    {
      id: "hello",
      k: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "yo"],
      a: "<p>Hi! Ask me about my experience, the AI agents I've built, my skills, or how to get in touch.</p>"
    },
    {
      id: "summary",
      w: 0.4, // generic phrases: lose to any specific topic
      k: ["who is", "who are you", "introduce", "summary", "tell me about", "overview", "background", "yourself", "aabhash", "profile", "elevator pitch", "why hire", "hire you", "strength", "what do you do"],
      a: "<p>I'm Aabhash Shahi, a QA engineer at <strong>Proshore</strong> in Kathmandu who builds AI agents, not just test cases. I'm the <strong>sole QA engineer for nine developers</strong> across several De Heus products.</p>" +
         "<p>I built the QA practice from zero: standards, an Azure DevOps case library, and Playwright regression running in Azure Pipelines on every commit. Then I added agentic AI workflows that take a feature all the way to a filed bug. I went from intern (Sep 2023) to mid-level QA engineer (Mar 2025) at the same company.</p>"
    },
    {
      id: "role",
      k: ["current", "currently", "job", "role", "position", "title", "work now", "proshore", "de heus", "company", "employer", "where do you work", "client", "mid-level", "mid level"],
      a: "<p>I'm a <strong>Mid-Level QA Engineer at Proshore</strong> (since Mar 2025), working for the Netherlands-based client <strong>De Heus</strong>, a global animal-nutrition group.</p>" +
         "<ul><li>Sole QA for nine developers across multiple products</li><li>Built agentic AI QA workflows and a documentation agent</li><li>Automated API testing in Postman</li><li>Built a QA traceability dashboard</li><li>Run product demos and client communication with Dutch stakeholders, inside Scrum</li><li>Support production deployments and release validation</li></ul>"
    },
    {
      id: "experience",
      k: ["experience", "years", "how long", "career", "timeline", "history", "progression", "promotion", "intern", "associate", "seniority", "senior", "junior", "work history"],
      a: "<p><strong>3+ years in QA</strong>, all at Proshore:</p>" +
         "<ul><li><strong>QA Intern</strong>, Sep–Dec 2023: manual testing across web and mobile browsers, the team's first structured QA docs</li>" +
         "<li><strong>Associate QA Engineer</strong>, Dec 2023 – Mar 2025: QA standards and test strategy, Playwright on the supplier portal, Azure Pipelines regression, API and SQL database testing</li>" +
         "<li><strong>Mid-Level QA Engineer</strong>, Mar 2025 – now: agentic AI workflows, documentation agent, traceability hub, Postman automation, client demos</li></ul>"
    },
    {
      id: "numbers",
      k: ["numbers", "stats", "metrics", "how many", "test cases", "defects", "bugs found", "ratio", "achievement", "impact", "results"],
      a: "<ul><li><strong>1 : 9</strong> QA engineer to developers</li><li><strong>10,000+</strong> test cases</li><li><strong>1,500+</strong> defects found</li><li><strong>3+</strong> years in quality assurance</li></ul>"
    },
    {
      id: "ai-agent",
      k: ["ai", "agent", "agentic", "automation agent", "llm", "mcp", "model context protocol", "claude", "generate", "ai testing", "artificial intelligence"],
      a: "<p>My <strong>QA Automation Agent</strong> takes a feature in and puts a filed bug out:</p>" +
         "<ul><li>Starts from the running app or a single Azure DevOps card</li><li>Drafts test cases from what the app actually does</li><li>A <strong>human review gate</strong>: nothing reaches Azure DevOps unapproved</li><li>Generates Playwright scripts on the Page Object Model</li><li>Runs them and separates real defects from broken locators</li><li>Drafts the bug report and raises the ticket in Azure DevOps</li></ul>" +
         "<p>The result: manual copy-paste is gone from the QA cycle. I also built a <strong>documentation agent</strong> and a <strong>traceability hub</strong>. Ask about either.</p>"
    },
    {
      id: "docs-agent",
      k: ["documentation agent", "documentation", "docs", "wiki", "functional documentation", "technical documentation"],
      a: "<p>My <strong>Documentation Agent</strong> is a Claude Code workspace that reads a codebase and writes two kinds of documentation: technical detail for developers and a functional description for the client. Output goes to the project wiki, and templates keep all four products consistent.</p><p>Docs are now refreshed when the code changes instead of going stale between releases.</p>"
    },
    {
      id: "hub",
      k: ["dashboard", "traceability", "hub", "power bi", "reporting", "coverage", "pass rate", "flaky", "flake", "sqlite"],
      a: "<p>My <strong>QA Traceability Hub</strong> syncs test plans, cases, defects, regression runs and the requirement traceability matrix from Azure DevOps (via MCP) into one live view. It shows coverage, pass rate and flake trends across every product, so release risk is readable from one screen.</p><p>Built with Node.js, SQLite, the Azure DevOps API, a Playwright reporter and Power BI.</p>"
    },
    {
      id: "playwright",
      k: ["playwright", "typescript", "ci", "cd", "ci/cd", "pipeline", "pipelines", "azure pipelines", "regression", "page object", "pom", "framework", "e2e", "end to end", "automation framework", "junit"],
      a: "<p>I introduced <strong>Playwright (TypeScript)</strong> and wired it into <strong>Azure Pipelines</strong> with JUnit and HTML reporting, so regression runs on every commit instead of on request.</p>" +
         "<ul><li>Page Object Model with reusable authentication state</li><li>Shared login module: one edit when auth changes</li><li>Cross-browser runs across the products in scope</li><li>Flaky specs triaged as their own class of defect</li></ul>"
    },
    {
      id: "api",
      k: ["api", "postman", "newman", "rest", "backend", "sql", "database", "db", "mysql", "data integrity", "schema"],
      a: "<p>I moved API testing from a folder of saved requests to an automated <strong>Postman</strong> suite that checks the contract, the payload and the error paths, not just status codes. <strong>SQL</strong> checks behind the API confirm that what was written matches what was returned.</p><p>API regression now runs automatically, and contract defects are caught before they reach the UI. I also validate rebate, contract and pricing data integrity with SQL.</p>"
    },
    {
      id: "process",
      k: ["process", "standards", "strategy", "test plan", "test strategy", "from scratch", "from zero", "built qa", "methodology", "approach", "risk", "defect workflow", "entry criteria", "exit criteria", "how do you test"],
      a: "<p>When I moved up from intern, Proshore had no QA process: no test plans, no case repository, no defect workflow. I wrote the standards the team still works to:</p>" +
         "<ul><li>A test case library in Azure DevOps</li><li>Test plans, entry and exit criteria, severity definitions</li><li>A defect workflow from report to verified closure</li><li>Risk-based priorities: pricing, contracts and access control before anything cosmetic</li></ul><p>Then I brought every untested backlog app under documented coverage, one app at a time.</p>"
    },
    {
      id: "apps",
      k: ["projects", "products", "applications", "apps", "timesheet", "omnia", "lease farms", "kpi tracker", "what do you test", "work on"],
      a: "<p>I test several De Heus products in parallel:</p>" +
         "<ul><li><strong>Timesheet</strong>, work-time recording. Involved from the start: manual, automation, API and database testing</li>" +
         "<li><strong>Omnia</strong>, pricing data (Replacement, Calculated, Historic) gated by business-unit access. Manual, API and SQL database testing</li>" +
         "<li><strong>Lease Farms</strong>, a farm-mapping workflow linking investors, farms and farmers. Manual, API and Playwright</li>" +
         "<li><strong>KPI Tracker</strong>, KPIs across global and local business units. Playwright and API</li></ul>"
    },
    {
      id: "skills",
      k: ["skills", "tools", "tech stack", "stack", "technologies", "languages", "selenium", "python", "pytest", "appium", "jmeter", "jenkins", "git", "jira", "azure devops", "know", "proficient", "expertise"],
      a: "<ul><li><strong>Automation & AI:</strong> Playwright, TypeScript, POM, agentic AI, MCP, Selenium WebDriver, Python, pytest, Appium</li>" +
         "<li><strong>Testing:</strong> manual, functional, regression, integration, exploratory, UI, access control, localisation, cross-browser, mobile browsers</li>" +
         "<li><strong>API & data:</strong> Postman, REST, schema assertions, SQL, MySQL, SQLite, JMeter</li>" +
         "<li><strong>CI/CD:</strong> Azure Pipelines, JUnit/HTML reporting, Jenkins, Git, GitHub, Node.js, Express</li>" +
         "<li><strong>Process:</strong> QA standards, test strategy, traceability, defect lifecycle, release sign-off, Azure DevOps Test Plans, Jira, Scrum, Power BI</li></ul>"
    },
    {
      id: "learning",
      k: ["learning", "weakness", "weaknesses", "improve", "docker", "k6", "contract testing", "accessibility", "wcag", "growing", "building depth", "gaps"],
      a: "<p>To be honest about where things stand: I'm still building depth in <strong>Docker, k6, contract testing, accessibility audits (WCAG)</strong>, and coaching developers on testing.</p>"
    },
    {
      id: "education",
      k: ["education", "degree", "university", "college", "study", "studied", "bsc", "csit", "graduate", "qualification"],
      a: "<p><strong>BSc in Computer Science & Information Technology</strong>, Prime College, Tribhuvan University (2023). I also completed a QA Automation Apprenticeship at Mindrisers.</p>"
    },
    {
      id: "certs",
      k: ["certification", "certifications", "certificate", "certified", "course", "coursera", "hipaa", "training"],
      a: "<ul><li>Software Quality Assurance (Coursera)</li><li>Selenium WebDriver with Python</li><li>Test Automation with Selenium IDE</li><li>Python Programming (Test Automation University)</li><li>HIPAA Compliance & Privacy Law (University of Pennsylvania)</li><li>QA Automation Apprenticeship (Mindrisers)</li></ul>"
    },
    {
      id: "labs",
      k: ["labs", "practice", "portfolio projects", "personal projects", "side projects", "saucedemo", "cura", "hamropatro", "fakestore", "classicmodels", "github", "samples", "artefacts", "artifacts"],
      a: "<p>Alongside client work I keep <strong>11 testing labs</strong> on public apps, with real test cases, defect reports and automation suites. Examples: SauceDemo (manual plus Selenium/pytest with POM), Cura Healthcare, HamroPatro, RBAC testing, FakeStore API in Postman, and ClassicModels SQL testing.</p><p>See the Labs section of the homepage, or my " + a(GITHUB, "GitHub", true) + ".</p>"
    },
    {
      id: "games",
      k: ["games", "game", "khel", "hobby", "hobbies", "fun", "side project", "free time"],
      a: "<p>I build <strong>Khel · खेल</strong>, a set of free browser games, most in English and Nepali. Examples: haggling in Asan bazaar (Mol-Molai), kite fights over Kathmandu (Changa Chet), and Indra Jatra. Play them at " + a(GAMES, "games.aabhashshahi.com.np", true) + ".</p>"
    },
    {
      id: "before",
      k: ["before qa", "earlier", "previous", "freelance", "upwork", "cloudfactory", "graphic design", "animation", "designer", "data annotation"],
      a: "<p>During my bachelor's I worked as a <strong>data annotator and AI image labeller</strong> at CloudFactory, a <strong>freelance video animator and graphic designer</strong> on Upwork, and a <strong>graphic designer</strong> at Studio OneDay. I also taught a graphic design workshop at Prime College in 2021.</p>"
    },
    {
      id: "philosophy",
      k: ["philosophy", "mindset", "values", "believe", "quality means", "approach to quality"],
      a: "<p>“Quality isn't a phase at the end of development. It's a mindset built into the product.” In practice that means scaling quality with systems (standards, CI regression, AI agents) rather than by running more test cases by hand.</p>"
    },
    {
      id: "ai-reliability",
      k: ["trust", "hallucination", "hallucinate", "human review", "review gate", "approve", "approval", "duplicate", "safeguard", "reliable", "wrong test", "validate ai"],
      a: "<p>A wrong generated test case is worse than none, because it creates false confidence. So I keep two safeguards:</p>" +
         "<ul><li>Generation is constrained to what the application actually does, not guesses about it</li><li>A <strong>human review gate</strong>: every batch is reviewed and nothing reaches Azure DevOps unapproved</li></ul>" +
         "<p>Duplicate tickets were the other risk, since a reporter that files the same bug twice loses the team's trust immediately. The agent is built to avoid that.</p>"
    },
    {
      id: "challenges",
      k: ["challenge", "challenges", "hardest", "difficult", "struggle", "obstacle", "pressure", "failure", "lessons", "lesson learned", "deadline", "conflict", "differently"],
      a: "<p>A few real ones from my case studies:</p>" +
         "<ul><li><strong>Getting standards adopted.</strong> A process written by one person is easy to ignore, so I kept it light and applied it visibly to my own work first.</li>" +
         "<li><strong>Flaky automation.</strong> Stabilising waits and auth state, and triaging flake as its own class of defect, was most of the real work after the first Playwright version.</li>" +
         "<li><strong>The dashboard.</strong> The first version showed too much and stakeholders ignored it. The useful one answers a single question: is this release safe?</li>" +
         "<li><strong>Being the only QA for four products.</strong> That's why I build systems (CI regression, AI agents) instead of running more cases by hand.</li></ul>"
    },
    {
      id: "communication",
      k: ["client demo", "demo", "demos", "stakeholder", "stakeholders", "dutch", "english", "communicate", "communication", "collaborate", "team player", "scrum", "ceremonies", "meetings", "present", "work with developers"],
      a: "<p>I lead product demonstrations and manage end-to-end communication with <strong>Netherlands-based clients and stakeholders</strong>: aligning requirements, functionality, delivery expectations and feedback. Day to day I work inside Scrum ceremonies with nine developers, and I build reporting (like my traceability hub) for clients to read, not just for me.</p>"
    },
    {
      id: "mobile",
      k: ["mobile", "android", "ios", "phone", "phones", "responsive", "device", "devices", "appium", "native app"],
      a: "<p>I've tested web applications across <strong>mobile browsers</strong> and cross-browser since my internship, and I've used <strong>Appium</strong> for mobile automation. Most of my client work is web apps, so to be straightforward: my depth is in mobile-web rather than large native-app suites.</p>"
    },
    {
      id: "performance",
      k: ["performance", "load", "stress", "jmeter", "k6", "speed", "scalability", "benchmark", "non functional"],
      a: "<p>I've used <strong>JMeter</strong> for performance testing. <strong>k6</strong> is on my \"building depth in\" list, so I won't oversell it: functional, regression, API and database testing are where I'm strongest today.</p>"
    },
    {
      id: "security",
      k: ["security", "access control", "rbac", "role based", "permission", "permissions", "authorisation", "authorization", "authentication", "hipaa", "privacy", "penetration", "pentest"],
      a: "<p>Access control is a core part of my testing. Omnia's pricing data is gated by business-unit access, and I prioritise access control alongside pricing and contracts by risk. I've also done a dedicated <strong>role-based access control lab</strong> (authentication, authorisation, CRUD permissions) and hold a <strong>HIPAA Compliance & Privacy Law</strong> certificate (University of Pennsylvania).</p><p>I don't claim penetration-testing expertise.</p>"
    },
    {
      id: "location",
      k: ["location", "located", "where", "based", "live", "country", "nepal", "kathmandu", "remote", "timezone", "time zone", "relocate", "relocation", "onsite"],
      a: "<p>I'm based in <strong>Kathmandu, Nepal</strong>, and I already work daily with Netherlands-based clients and stakeholders. For remote setups, overlap hours or relocation, let's talk directly. " + CONTACT_LINE + "</p>"
    },
    {
      id: "hiring",
      k: ["available", "availability", "open to", "looking for", "opportunity", "opportunities", "hire", "hiring", "salary", "rate", "notice period", "full time", "freelance work", "contract", "interview", "work together"],
      a: "<p>For roles, availability, notice period or compensation, please reach out to me directly. That's a conversation, not something this assistant should guess at.</p><p>" + CONTACT_LINE + " My " + a(RESUME, "resume (PDF)", true) + " has the full detail.</p>"
    },
    {
      id: "contact",
      k: ["contact", "email", "mail", "reach", "phone", "call", "linkedin", "message", "get in touch", "connect", "number"],
      a: "<p>" + CONTACT_LINE + "</p><p>I'm also on " + a(GITHUB, "GitHub", true) + ".</p>"
    },
    {
      id: "resume",
      k: ["resume", "résumé", "cv", "pdf", "download"],
      a: "<p>Here's my " + a(RESUME, "resume (PDF)", true) + ".</p>"
    },
    {
      id: "bot",
      k: ["are you a bot", "are you ai", "are you real", "how do you work", "who made you", "chatbot", "is this aabhash"],
      a: "<p>This is an automated assistant built into my portfolio. It answers in my voice from the content on this site. For anything it can't cover, " + a("mailto:" + EMAIL, "email me") + " and you'll get the real me.</p>"
    },
    {
      id: "thanks",
      k: ["thanks", "thank you", "cheers", "great", "awesome", "cool", "bye", "goodbye"],
      a: "<p>Thanks for stopping by! If you'd like to talk, " + a("mailto:" + EMAIL, "email me") + " or grab my " + a(RESUME, "resume", true) + ".</p>"
    }
  ];

  var FALLBACK =
    "<p>That one isn't covered on my portfolio. Try asking about my experience, AI agents, skills, education or contact details, or ask me directly.</p><p>" + CONTACT_LINE + "</p>";

  var CHIPS = ["What do you do?", "Tell me about your AI agent", "Skills", "Experience", "How can I contact you?"];

  /* ── local matcher ──────────────────────────────────── */
  function norm(s) {
    return (" " + s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9/éऀ-ॿ]+/g, " ") + " ").replace(/\s+/g, " ");
  }
  function stem(w) { return w.length > 4 ? w.replace(/(ing|ed|es|s)$/, "") : w; }
  function tokens(s) { return norm(s).trim().split(" ").filter(Boolean).map(stem); }
  // Filler words carry no topic; dropped by the dataset classifier (unless nothing else is left).
  var STOP = {};
  ("a an the is are am was were be been do does did can could would should will i me my we our us it its this that " +
   "to of in on for at by with and or so ok okay just please tell know like want wondering curious quick question " +
   "about some any one more thing hey well also really briefly short there here as you your yourself youre aabhash aabhashs " +
   "what whats thanks thank cheers hi hello great cool awesome nice").split(" ").forEach(function (w) { STOP[w] = 1; });
  function topicTokens(s) {
    var t = tokens(s), f = t.filter(function (w) { return !STOP[w]; });
    return f.length ? f : t;
  }

  /* Dataset classifier: TF-IDF nearest neighbour over labelled example
     questions (chat-data.js, built from datasets/intents.json), with
     typo tolerance. Falls back to keywords when the data isn't loaded. */
  function editWithin(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i]; var rowMin = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (a[i - 2] === b[j - 1] && a[i - 1] === b[j - 2]) cur[j] = Math.min(cur[j], prev[j - 2] + 1); // swap
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return false;
      prev = cur;
    }
    return prev[b.length] <= max;
  }
  function createClassifier(examples) {
    var df = {}, docs = [], N = examples.length;
    examples.forEach(function (ex) {
      var t = topicTokens(ex[0]), seen = {};
      t.forEach(function (w) { if (!seen[w]) { seen[w] = 1; df[w] = (df[w] || 0) + 1; } });
      docs.push({ t: t, intent: ex[1] });
    });
    var vocab = Object.keys(df);
    function idf(w) { return Math.log((N + 1) / ((df[w] || 0) + 1)) + 1; }
    function vec(t) {
      var v = {}, n = 0, w;
      t.forEach(function (x) { v[x] = (v[x] || 0) + 1; });
      for (w in v) { v[w] *= idf(w); n += v[w] * v[w]; }
      n = Math.sqrt(n) || 1;
      for (w in v) v[w] /= n;
      return v;
    }
    docs.forEach(function (d) { d.v = vec(d.t); });
    // Intent centroids: the average direction of all of an intent's examples.
    var cent = {};
    docs.forEach(function (d) {
      var c = cent[d.intent] || (cent[d.intent] = {});
      for (var w in d.v) c[w] = (c[w] || 0) + d.v[w];
    });
    Object.keys(cent).forEach(function (k) {
      var c = cent[k], n = 0, w;
      for (w in c) n += c[w] * c[w];
      n = Math.sqrt(n) || 1;
      for (w in c) c[w] /= n;
    });
    var fixCache = {};
    function fix(w) {
      if (df[w] || w.length < 4 || /^\d+$/.test(w)) return w;
      if (w in fixCache) return fixCache[w];
      var max = w.length >= 8 ? 2 : 1, best = w, bestDf = 0;
      vocab.forEach(function (v) { if (v[0] === w[0] && df[v] > bestDf && editWithin(w, v, max)) { best = v; bestDf = df[v]; } });
      return (fixCache[w] = best);
    }
    return function classify(q) {
      var qt = topicTokens(q).map(fix).filter(function (w) { return df[w]; });
      if (!qt.length) return {};
      var qv = vec(qt), byIntent = {};
      docs.forEach(function (d) {
        var s = 0, w;
        for (w in qv) if (d.v[w]) s += qv[w] * d.v[w];
        if (!byIntent[d.intent] || s > byIntent[d.intent]) byIntent[d.intent] = s;
      });
      // Blend nearest example with the intent centroid: robust to one lucky short example.
      Object.keys(cent).forEach(function (k) {
        var c = cent[k], s = 0, w;
        for (w in qv) if (c[w]) s += qv[w] * c[w];
        byIntent[k] = NN_WEIGHT * (byIntent[k] || 0) + (1 - NN_WEIGHT) * s;
      });
      return byIntent;
    };
  }

  // Tuned with: node datasets/eval.mjs --sweep (on the dev split).
  var MIN_SIM = 0.275, KW_WEIGHT = 0.04, NN_WEIGHT = 0.5;
  var classifier = null;
  function useData(examples) {
    if (!examples || !examples.length) return;
    var all = examples.slice();
    KB.forEach(function (item) { item.k.forEach(function (kw) { all.push([kw, item.id]); }); });
    classifier = createClassifier(all);
  }
  function byId(id) { for (var i = 0; i < KB.length; i++) if (KB[i].id === id) return KB[i]; return null; }

  // Pick the intent from similarity + keyword scores. Returns an id, or "out_of_scope".
  function decide(sim, kw) {
    var best = "out_of_scope", bestScore = 0, ids = {}, id;
    for (id in sim) ids[id] = 1;
    for (id in kw) ids[id] = 1;
    for (id in ids) {
      var s = (sim[id] || 0) + KW_WEIGHT * Math.min(kw[id] || 0, 6);
      if (s > bestScore) { bestScore = s; best = id; }
    }
    return bestScore >= MIN_SIM ? best : "out_of_scope";
  }
  function classifyQuestion(q) {
    var kw = keywordScores(q);
    if (!classifier) {
      var bestK = null;
      for (var k in kw) if (!bestK || kw[k] > kw[bestK]) bestK = k;
      return bestK && kw[bestK] >= 1 ? bestK : "out_of_scope";
    }
    return decide(classifier(q), kw);
  }
  function localAnswer(q) {
    var item = byId(classifyQuestion(q));
    return item ? item.a : FALLBACK;
  }

  function keywordScores(q) {
    var text = norm(q);
    var words = text.trim().split(" ").map(stem);
    var out = {};
    KB.forEach(function (item) {
      var score = 0;
      item.k.forEach(function (kw) {
        var nk = norm(kw).trim();
        if (nk.indexOf(" ") > -1) {
          if (text.indexOf(" " + nk + " ") > -1) score += 3;
        } else if (words.indexOf(stem(nk)) > -1) {
          score += nk.length <= 3 ? 1 : 1.5;
        }
      });
      // short greetings shouldn't win over a real question
      score *= item.w || 1;
      if ((item.id === "hello" || item.id === "thanks") && words.length > 4) score *= 0.3;
      if (score > 0) out[item.id] = score;
    });
    return out;
  }

  // Load the example dataset (chat-data.js) lazily, the first time the chat opens.
  var dataRequested = false;
  function loadData() {
    if (dataRequested) return;
    dataRequested = true;
    if (window.ASK_DATA) return useData(window.ASK_DATA);
    var me = document.querySelector('script[src*="chat.js"]');
    var s = document.createElement("script");
    s.src = me ? me.src.replace(/chat\.js(\?.*)?$/, "chat-data.js") : "chat-data.js";
    s.onload = function () { useData(window.ASK_DATA); };
    document.head.appendChild(s);
  }

  // Exposed for datasets/eval.mjs.
  window.AskBot = { createClassifier: createClassifier, decide: decide,
    scores: function (q) { return { sim: classifier ? classifier(q) : {}, kw: keywordScores(q) }; }, useData: useData, classify: classifyQuestion, kbIds: function () { return KB.map(function (k) { return k.id; }); },
    tune: function (minSim, kwWeight, nnWeight) { MIN_SIM = minSim; if (kwWeight != null) KW_WEIGHT = kwWeight; if (nnWeight != null) NN_WEIGHT = nnWeight; } };

  /* ── remote (Claude via Worker) ─────────────────────── */
  var history = []; // {role, content} plain text, sent to the Worker
  function remoteAnswer() {
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 30000) : null;
    return fetch(ASK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-10) }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (d) {
      if (!d || typeof d.reply !== "string" || !d.reply.trim()) throw new Error("empty");
      return d.reply;
    });
  }
  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  // Render model text safely: escape everything first, then add links, bold and bullet lists.
  function renderText(t) {
    return esc(t.trim()).split(/\n{2,}/).map(function (b) {
      var lines = b.split("\n");
      function inline(s) {
        return s
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>')
          .replace(/\b[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi, function (m) { return '<a href="mailto:' + m + '">' + m + "</a>"; });
      }
      if (lines.every(function (l) { return /^\s*[-*•]\s+/.test(l); })) {
        return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\s*[-*•]\s+/, "")) + "</li>"; }).join("") + "</ul>";
      }
      return "<p>" + lines.map(inline).join("<br>") + "</p>";
    }).join("");
  }
  function htmlToText(html) {
    var d = document.createElement("div"); d.innerHTML = html; return (d.textContent || "").trim();
  }

  /* ── UI ─────────────────────────────────────────────── */
  var ICON_CHAT = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-3.5 3v-3H4A1.5 1.5 0 0 1 2.5 13V6A1.5 1.5 0 0 1 4 4.5Z"/><path d="M6.5 8.5h7M6.5 11h4.5"/></svg>';
  var ICON_X = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"/></svg>';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    var launch = el("button", "ask-launch", ICON_CHAT + '<span class="ask-launch-label">Ask me anything</span>');
    launch.type = "button";
    launch.setAttribute("aria-controls", "ask-panel");
    launch.setAttribute("aria-expanded", "false");
    launch.setAttribute("aria-label", "Ask Aabhash a question");

    var panel = el("section", "ask-panel");
    panel.id = "ask-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Ask Aabhash");
    panel.innerHTML =
      '<header class="ask-head"><span class="ask-mono" aria-hidden="true">AS</span>' +
      '<div><div class="ask-title">Ask Aabhash</div><div class="ask-sub">Automated assistant · answers from this portfolio</div></div>' +
      '<button class="ask-close" type="button" aria-label="Close chat">' + ICON_X + "</button></header>" +
      '<div class="ask-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="ask-chips" aria-label="Suggested questions"></div>' +
      '<form class="ask-form" autocomplete="off">' +
      '<label for="ask-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">Your question</label>' +
      '<input class="ask-input" id="ask-input" type="text" maxlength="500" placeholder="Ask about my work, skills, contact…" />' +
      '<button class="ask-send" type="submit" aria-label="Send" disabled>' + ICON_SEND + "</button></form>" +
      '<div class="ask-note">' + (ASK_ENDPOINT ? "AI-generated answers can be imperfect. Please confirm details with me." : "Answers are drawn from the content on this site.") + "</div>";

    document.body.appendChild(launch);
    document.body.appendChild(panel);

    var log = panel.querySelector(".ask-log");
    var chips = panel.querySelector(".ask-chips");
    var form = panel.querySelector(".ask-form");
    var input = panel.querySelector(".ask-input");
    var send = panel.querySelector(".ask-send");
    var closeBtn = panel.querySelector(".ask-close");
    var busy = false, greeted = false;

    function add(role, html) {
      var m = el("div", "ask-msg " + (role === "user" ? "ask-user" : "ask-bot"), html);
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    }
    function renderChips() {
      chips.innerHTML = "";
      CHIPS.forEach(function (c) {
        var b = el("button", "ask-chip"); b.type = "button"; b.textContent = c;
        b.addEventListener("click", function () { ask(c); });
        chips.appendChild(b);
      });
    }
    function open() {
      loadData();
      panel.classList.add("is-open");
      launch.setAttribute("aria-expanded", "true");
      if (!greeted) {
        greeted = true;
        add("bot", "<p>Hi! Ask me anything about my QA work, the AI agents I've built, my skills or how to reach me.</p><p>(This is an automated assistant. Answers come from my portfolio.)</p>");
        renderChips();
      }
      setTimeout(function () { input.focus(); }, 60);
    }
    function close() {
      panel.classList.remove("is-open");
      launch.setAttribute("aria-expanded", "false");
      launch.focus();
    }

    function ask(q) {
      q = (q || "").trim();
      if (!q || busy) return;
      busy = true; send.disabled = true;
      chips.innerHTML = "";
      var u = add("user", ""); u.textContent = q;
      history.push({ role: "user", content: q });
      input.value = "";
      var typing = add("bot", '<span class="ask-typing" aria-label="Typing"><span></span><span></span><span></span></span>');

      function finish(html) {
        typing.innerHTML = html;
        history.push({ role: "assistant", content: htmlToText(html) });
        log.scrollTop = log.scrollHeight;
        busy = false; send.disabled = !input.value.trim();
        input.focus();
      }
      if (ASK_ENDPOINT) {
        remoteAnswer().then(function (t) { finish(renderText(t)); }, function () { finish(localAnswer(q)); });
      } else {
        setTimeout(function () { finish(localAnswer(q)); }, 350 + Math.random() * 250);
      }
    }

    launch.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    input.addEventListener("input", function () { send.disabled = busy || !input.value.trim(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); } });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
