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

Configure these server-side values locally and in Vercel Project Settings > Environment Variables:
- `DATABASE_URL` (Neon PostgreSQL connection string)
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (single-admin login; session secret must be at least 32 characters)
- `GEMINI_API_KEY` (server-side Google Gemini API key for blog and social-copy generation)
- `RESEND_API_KEY` (Resend Email API)

Never commit `.env.local` or put these secrets in Neon tables. After changing environment variables, restart the local server or redeploy the Vercel environment.

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
- **Neon**: Server-side PostgreSQL persistence for contact submissions, consultations, AI blueprints, blog posts, social drafts, and saved research monitors. Apply `neon_setup.sql` and `database/migrations/001_admin_control_center.sql` to the configured project.
- **Blog and admin**: Public Markdown articles are published from a password-protected admin. AI creates editable drafts only; publishing always requires a manual action.
- **Admin control center foundation**: Authenticated social-draft and research-monitor CRUD is available. Gemini generates channel-specific copy and an image prompt; image-file generation, social publishing, scheduled execution, and live research providers are not connected yet.
- **Resend Email Engine**: Dual HTML email dispatch (Admin Alert + Client Confirmation) with an interactive **Email Template Sandbox** tab.
- Project enquiries can use email-only delivery until a Neon `DATABASE_URL` is configured. Neither service is reported as active without its server-side credentials.
- **Gemini 2.0 AI Studio**: Real AI software architecture blueprint generator.

The admin needs `DATABASE_URL`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` of at least 32 characters. AI draft generation also needs `GEMINI_API_KEY`. Apply both SQL files before using the blog or control-center storage APIs.
