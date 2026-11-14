# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers evaluating Aabhash for a full-time QA or test-automation role, meaning QA leads, engineering managers and technical recruiters (confirmed 2026-11-13). They skim fast and look for scope, seniority and tooling backed by proof. Then they decide whether to reach out or download the resume. They mostly arrive from LinkedIn, job applications or a resume link, on a laptop and sometimes on a phone.

## Product Purpose

Aabhash's personal portfolio at aabhashshahi.com.np. Its job is to get Aabhash shortlisted. It makes the scope of the work clear within seconds: the sole QA engineer for nine developers across four De Heus products at Proshore. It proves that scope with concrete projects and keeps contact and the resume one step away. Success means a hiring manager gets in touch or downloads the resume.

## Positioning

Aabhash scaled a one-person quality function by building systems, not by running more test cases. Aabhash wrote the QA standards from zero, put Playwright regression into Azure Pipelines to run on every commit, and built agentic AI workflows that take a feature all the way to a filed ticket. Aabhash also built a documentation agent and a traceability dashboard. All of this happened at one company, rising from intern (Sep 2023) to mid-level QA engineer (Mar 2025).

## Operating Context

The clients are Netherlands-based: De Heus, served through Proshore. Aabhash works from Kathmandu, Nepal. The work lives in Azure DevOps (test plans, the case library, pipelines, the wiki), Playwright with TypeScript, Postman and SQL.

## Capabilities and Constraints

- The site is static HTML, CSS and vanilla JS with no build step. It deploys to GitHub Pages on a custom domain (CNAME).
- The homepage must keep every current section: hero, about, experience (3 roles), projects (6 with case studies), client applications (4), testing labs (11), skills (6 groups), the philosophy quote, credentials and contact (confirmed 2026-11-13).
- The email address is assembled at runtime so scrapers miss it. Keep that pattern.
- The current site ships light and dark themes with a toggle. Its design tokens live in `styles.css`.

## Brand Commitments

- Name: Aabhash Shahi, with the "AS" monogram.
- The project keeps its own design system (the tokens in `styles.css`). The Proshore design system plugin was declined for this project (2026-11-13).
- Voice: plain, specific and honest about limits. For example, the "Building depth in" skills group is described as "honest about where these stand today". No hype.

## Evidence on Hand

- Real copy in `index.html`: roles and bullets, projects, client applications, labs (with GitHub and Sheets links), skills, education and certifications.
- Figures: a 1 : 9 QA-to-developer ratio, 10000+ test cases, 1500+ defects found and 3+ years of experience. The "90% Bug-Free Rate" figure is marked `is-placeholder` in the markup and is unverified.
- Case-study narratives in `script.js` (`CASES`). Their result numbers are unfilled placeholders (`[X]`, `[N]`) and must not be shown or invented.
- Images: `images/about-photo.png` (portrait), `avatar.png`, `hero-person.png`, `hero-photo.png`, certificate scans, the CSIT Goal Fest 2023 photo and the Red Cross membership photo.
- Resume: `images/Aabhash_Shahi_QA_Resume.pdf`.
- Not available: testimonials, references, screenshots of the AI agents or dashboard, and client logos cleared for use. Do not fabricate any of these.

## Product Principles

1. Proof over adjectives: every claim ties back to a role, a project or an artifact.
2. Readable in 30 seconds, with depth for anyone who wants it.
3. Honest about career stage: skills still being built are labelled as such.
4. Contact and the resume are always one step away.
