# Website & Repository Audit — ChristopherJCallaghan2026

**Audit date:** 2026-10-14  
**Repository:** https://github.com/chriscallaghan2012/christopherjcallaghan2026  
**Live site:** https://christopherjcallaghan.com  
**Status:** Initial repository-level audit. The live site was not fully crawled or tested end-to-end during this pass; verify all findings against production before treating them as confirmed runtime defects.

## Executive summary

The repo already contains a useful foundation: a Next.js App Router application, a reusable tools directory, website grader, llms.txt builder, business launch checklist, service landing pages, sitemap/robots metadata, structured data, Neon-backed features, and a responsive mega-menu. The highest-value next step is to turn the tools area into a coherent, credible lead-generation product—not to build a pretend Google rankings tracker.

### Priorities

1. **P0 — Establish a trustworthy baseline:** run install, typecheck, tests, production build, route smoke tests and production checks; resolve README/configuration drift.
2. **P1 — Make tools a first-class product section:** add real routes, shared cards and mega-menu groupings for tools that can be built and maintained reliably.
3. **P1 — Make every tool honest and useful:** explain what is measured, show evidence and limitations, provide actionable fixes, and avoid unsupported ranking or AI-visibility claims.
4. **P1 — Improve conversion:** each tool should offer a clear next step into a paid audit, implementation enquiry or relevant service, without blocking the free result.
5. **P2 — Improve discoverability and accessibility:** route metadata, sitemap inclusion, internal linking, keyboard/mobile navigation, error/loading states and performance.
6. **P2 — Add repeatable QA and monitoring:** tests for each tool, safe URL fetching, rate limits, SSRF protection and operational logging.

## Findings from repository inspection

### Confirmed from inspected source

- `package.json` runs Next.js commands and declares Next.js 16 / React 19, but also includes Vite, the Vite React plugin and Tailwind's Vite plugin. `vite.config.ts` and `src/main.tsx` are present. Determine whether these are intentional legacy/AI Studio artefacts; document the canonical runtime and remove only after verifying nothing depends on them.
- The README's feature section says **Next.js 15**, while its opening description says **Next.js 16**. It also describes setup requirements and migrations that should be checked against current migrations and actual runtime behaviour.
- `src/data/tools.ts` currently lists three live tools: Website Grader, llms.txt Builder and Business Launch Checklist. The directory has a generic “More free tools in development” card.
- `src/components/SimpleNavbar.tsx` already has a Services mega-menu and a Tools navigation item. Add a real Tools mega-menu rather than duplicating links in unrelated places.
- `app/sitemap.ts` explicitly lists current tools. New public tool routes need to be added there; ensure each has unique metadata/canonical URLs and avoid duplicate URLs.
- `app/robots.ts` allows public crawling and disallows admin paths.
- `app/layout.tsx` provides site-wide metadata and JSON-LD for Person/Organization. Its `sameAs` currently references LinkedIn; confirm that profile is live and controlled by the site owner before retaining it.
- Service page data includes illustrative metrics such as +14% organic clicks and +8% qualified enquiries. Ensure these are clearly labelled as illustrative examples, not presented as actual client results without evidence.
- The README says automatic ranking providers are not connected yet. Treat ranking observations as manual/verified data unless a permitted, documented data source is implemented.

### Not verified in this audit

- Current production availability, visual behaviour, Lighthouse scores, Core Web Vitals, indexed URLs, analytics events, live form/checkout delivery, production environment variables, database migration state, security headers and current test/build outcomes.
- Whether the current production site exactly matches the default branch.
- Google Search Console ownership and any existing connected data source.

## Product direction: Tools hub

Position the tools as **free, evidence-led website and business utilities** that demonstrate engineering ability and lead naturally to implementation work. Do not promise Google rankings or guaranteed AI recommendations.

### Initial tools

| Tool | Route proposal | MVP scope | Important limitation |
|---|---|---|---|
| AI SEO & Website Audit | `/tools/ai-seo-audit` | Deterministic technical checks: titles, descriptions, headings, canonical, robots/sitemap availability, structured data detection, Open Graph and crawl access where verifiable | Readiness audit, not a ranking predictor or proof that an AI model recommends a site |
| Structured Data Validator | `/tools/structured-data-validator` | Accept URL and pasted JSON-LD/HTML; parse JSON-LD blocks, show syntax errors, detect schema types and missing common properties; link to official validators | Do not claim Google's rich-result eligibility unless checks are implemented against current documented requirements; Schema.org validity and Google rich-result eligibility are different |
| AI eCommerce Readiness Report | `/tools/ai-ecommerce-report` | Inspect accessible product-page signals: product identity, title, description, price/availability markup where exposed, canonical, Product schema, image and crawl access; give an evidence-based checklist | Do not claim visibility in ChatGPT Shopping or access to private merchant feeds without actual integration |
| llms.txt Builder | existing `/tools/llms-txt` | Keep, improve copy/download and explain that llms.txt adoption is not a guaranteed ranking factor | No guaranteed search uplift |
| Business Launch Checklist | existing `/tools/business-launch-checklist` | Keep as the business-building lead magnet | Clearly state that it is guidance, not legal/accounting advice |

