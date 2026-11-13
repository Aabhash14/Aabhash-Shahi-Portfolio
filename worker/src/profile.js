// Grounding for the AI assistant. Keep in sync with index.html.
// Only facts published on the portfolio. Nothing private, no unverified figures.
export const PROFILE = `
# Aabhash Shahi: portfolio facts

## Summary
QA engineer who builds AI agents, not just test cases. Mid-Level QA Engineer at Proshore (Kathmandu, Nepal), client De Heus (Netherlands-based global animal-nutrition group). Sole QA engineer for nine developers across multiple De Heus products. Built the company's QA practice from zero, put Playwright regression into Azure Pipelines on every commit, and built agentic AI workflows that take a feature all the way to a filed ticket. Rose from intern (Sep 2023) to mid-level (Mar 2025) at one company.

Figures: QA-to-developer ratio 1:9; 10,000+ test cases; 1,500+ defects found; 3+ years in QA.

## Roles (all at Proshore, Kathmandu)
- Software QA Intern, Sep 2023 – Dec 2023: explored and tested live client apps end to end; manual test cases across web and mobile browsers; created the team's first structured QA documentation.
- Associate QA Engineer, Dec 2023 – Mar 2025: brought untested backlog apps under documented QA coverage; defined QA standards and test strategy (planning, coverage, regression, defect management); introduced Playwright automation for the supplier portal; configured Azure Pipelines to run regression continuously; API and database testing with SQL to validate rebate and contract data.
- Mid-Level QA Engineer, Mar 2025 – present (client De Heus): agentic AI workflows automating the QA lifecycle (case and script generation, execution, defect analysis, bug reporting, ticket creation); AI documentation agent; Postman API automation (CRUD, status codes, negative scenarios, error paths); centralised QA dashboard; product demos and end-to-end communication with Netherlands-based clients in Scrum; supports production deployments and release validation.

## Projects
- QA Automation Agent (agentic AI): from a running app or one Azure DevOps card, drafts test cases from actual app behaviour, then a human review gate (nothing reaches Azure DevOps unapproved), generates Playwright scripts on the Page Object Model, runs them and separates real defects from broken locators, drafts the bug report and raises the Azure DevOps ticket. Result: manual copy-paste removed from the QA cycle. Stack: agentic AI, Model Context Protocol, Playwright, TypeScript, Azure DevOps API.
- Documentation Agent: a Claude Code workspace that reads a codebase and produces technical docs for developers and functional docs for the client; publishes to the project wiki; templates keep four products consistent. Docs are refreshed on change instead of going stale.
- QA Traceability Hub: syncs test plans, cases, defects, regression runs and the requirement traceability matrix from Azure DevOps via MCP; one live view of coverage, pass rate and flake trends. Stack: Node.js, SQLite, Azure DevOps API, Playwright reporter, Power BI.
- Playwright in continuous regression: Page Object Model, reusable auth state, shared login module, cross-browser runs, JUnit and HTML reporting in Azure Pipelines. Regression runs on every commit instead of on request.
- QA standards from zero: Azure DevOps test case library; test plans, entry and exit criteria, severity definitions; defect workflow; risk-based prioritisation (pricing, contracts, access control first). Every backlog app brought under documented coverage.
- Postman API automation: contract, schema and payload assertions plus error paths; SQL verification behind the API; automated runs (Newman, Azure Pipelines). Contract defects caught before the UI.

## Client applications (De Heus)
- Timesheet: work-time recording; involved from the start; manual, automation, API, database testing.
- Omnia: Replacement, Calculated (Sales) and Historic pricing data gated by business-unit access; manual, API, database testing.
- Lease Farms: farm-mapping workflow connecting investors, farms and farmers; manual, API, Playwright automation.
- KPI Tracker: KPIs across global and local business units; Playwright automation and API testing.

## Skills
- Automation & AI: Playwright, TypeScript, Page Object Model, agentic AI workflows, Model Context Protocol, AI-generated test cases and scripts, Selenium WebDriver, Python, pytest, Appium.
- Testing: manual, functional, regression, integration, exploratory, UI and layout, access control, localisation, cross-browser, mobile browsers.
- API & data: Postman, API automation, REST, schema and status assertions, SQL, MySQL, SQLite, JMeter.
- CI/CD & engineering: Azure Pipelines, continuous regression, JUnit and HTML reporting, Jenkins, Git, GitHub, Node.js, Express.
- Process: QA standards, test strategy, risk-based prioritisation, test case design, traceability, defect lifecycle, release sign-off, Azure DevOps Test Plans, Jira, Agile/Scrum, Power BI, technical and functional documentation.
- Still building depth in (be honest about these): Docker, k6, contract testing, accessibility audits (WCAG), coaching developers on testing.

## Testing labs (self-directed, public apps; on GitHub)
BrandifyPro web app, SauceDemo manual, Cura Healthcare manual, HamroPatro functional, role-based access control, FakeStore API (Postman), ClassicModels database (SQL), SauceDemo Selenium + pytest suite with POM, Cura Healthcare automation, form validation automation, data-driven automation. 11 labs in total.

## Before QA (during the bachelor's)
Data annotator and AI image labeller at CloudFactory; freelance video animator and graphic designer on Upwork; graphic designer at Studio OneDay; instructor for a graphic design workshop at Prime College (2021).

## Education and credentials
BSc Computer Science & Information Technology, Prime College, Tribhuvan University, 2023. QA Automation Apprenticeship, Mindrisers. Certifications: Software Quality Assurance (Coursera); Selenium WebDriver with Python; Test Automation with Selenium IDE; Python Programming (Test Automation University); HIPAA Compliance & Privacy Law (University of Pennsylvania).

## Side project
Khel (खेल): free browser games, most in English and Nepali, at games.aabhashshahi.com.np. Examples: Mol-Molai (haggling in Asan bazaar), Bato Harayo, Changa Chet (kite fights), Indra Jatra, Himal Climb, Imposter, Duo.

## Philosophy
"Quality isn't a phase at the end of development. It's a mindset built into the product."

## Contact
Based in Kathmandu, Nepal. LinkedIn: https://www.linkedin.com/in/aabhash-shahii/ . GitHub: https://github.com/Aabhash14 . Phone: +977 9813504916. Resume: https://www.aabhashshahi.com.np/images/Aabhash_Shahi_QA_Resume.pdf . Email: use the Email button on the site (do not write out an email address).
`;
