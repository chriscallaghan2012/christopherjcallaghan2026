# christopherjcallaghan2026

> Next.js 16 (App Router + React 19 + TypeScript) web application with Neon PostgreSQL, Resend email, and a Gemini AI Architecture Studio for Christopher J. Callaghan.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` for local development:
```bash
cp .env.example .env.local
```

Configure these values locally and in Vercel Project Settings > Environment Variables:
- `DATABASE_URL` (Neon PostgreSQL connection string)
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (single-admin login; session secret must be at least 32 characters)
- `GEMINI_API_KEY` (server-side Google Gemini API key for blog and social-copy generation)
- `RESEND_API_KEY` (Resend Email API)
- `STRIPE_SECRET_KEY` (`sk_test_...` while testing; use `sk_live_...` for production payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (matching Stripe `pk_test_...` or `pk_live_...` key; this key is public)
- `STRIPE_WEBHOOK_SECRET` (Stripe webhook signing secret, `whsec_...`)
- `CUSTOMER_SESSION_SECRET` (a separate random secret of at least 32 characters for customer login sessions)

For paid class checkout and purchase history, apply `database/migrations/005_customer_accounts.sql` to the Neon database. In Stripe, add a webhook endpoint at `https://<your-production-domain>/api/stripe/webhook` and subscribe it to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy that endpoint's signing secret to `STRIPE_WEBHOOK_SECRET`. Set the Stripe test keys in Vercel Preview while testing and the matching live keys in Production when ready. Never commit `.env.local` or put secrets in Neon tables. After changing environment variables, restart the local server or redeploy the Vercel environment.

Customers add a class on `/classes`, confirm it in the cart popup, then create an account or sign in and pay on the dedicated `/checkout` page. Passwords must be at least 12 characters. Paid purchases are added to `/account` only after Stripe's signed webhook confirms payment.

### 3. Run Locally
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## Features

- **Next.js 15 (App Router)**: Sub-second edge rendering and 100/100 Lighthouse SEO with JSON-LD Schema markup.
- **Neon**: Server-side PostgreSQL persistence for contact submissions, consultations, AI blueprints, blog posts, social drafts, research monitors, and ranking observations. Apply `neon_setup.sql` and migrations `001_admin_control_center.sql` and `002_admin_inbox_rankings.sql` to the configured project.
- **Blog and admin**: Public Markdown articles are published from a password-protected admin. AI creates editable drafts only; publishing always requires a manual action.
- **Admin control center**: Authenticated draft editing, planned-post queue, platform readiness, submission inbox, research monitors, and timestamped ranking observations. Gemini generates channel-specific copy and an image prompt. Image-file generation, platform OAuth/publishing, scheduled execution, and automatic ranking providers are not connected yet.
- **Resend Email Engine**: Dual HTML email dispatch (Admin Alert + Client Confirmation) with an interactive **Email Template Sandbox** tab.
- Project enquiries can use email-only delivery until a Neon `DATABASE_URL` is configured. Neither service is reported as active without its server-side credentials.
- **Gemini 2.0 AI Studio**: Real AI software architecture blueprint generator.

The admin needs `DATABASE_URL`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` of at least 32 characters. AI draft generation also needs `GEMINI_API_KEY`. Apply `neon_setup.sql` and both files in `database/migrations/` before using the blog or control-center storage APIs.