Reuse common primitives and API/service logic where appropriate, but keep each tool's checks, result explanations and metadata specific.

## Google rankings: recommended approach

Do **not** implement a fabricated public Google rank checker or scrape Google result pages. Google does not offer a general, unrestricted API for checking arbitrary live keyword positions at scale. Scraping search results can break, be blocked, and create compliance and reliability problems.

Safer alternatives:
- **Public tool:** audit observable website signals and clearly show the URL, timestamp, pass/fail/unknown status, evidence and suggested fix.
- **Verified owner reporting:** optionally connect Google Search Console through its supported API with explicit authorisation. Report impressions, clicks, CTR and average position for the verified property, with date range and query/page filters. Average position is an aggregate metric, not a promise of a stable rank for every user.
- **Manual observations:** allow timestamped manual rank observations, labelled as manually supplied and not independently verified.
- **Paid third-party rank provider:** only after comparing terms, costs, coverage, quotas, caching and attribution. Never imply a provider is connected before it is implemented.

## Navigation and UX

- Keep the primary Tools link and add a desktop mega-menu with grouped links: **Website & SEO**, **Structured Data**, **AI & eCommerce**, **Business Tools**.
- Use shared `TOOLS` data as the source of truth for the directory and menu. Include only tools that have a working route; mark planned tools as “Planned” only on the directory, not as broken links.
- Each tool page should include: purpose, URL/input form, clear consent/usage note, progress/loading state, accessible results, evidence, limitations, prioritised fixes, copy/download where useful, and a contextual CTA.
- Make mobile navigation equally usable; support keyboard focus, Escape to close, click/tap operation and reduced motion.
- Use concise descriptions that explain actual capabilities rather than broad “AI-powered” claims.

## Security, privacy and reliability

For any server-side URL fetcher:
- Allow only `http:` and `https:`; reject credentials in URLs and unsupported schemes.
- Block loopback, private, link-local, multicast and reserved IP ranges for IPv4 and IPv6; re-check resolved addresses and redirects to mitigate DNS rebinding and redirect-based SSRF.
- Restrict ports, response size, redirect count, content types and timeouts.
- Rate-limit by a defensible key, apply concurrency limits and cache safe public results.
- Do not fetch arbitrary internal URLs, cloud metadata endpoints or user-controlled local addresses.
- Avoid storing submitted URLs/results longer than necessary; publish a short privacy note.
- Treat fetched HTML as untrusted input; do not render raw HTML or execute page scripts.
- Return partial/unknown when blocked or unsupported instead of inventing a score.

## SEO and content

- Give every tool route a unique title, description, canonical URL, Open Graph metadata and clear H1.
- Add each canonical tool route to `app/sitemap.ts`.
- Link tools from relevant service pages and helpful blog content; avoid thin, near-duplicate landing pages.
- Use structured data only where the page genuinely qualifies; validate it with Schema.org Validator and Google's Rich Results Test where applicable.
- Ensure reports explain that technical readiness does not guarantee rankings, traffic or AI citations.
- Confirm the public `llms.txt` accurately represents current routes and services; do not treat it as a replacement for robots.txt or sitemap.xml.

## Validation checklist

- [ ] Confirm the production site corresponds to the expected branch/commit.
- [ ] `npm ci` (or the repository's documented lockfile-aware install).
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Smoke-test every route, including direct navigation and refresh.
- [ ] Verify all forms, email delivery and payment flows in safe test mode.
- [ ] Verify Neon migrations against a non-production database before production changes.
- [ ] Check mobile navigation and keyboard accessibility.
- [ ] Check metadata, canonical URLs, sitemap, robots and structured data.
- [ ] Run Lighthouse/PageSpeed and review Core Web Vitals using real data when available.
- [ ] Check server-side URL-fetch protections, rate limits and error handling.
- [ ] Confirm no secrets or private customer data are present in the repository.

## Definition of done for a tool

- Working route and useful responsive UI.
- Deterministic checks with evidence and an explicit unknown/error state.
- Input validation, fetch timeout/size limits and abuse protections where relevant.
- Accessible loading, empty, error and results states.
- Unique metadata, canonical URL, sitemap entry and relevant internal links.
- Unit tests for parsing/scoring and smoke test for the route.
- Honest limitations and a contextual, non-deceptive next step.
- Verified in production after deployment.
