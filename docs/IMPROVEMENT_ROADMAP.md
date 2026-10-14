# Improvement Roadmap

**Owner:** Christopher J. Callaghan  
**Repository:** christopherjcallaghan2026  
**Last updated:** 2026-10-14  
**Purpose:** A practical, prioritised plan for improving christopherjcallaghan.com and expanding its tools into a reliable lead-generation product.

## North-star outcome

Turn the website into a credible developer/business-builder hub that demonstrates real capability, attracts UK-wide project enquiries worth £1,000+, and converts useful free tools into qualified service leads. Prioritise working outcomes over AI buzzwords, vanity scores or fake ranking data.

## Phase 0 — Baseline and release confidence (P0)

- [ ] Confirm default branch, latest commit and deployed production commit.
- [ ] Run `npm run lint`, `npm test` and `npm run build`; record actual outputs.
- [ ] Resolve README version/setup inconsistencies and document the canonical runtime.
- [ ] Verify required environment variables and database migrations in a safe environment.
- [ ] Smoke-test home, services, projects, tools, contact, blog, classes/checkout and admin boundaries.
- [ ] Check for console errors, broken links, missing assets and mobile overflow.
- [ ] Review live forms, email delivery and Stripe flows without triggering real payments.
- [ ] Establish a baseline for Search Console, analytics, enquiries and page performance where data is available.

**Exit criteria:** a repeatable build/test result, an accurate setup guide, and a list of production issues based on evidence.

## Phase 1 — Tools hub and mega-menu (P1)

- [ ] Make `src/data/tools.ts` the source of truth for tool cards and navigation entries.
- [ ] Replace the generic future-tools placeholder with grouped, intentional tool categories.
- [ ] Add a desktop Tools mega-menu grouped into Website & SEO, Structured Data, AI & eCommerce, and Business Tools.
- [ ] Ensure menu links work with mouse, keyboard, touch and reduced-motion preferences.
- [ ] Preserve mobile navigation parity and make the current tool obvious.
- [ ] Add consistent tool page layouts for intro, input, progress, findings, limitations, fixes and CTA.
- [ ] Add dedicated metadata and canonical URL for each tool route.
- [ ] Add new canonical routes to sitemap and link them from relevant service pages.

**Exit criteria:** every visible live-tool link resolves directly, refreshes correctly, and has a distinct page title/description.

## Phase 2 — Ship the three requested tools (P1)

### 2.1 Extend the existing Website Grader — `/tools/website-grader`

The existing grader already has a staged scan engine and report UI. Extend it in place; do not create a competing `/tools/ai-seo-audit` route or duplicate the scan engine.

- [x] Inspect the existing SEO and AI checks and record initial false-positive/scoring gaps; continue the wider coverage audit as part of follow-up work.
- [x] Replace broad robots.txt text matching with user-agent-group-aware checks for known AI crawlers.
- [x] Treat missing robots.txt as not measured for AI crawler-specific access, rather than assuming crawlers are allowed.
- [x] Remove score penalties based only on word count or unique vocabulary; these are context, not content-quality measurements.
- [x] Avoid scoring title/meta and internal-link signals twice across SEO and AI categories.
- [x] Tighten structured-data wording so JSON syntax validation is not presented as full Schema.org/rich-result validation.
- [x] Detect JSON-LD types nested inside arrays and `@graph` blocks.
- [x] Replace generic-word identity guesses with a named-entity schema/visible-text consistency signal.
- [x] Reword question/answer signals to disclose that answer quality is not evaluated.
- [ ] Continue the broader review for remaining false positives and category-weighting issues.
- [ ] Preserve evidence, explanations, recommended fixes, scan metadata and limitations.
- [ ] Preserve existing report persistence, share links, PDF, email and fix-my-website flows while testing blocked URLs, redirects, timeouts, large responses and malformed HTML.
- [ ] Keep `/tools/website-grader` as the canonical route and sitemap entry; do not add `/tools/ai-seo-audit`.

### 2.2 Structured Data Validator — `/tools/structured-data-validator`

