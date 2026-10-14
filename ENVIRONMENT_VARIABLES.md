# Environment Variables — Christopher J. Callaghan Website

**Repository:** `chriscallaghan2012/christopherjcallaghan2026`  
**Application:** `christopherjcallaghan.com` — Next.js App Router, Neon PostgreSQL, Resend, Gemini, Stripe  
**Last reviewed:** 2026-10-14

This document is specific to this repository. Do not copy credentials or configuration from the CRM, Genafize, Academy, or social-media projects into this app.

## Where to configure values

- **Local:** copy `.env.example` to `.env.local` and replace placeholders with real values.
- **Vercel Preview:** Preview deployments are currently disabled for this Vercel project while the website work is being completed. If previews are deliberately re-enabled later, use test credentials and a Preview-specific database where practical.
- **Vercel Production:** use production credentials and the production Neon database.
- **GitHub Actions:** the repository CI workflow runs TypeScript, unit/smoke tests, the production build, a dependency audit and local Playwright browser smoke tests. Those checks do not require application secrets; future deployment or live integration tests may.

Never commit `.env.local`, real API keys, passwords, session secrets, database URLs, or webhook signing secrets. If a secret was exposed, rotate it at its provider.

## Variables used by the application

| Variable | Required for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Neon persistence: website grader reports, contact/submission data, blog/admin control-centre and customer accounts | Neon PostgreSQL connection string; use SSL and the correct environment's database. Some enquiry flows can fall back to email when the database is not configured. Apply the repository SQL setup and migrations before enabling dependent features. |
| `ADMIN_PASSWORD` | Admin sign-in | Strong, unique password; server-side only. |
| `ADMIN_SESSION_SECRET` | Admin session cookies | Random secret of at least 32 characters; server-side only. |
| `CUSTOMER_SESSION_SECRET` | Customer account sessions | Separate random secret of at least 32 characters; do not reuse the admin secret. |
| `GEMINI_API_KEY` | Server-side Gemini features, including admin/social-copy generation | Google AI Studio API key; keep server-side. |
| `VITE_GEMINI_API_KEY` | Legacy fallback for `/api/generate-architecture` | The route falls back to this if `GEMINI_API_KEY` is absent. Prefer `GEMINI_API_KEY`; despite the VITE prefix, do not put secrets in browser/client code. |
| `RESEND_API_KEY` | Contact and report email delivery | Resend API key. |
| `FORM_SUBMISSION_EMAIL` | Destination for form-submission notifications | Optional; code currently has a fallback destination. Set the intended monitored inbox explicitly for each deployment. |
| `STRIPE_SECRET_KEY` | Server-side class checkout and webhook processing | Use `sk_test_...` for testing and `sk_live_...` only for production. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side checkout | Public key; must match the secret key's test/live mode. |
| `STRIPE_WEBHOOK_SECRET` | Verifying Stripe webhook signatures | Endpoint signing secret beginning `whsec_...`; use the secret for the matching Preview/Production webhook endpoint. |
| `GOOGLE_CLIENT_ID` | Google OAuth connector | Configure only when enabling the admin Google connector. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth connector | Server-side OAuth client secret. |
| `GOOGLE_REDIRECT_URI` | Google OAuth connector | Optional override; otherwise the callback URL is derived from the request URL. Must exactly match the redirect URI registered with Google. |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | Encrypting stored Google OAuth tokens | Must be a valid key in the format expected by `lib/googleConnectorAuth.ts`; inspect that implementation before generating/configuring it. Treat as a high-value secret. |
| `NEXT_PUBLIC_GTM_ID` | Optional Google Tag Manager integration | Public GTM container ID; leave unset if GTM is not being used. The current analytics component also has a hard-coded measurement ID, so this variable does not by itself configure every analytics integration. |
| `ALLOW_PRIVATE_NETWORK_SCANS` | Local security tests only | Must remain unset or `false` in deployed environments. Setting it to `true` weakens the grader's private-network scan guard and is used by local smoke tests. |

## Framework/runtime values

