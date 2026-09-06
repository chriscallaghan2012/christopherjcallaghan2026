import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function POST(request: Request) {
  try {
    const { prompt, model = 'Gemini 2.0 Flash', scale = '10k - 50k Users' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required.' }, { status: 400 });
    }

    if (ai) {
      try {
        const systemInstruction = `
You are Christopher J. Callaghan, an elite Senior Software Architect & Digital Architect based in Manchester, UK.
Synthesize a production-grade software architecture specification matching the user's requirements and scale.

Return ONLY a valid JSON object matching this TypeScript interface:
{
  "title": string,
  "domain": string,
  "frontend": string,
  "backend": string,
  "database": string,
  "aiEngine": string,
  "devops": string,
  "keyWorkflows": string[],
  "latencyTarget": string
}
        `.trim();

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `System Scale Target: ${scale}\nUser Brief: ${prompt}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const blueprint = JSON.parse(response.text);
          return NextResponse.json({ success: true, blueprint, isRealAi: true });
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to rule synthesizer:', err.message);
      }
    }

    // Rule-based Fallback Synthesizer
    const lower = prompt.toLowerCase();
    const isSme = lower.includes('25k') || lower.includes('sme') || lower.includes('grant') || lower.includes('micro');
    const isVenture = lower.includes('whole package') || lower.includes('venture') || lower.includes('funding') || lower.includes('seed');
    const isHealth = lower.includes('health') || lower.includes('diagnostic') || lower.includes('hipaa');
    const isEcom = lower.includes('ecommerce') || lower.includes('woocommerce') || lower.includes('booking') || lower.includes('ticket');

    let blueprint;

    if (isSme) {
      blueprint = {
        title: "The Whole Package: SME & Startup Micro-Funding (Up to £25k)",
        domain: "Lean MVP • Local Ads & SEO • Grants & Pre-Seed Capital",
        frontend: "Next.js 15 App Router + React 19, Tailwind CSS, Localized Micro-SEO pages",
        backend: "Node.js (TypeScript) / Express API, Stripe Checkout, Meta CAPI",
        database: "Supabase / PostgreSQL serverless with automated backups",
        aiEngine: "Gemini 2.0 Flash for automated marketing copy and grant drafting",
        devops: "Vercel zero-idle cost deployment, Cloudflare CDN with WAF",
        keyWorkflows: [
          "[THE SETUP] Rapid 2-week MVP deployment with Stripe customer payments",
          "[THE ADS] Hyper-local programmatic landing pages with 0 ad spend waste",
          "[THE ADS] Server-side Meta/Google CAPI tracking to maximize early ROAS",
          "[THE FUNDING] Pitch deck & live demo tailored for UK Start Up Loans & Innovate UK grants",
          "[THE FUNDING] Real-time Financial unit economics dashboard for grant underwriters"
        ],
        latencyTarget: "< 120ms global edge TTFB (Turnkey in 2 weeks)"
      };
    } else if (isVenture) {
      blueprint = {
        title: "The Whole Package: Complete Venture Ecosystem",
        domain: "Turnkey Setup • Advertising Engine • Investor Capital",
        frontend: "Next.js 15 App Router + React 19, Programmatic SEO Matrix (5k+ pages)",
        backend: "Node.js (TypeScript) microservices, Stripe Billing, Meta & Google CAPI gateway",
        database: "PostgreSQL with multi-tenant schema isolation, Redis rate-limiting",
        aiEngine: "Gemini 2.0 Flash agentic pipelines with autonomous tool calling",
        devops: "Docker, Google Cloud Run / AWS ECS, Cloudflare Edge with WAF",
        keyWorkflows: [
          "[THE SETUP] Turnkey MVP with Stripe multi-tier subscription checkout",
          "[THE ADS] Programmatic SEO generating 5,000+ high-intent landers + CAPI tracking",
          "[THE ADS] Built-in referral K-factor loops and automated email drips",
          "[THE FUNDING] Clickable live investor demo sandbox with pre-loaded enterprise data",
          "[THE FUNDING] Telemetry data room tracking real-time MRR and cohort retention"
        ],
        latencyTarget: "< 180ms global TTFB (Turnkey in 4 weeks)"
      };
    } else if (isHealth) {
      blueprint = {
        title: "HIPAA-Secure Diagnostics Data Pipeline",
        domain: "APIs & Healthcare Architecture",
        frontend: "React 19 + TypeScript, Tailwind CSS, Role-based portal with 2FA MFA",
        backend: "Node.js / Express microservices with Prisma ORM and JWT interceptors",
        database: "PostgreSQL with pgcrypto encryption-at-rest and offsite backups",
        aiEngine: "Gemini 2.0 with strict zero-data-retention BAA terms",
        devops: "Private VPC, AWS KMS or GCP Cloud KMS, end-to-end TLS 1.3",
        keyWorkflows: [
          "Encrypted diagnostic specimen intake and automated barcode tracking",
          "Role-based ACL: Patient view, lab technician entry, physician approval",
          "Immutable audit trails: Every query logged to append-only storage",
          "Automated PDF report generation with cryptographic verification"
        ],
        latencyTarget: "< 120ms API response"
      };
    } else if (isEcom) {
      blueprint = {
        title: "High-Throughput Booking & Live E-Commerce Engine",
        domain: "E-Commerce & High-Concurrency Systems",
        frontend: "Next.js 15 Headless Storefront or Custom Theme with React Islands",
        backend: "Node.js webhook worker service with Redis event queue",
        database: "MySQL 8.0 cluster with read replicas and row-level locking",
        aiEngine: "Gemini semantic recommendation engine and demand forecaster",
        devops: "Cloudflare Workers for edge caching, Redis Sentinel, Stripe webhooks",
        keyWorkflows: [
          "Optimistic slot reservation: Locks capacity for 8 minutes during checkout",
          "Stripe webhook reconciliation with automated idempotent state transitions",
          "Dynamic QR code barcode pass generation and automated delivery",
          "Real-time event status webhooks broadcasting live capacity changes"
        ],
        latencyTarget: "< 85ms edge cached checkout"
      };
    } else {
      blueprint = {
        title: "Custom AI & Systems Architecture",
        domain: "Tailored Engineering Specification",
        frontend: "Next.js 15 App Router + React 19, Tailwind CSS, Motion",
        backend: "Node.js (TypeScript) + Express microservices",
        database: "PostgreSQL (pgvector) + Redis cache for sub-millisecond state",
        aiEngine: `${model} + custom prompt pipelines and JSON schema validations`,
        devops: "Docker containerization, CI/CD automated test suite, Cloudflare edge",
        keyWorkflows: [
          "Automated request sanitization and rate-limited gateway enforcement",
          "Streaming response processing with real-time progressive rendering",
          "Continuous background evaluation and hallucination verification",
          "Full observability instrumentation with OpenTelemetry and APM"
        ],
        latencyTarget: "< 250ms stream latency"
      };
    }

    return NextResponse.json({ success: true, blueprint, isRealAi: false });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
