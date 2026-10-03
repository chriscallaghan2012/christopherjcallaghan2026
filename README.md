# christopherjcallaghan2026

> Next.js 16 (App Router + React 19 + TypeScript) web application with Neon PostgreSQL, Resend email, and a Gemini AI Architecture Studio for Christopher J. Callaghan.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your configuration when the services are ready:
- `DATABASE_URL` (Neon PostgreSQL connection string; omit until a Neon project is configured)
- `RESEND_API_KEY` (Resend Email API)
- `VITE_GEMINI_API_KEY` (Google Gemini AI API)

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
- **Neon**: Server-side PostgreSQL persistence for contact submissions, consultations, and AI blueprints. Use `neon_setup.sql` to create the tables.
- **Blog and admin**: Public Markdown articles are published from a password-protected admin. AI creates editable drafts only; publishing always requires a manual action.
- **Resend Email Engine**: Dual HTML email dispatch (Admin Alert + Client Confirmation) with an interactive **Email Template Sandbox** tab.
- Project enquiries can use email-only delivery until a Neon `DATABASE_URL` is configured. Neither service is reported as active without its server-side credentials.
- **Gemini 2.0 AI Studio**: Real AI software architecture blueprint generator.

The blog/admin needs `DATABASE_URL`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` of at least 32 characters. AI draft generation also needs `GEMINI_API_KEY`. After setting these values, run `neon_setup.sql` against the Neon database before publishing posts.