| Variable | Handling |
| --- | --- |
| `NODE_ENV` | Managed by Next.js/Vercel; do not normally set manually in Vercel. Production mode enables secure-cookie behaviour. |
| `NEXT_PUBLIC_APP_URL`, `APP_URL` | Present in `.env.example`; current source usage should be verified before treating either as required. Set to the local URL during development and the canonical HTTPS site URL if/when code consumes them. |

## Feature setup checklist

### Neon database
1. Set `DATABASE_URL` for the intended Neon project and deployment environment.
2. Apply `neon_setup.sql` and the required migrations in the documented order. The README specifically calls out `database/migrations/001_admin_control_center.sql`, `002_admin_inbox_rankings.sql`, and `005_customer_accounts.sql` for the relevant features; inspect the migration directory before applying anything to production.
3. Confirm persistence using non-sensitive test data. Never store API keys or passwords in database tables.

### Stripe class checkout
1. Configure the matching secret and publishable key pair.
2. Register a webhook at `https://<your-domain>/api/stripe/webhook`.
3. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Put the endpoint's signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Test with Stripe test mode first. Do not run a real payment as part of smoke testing without explicit approval.

### Email
1. Configure `RESEND_API_KEY`.
2. Set `FORM_SUBMISSION_EMAIL` to the correct monitored inbox.
3. Verify the sender domain/address with Resend before relying on delivery.

### Admin and customer sessions
1. Generate independent random values for `ADMIN_SESSION_SECRET` and `CUSTOMER_SESSION_SECRET`, each at least 32 characters.
2. Set a strong `ADMIN_PASSWORD`.
3. Do not reuse credentials across local, Preview and Production unnecessarily.

### Google OAuth connector (optional)
1. Configure OAuth client credentials in Google Cloud.
2. Register the exact callback URL used by this application's Google connector.
3. Generate a 32-byte key and base64-encode it (for example, `openssl rand -base64 32`) for `GOOGLE_TOKEN_ENCRYPTION_KEY`. Set `GOOGLE_REDIRECT_URI` to the exact callback URL registered in Google Cloud.
4. Keep the connector disabled until the redirect URI, token encryption and consent/scopes have been verified.

## Current verification gaps

- [x] Run `npm run lint`, `npm test` and `npm run build`: GitHub Actions passed TypeScript, unit/smoke tests, production build, dependency audit and Playwright browser tests on merged `main` (https://github.com/chriscallaghan2012/christopherjcallaghan2026/actions/runs/38619897704).
- Verify the complete environment-variable list against all server routes and integrations, including whether the legacy `VITE_GEMINI_API_KEY`, `APP_URL`, and `NEXT_PUBLIC_APP_URL` can be removed. `GOOGLE_REDIRECT_URI` is an optional connector override and should be set when the derived callback URL differs from the registered URI.
- [x] CI workflow is active; the merged `main` run above passed. Preview deployments are disabled project-wide; the production deployment is `dpl_HJhgoMTSb8hBo2YtxywjR1kNKUgi`.
- [x] Verify Vercel variable names/targets without exposing secret values. `FORM_SUBMISSION_EMAIL` is not configured in Production; `lib/grader/emailReport.ts` currently falls back to `instantonlinesuccess@gmail.com`. Confirm the intended inbox before sending a live lead test.
- [x] Apply `database/migrations/008_website_grader.sql` to the website's Neon database after testing it on an isolated Neon branch; `website_grader_scans` and its index now exist in Production.
- [ ] Smoke-test live grader persistence/share/PDF/email, enquiry email, admin auth, Google OAuth (if enabled), customer registration/login, Stripe checkout and signed webhook handling. No live email enquiry or real payment has been sent.
- Keep `ALLOW_PRIVATE_NETWORK_SCANS` disabled outside local tests and re-check SSRF protections before production release.

## Safe local setup

```bash
cp .env.example .env.local
# Edit .env.local and replace placeholders with real local/test values.
npm install
npm run lint
npm test
npm run build
```

Do not paste actual secret values into issues, pull requests, logs, or this document.
