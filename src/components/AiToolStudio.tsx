import React, { useState } from 'react';
import { Sparkles, Terminal, Cpu, Database, Server, Copy, Check, ArrowRight, Zap, RefreshCw, Bot } from 'lucide-react';

interface AiToolStudioProps {
  onOpenConsultation: () => void;
}

interface ArchitectureBlueprint {
  title: string;
  domain: string;
  frontend: string;
  backend: string;
  database: string;
  aiEngine: string;
  devops: string;
  keyWorkflows: string[];
  latencyTarget: string;
}

const PRESET_TEMPLATES = [
  {
    name: "The Whole Package: SME & Startup Kickstart (Up to £25k)",
    domain: "Venture Package (Setup + Ads + Funding)",
    prompt: "An agile, high-ROI venture package for an SME or early startup seeking micro-funding (up to £25k): lean Next.js web application, automated Stripe checkout, local programmatic SEO pages, Meta CAPI conversion tracking, and an interactive Investor/Grant pitch demo tailored for UK startup loans, Innovate UK grants, and early angels."
  },
  {
    name: "The Whole Package: Seed-Ready AI Venture (£25k - £250k+)",
    domain: "Venture Package (Setup + Ads + Funding)",
    prompt: "A turnkey venture package for an AI-powered B2B automation platform: full-stack Next.js setup, Stripe multi-tier subscriptions, programmatic SEO engine for 5,000 dynamic landing pages, Meta/Google CAPI funnels, and a live working investor demo sandbox with real-time MRR telemetry."
  },
  {
    name: "Enterprise RAG & Autonomous Agent",
    domain: "AI & Automation",
    prompt: "A customer-facing autonomous support and knowledge agent that ingests 50k internal PDF manuals, provides source-cited answers with vector embeddings, and executes automated order refund tools."
  },
  {
    name: "Multi-Tenant School Management SaaS",
    domain: "SaaS & Platform",
    prompt: "A multi-tenant education platform managing 100+ institutions with tenant-isolated databases, real-time push notifications to parents, and custom WordPress catalog synchronization."
  },
  {
    name: "Live Event Ticket & Parking Booking",
    domain: "E-Commerce",
    prompt: "High-concurrency WooCommerce store with real-time stadium parking slot reservation, automated Royal Mail / barcode ticket generation, and Stripe webhook reconciliation."
  },
  {
    name: "HIPAA-Compliant Diagnostic Health API",
    domain: "APIs & Integrations",
    prompt: "A secure REST API managing sensitive patient blood test diagnostics, role-based practitioner portals, end-to-end encryption at rest, and audit logging."
  }
];

