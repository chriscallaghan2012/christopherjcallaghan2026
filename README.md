# christopherjcallaghan2026

> Next.js 15 (App Router + React 19 + TypeScript) Web Application, Supabase Database, Resend Email Engine, and Gemini AI Architecture Studio for Christopher J. Callaghan.

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

Fill in your configuration:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase connection)
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
- **Supabase**: PostgreSQL persistence (`contact_submissions`, `consultation_requests`, `ai_blueprints`) with local fallback mode.
- **Resend Email Engine**: Dual HTML email dispatch (Admin Alert + Client Confirmation) with an interactive **Email Template Sandbox** tab.
- **Gemini 2.0 AI Studio**: Real AI software architecture blueprint generator.