- [ ] Support pasted JSON-LD first, then public URL fetching with security controls.
- [ ] Parse multiple JSON-LD script blocks and nested `@graph` entities.
- [ ] Show syntax errors, detected types, common property omissions and copyable findings.
- [ ] Distinguish JSON syntax validity, Schema.org vocabulary checks and Google's rich-result requirements.
- [ ] Link users to Schema.org Validator and Google Rich Results Test.
- [ ] Add tests for malformed JSON, multiple blocks, arrays, graphs and unsupported types.

### 2.3 AI eCommerce Readiness Report — `/tools/ai-ecommerce-report`

- [ ] Inspect product-page accessibility, title, product description, canonical, images and detectable Product structured data.
- [ ] Report price/availability only when observable and label the source.
- [ ] Provide actionable product-page and technical-readiness recommendations.
- [ ] Explicitly state that this is a readiness checklist, not a measurement of whether ChatGPT or another AI system recommends a product.
- [ ] Keep merchant-feed or agentic-commerce integrations out of scope until documented APIs and real access are available.

**Exit criteria for all tools:** tests pass, every finding has evidence or is marked unknown, no unsafe fetch path is possible, and the tool has a useful next step without gating the free result.

## Phase 3 — Conversion and trust (P1/P2)

- [ ] Audit hero copy for clear audiences, outcomes and calls to action.
- [ ] Make the primary route obvious: project enquiry, selected work, or relevant tool.
- [ ] Improve project case studies with problem, role, architecture, delivery, verified outcomes and screenshots.
- [ ] Clearly label demonstrative metrics and remove unsupported performance claims.
- [ ] Add contextual CTAs from tool findings to relevant services (SEO, development, automation, eCommerce).
- [ ] Keep enquiry forms short, validate inputs and show clear success/failure states.
- [ ] Track tool starts, completed reports, copied/downloaded reports and qualified enquiries with consent-aware analytics.
- [ ] Add a privacy note describing what tool inputs/results are processed and retained.

## Phase 4 — SEO, accessibility and performance (P2)

- [ ] Validate titles/descriptions/canonicals across all public routes.
- [ ] Verify sitemap URLs, no accidental duplicate routes and correct robots directives.
- [ ] Verify Person/Organization JSON-LD and all `sameAs` links.
- [ ] Test headings, landmarks, keyboard navigation, focus visibility, contrast and screen-reader labels.
- [ ] Audit image dimensions, font loading, client-side bundles, animations and 3D effects.
- [ ] Respect reduced motion and keep meaningful content usable if WebGL fails.
- [ ] Run Lighthouse on representative pages and compare against a recorded baseline.
- [ ] Use Search Console data for real queries, clicks, impressions and average position only for authorised properties.

## Phase 5 — Ranking/reporting strategy (P2)

Google does not provide a general unrestricted endpoint for arbitrary live keyword rank checks. Do not scrape Google result pages or invent rankings.

- [ ] Keep manual ranking observations clearly labelled with date, keyword, location/device context and source.
- [ ] Consider an explicit Google Search Console connection for verified site owners.
- [ ] Report Search Console average position as an aggregate metric with date range, query and page context—not a guaranteed current rank.
- [ ] Evaluate third-party rank APIs only after a cost, licence, reliability and quota review.
- [ ] Add data provenance and freshness labels to every ranking/reporting view.

## Phase 6 — Operational hardening (P2/P3)

- [ ] Add URL-fetch SSRF protection for IPv4/IPv6, redirects, DNS resolution, ports, timeouts, content size and content types.
- [ ] Add rate limits, concurrency limits and sensible caching.
- [ ] Add structured error logging without secrets or unnecessary user data.
- [ ] Add regression tests for tool parsing, route metadata and security boundaries.
- [ ] Document database migration order and recovery procedure.
- [ ] Add a deployment checklist for Preview versus Production environment separation.

## Suggested issue labels

`priority:P0`, `priority:P1`, `priority:P2`, `area:tools`, `area:seo`, `area:ux`, `area:security`, `area:docs`, `area:testing`, `good first issue`.

## Weekly review

At each review, update this file and GitHub issues with:
1. What shipped and which production commit contains it.
2. Tests/builds actually run and their results.
3. Any blockers, evidence and owner.
4. Tool completions and qualified enquiries, where analytics consent and data availability permit.
5. The next three highest-value tasks.

Avoid marking tasks complete merely because code exists; require tests and deployment verification.