export const AiToolStudio: React.FC<AiToolStudioProps> = ({ onOpenConsultation }) => {
  const [customPrompt, setCustomPrompt] = useState(PRESET_TEMPLATES[0].prompt);
  const [modelType, setModelType] = useState('Gemini 2.0 Flash');
  const [concurrency, setConcurrency] = useState('10k - 50k Users');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRealAi, setIsRealAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [blueprint, setBlueprint] = useState<ArchitectureBlueprint | null>({
    title: "Enterprise RAG & Autonomous Agent Architecture",
    domain: "AI & Automation",
    frontend: "Next.js 15 App Router, React 19, Tailwind CSS, Server Actions, Framer Motion",
    backend: "Node.js (TypeScript) + Express with LangChain & LangGraph agentic loop supervisor",
    database: "PostgreSQL with pgvector for hybrid semantic search + Redis for distributed session caching",
    aiEngine: "Gemini 2.0 Flash (Streaming tool calling) + text-embedding-004 (768-dim embeddings)",
    devops: "Dockerized microservices, Google Cloud Run / AWS ECS, Cloudflare Edge CDN with WAF",
    keyWorkflows: [
      "Document ingestion pipeline: OCR, chunking (500 tokens), hierarchical embeddings indexing",
      "Hybrid retrieval: BM25 keyword matching fused with cosine similarity vector search",
      "Agent validation: Self-evaluating guardrails verifying zero hallucinations against source docs",
      "Deterministic tool calling: Stripe and CRM webhook trigger handlers with idempotency keys"
    ],
    latencyTarget: "< 350ms initial token stream"
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          model: modelType,
          scale: concurrency
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.blueprint) {
        setBlueprint(data.blueprint);
        setIsRealAi(data.isRealAi);
      }
    } catch (err) {
      console.error('Failed to query architecture synthesis API:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyBlueprint = () => {
    if (!blueprint) return;
    const text = `
ARCHITECTURE SPECIFICATION: ${blueprint.title}
Domain: ${blueprint.domain}
Latency SLA: ${blueprint.latencyTarget}

• Frontend: ${blueprint.frontend}
• Backend API: ${blueprint.backend}
• Database: ${blueprint.database}
• AI Engine: ${blueprint.aiEngine}
• Cloud & DevOps: ${blueprint.devops}

Key System Workflows:
${blueprint.keyWorkflows.map(w => ` - ${w}`).join('\n')}

Architected by Christopher J. Callaghan (christopherjcallaghan.com)
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-black/60 min-h-[85vh] text-left">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#FF003C]/30 bg-[#FF003C]/10 text-[#FF003C] text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Interactive AI Tool Studio
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">Neural System Architect</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Test Christopher's AI architecture engine powered by Google Gemini API. Generate production-ready technical blueprints, database schemas, and stack recommendations instantly.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/40 block mb-3 text-center sm:text-left">
            Select an Engineering Archetype:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                onClick={() => setCustomPrompt(tmpl.prompt)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  customPrompt === tmpl.prompt
                    ? 'border-[#FF003C] bg-[#FF003C]/10 text-white shadow-[0_0_20px_rgba(255,0,60,0.2)]'
                    : 'border-white/10 bg-black/50 text-white/70 hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF003C] mb-1 font-bold">
                  {tmpl.domain}
                </div>
                <div className="text-xs font-bold line-clamp-1">{tmpl.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Controls Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Prompt Specification */}
          <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-6 space-y-4">
            <label className="text-[11px] font-mono uppercase tracking-widest text-white/50 block">
              System Requirements Brief
            </label>
            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your desired system, user volume, compliance rules, or AI agent workflow..."
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF003C]/70 transition-colors resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-white/40">Model:</span>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#111118] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#FF003C]"
                >
                  <option value="Gemini 2.0 Flash">Gemini 2.0 Flash (Recommended)</option>
                  <option value="Gemini 2.0 Pro">Gemini 2.0 Pro (High Reasoning)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 rounded-xl bg-[#FF003C] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.6)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scale & Environment Specs */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block">
                Scale & Throughput
              </span>

              <div className="space-y-2">
                {['1k - 10k Users (MVP)', '10k - 50k Users', '100k+ High Concurrency'].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setConcurrency(scale)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                      concurrency === scale
                        ? 'border-white/40 bg-white/10 text-white font-bold'
                        : 'border-white/5 bg-white/[0.02] text-white/50 hover:text-white'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isRealAi ? 'Live Gemini 2.0 AI Model Active' : 'Deterministic Synthesizer Ready'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint Output Display */}
        {blueprint && (
          <div className="rounded-3xl border border-white/15 bg-black/80 backdrop-blur-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF003C]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
              <div>
                <span className="text-[10px] font-mono text-[#FF003C] uppercase tracking-[0.25em] font-bold block mb-1 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#FF003C]" />
                  Synthesized Blueprint // {blueprint.domain}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {blueprint.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyBlueprint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs font-mono transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Specs' : 'Copy Specs'}</span>
                </button>

                <button
                  onClick={onOpenConsultation}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF003C] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  <span>Build This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Architectural Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6 border-b border-white/10 relative z-10">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF003C] font-bold uppercase">
                  <Terminal className="w-3.5 h-3.5" />
                  Frontend Layer
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{blueprint.frontend}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                  <Server className="w-3.5 h-3.5" />
                  Backend API & Logic
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{blueprint.backend}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase">
                  <Database className="w-3.5 h-3.5" />
                  Data & Vector Store
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{blueprint.database}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI & Model Orchestration
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{blueprint.aiEngine}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                  <Cpu className="w-3.5 h-3.5" />
                  Cloud & Infrastructure
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{blueprint.devops}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  Latency SLA Target
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{blueprint.latencyTarget}</p>
              </div>
            </div>

            {/* Key Workflows */}
            <div className="pt-6 relative z-10">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
                Deterministic Execution Stages:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blueprint.keyWorkflows.map((workflow, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-[#FF003C] font-bold mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="text-xs text-white/70 leading-relaxed">
                      {workflow}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
