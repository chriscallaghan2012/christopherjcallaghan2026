'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Gauge,
  Lock,
  Loader2,
  Search,
  ShieldCheck,
  TriangleAlert,
  Wrench,
  XCircle
} from 'lucide-react';
import { isValidEmail, validateTargetUrl } from '../../lib/grader/validate';
import type { ScanReport, StageId } from '../../lib/grader/types';
import { cacheClientScanReport, readClientScanReport } from '../../lib/grader/clientReportCache';
import { WebsiteGraderReport } from './WebsiteGraderReport';
import { GraderFixTeaser } from './GraderFixTeaser';

interface WebsiteGraderProps {
  /** Opens the site enquiry form, optionally prefilled with audit context. */
  onOpenConsultation: (ctx?: unknown) => void;
  /** Navigates to the scan-aware "Fix my website" request page. */
  onNavigateToFixForm?: () => void;
}

type Phase = 'idle' | 'scanning' | 'done' | 'error';
type StageStatus = 'pending' | 'started' | 'complete' | 'failed';
type EmailNotice = { status: 'sent' | 'unavailable' | 'failed' | 'skipped'; message?: string };

interface StageState {
  id: StageId;
  label: string;
  status: StageStatus;
  detail?: string;
}

/** Mirrors the backend engine's real stage list — progress only advances when
 *  the server actually reports a stage completing. */
const STAGE_LIST: Array<{ id: StageId; label: string }> = [
  { id: 'validate', label: 'Validating website address' },
  { id: 'availability', label: 'Checking website availability' },
  { id: 'auxiliary', label: 'Reading robots.txt, sitemap and llms.txt' },
  { id: 'content', label: 'Analysing page content' },
  { id: 'seo', label: 'Checking SEO and indexing signals' },
  { id: 'links', label: 'Checking internal links' },
  { id: 'performance', label: 'Evaluating performance' },
  { id: 'accessibility', label: 'Checking accessibility' },
  { id: 'security', label: 'Checking security headers' },
  { id: 'ai', label: 'Evaluating AI search readiness' },
  { id: 'score', label: 'Calculating scores' },
  { id: 'recommendations', label: 'Preparing recommendations' },
  { id: 'persist', label: 'Finalising your report' }
];

const CATEGORY_INDICATORS = [
  { label: 'SEO', Icon: Search },
  { label: 'AI search', Icon: Bot },
  { label: 'Performance', Icon: Gauge },
  { label: 'Accessibility', Icon: Activity },
  { label: 'Security', Icon: ShieldCheck }
];

const CAPABILITIES = [
  {
    Icon: Search,
    title: 'Technical & on-page SEO',
    body: 'Titles, meta descriptions, headings, canonicals, robots directives, sitemaps, links, images and structured data — checked against what the page actually serves.'
  },
  {
    Icon: Bot,
    title: 'AI search readiness',
    body: 'Whether a page is publicly readable, clearly attributed and well structured enough for answer engines to understand — assessed as observable signals, not promised citations.'
  },
  {
    Icon: Gauge,
    title: 'Performance signals',
    body: 'Page weight, render-blocking resources, script and image payload indicators from the HTML. Full lab metrics like LCP need a real browser and are marked as not measured when unavailable.'
  },
  {
    Icon: Activity,
    title: 'Accessibility',
    body: 'Automated checks for labels, alt text, headings, landmarks, buttons and language. Automated checks flag likely issues — they do not establish full WCAG conformance.'
  },
  {
    Icon: Lock,
    title: 'Security headers',
    body: 'HTTPS behaviour and observable response headers such as CSP, X-Content-Type-Options, Referrer-Policy and frame protection — reported as recommendations, not exploit tests.'
  }
];

const MEASUREMENT_NOTES = [
  { tag: 'Measured directly', tone: 'text-emerald-300 border-emerald-400/40 bg-emerald-400/10', body: 'Read from the live HTTP response, headers and parsed HTML.' },
  { tag: 'Estimated', tone: 'text-amber-300 border-amber-400/40 bg-amber-400/10', body: 'Inferred from observable signals — useful guidance, not a guarantee.' },
  { tag: 'Not measured', tone: 'text-white/60 border-white/15 bg-white/[0.04]', body: 'The data needed was unavailable (e.g. browser lab metrics), so no points are awarded or deducted.' }
];

/** Free website audit tool: hero + form, real staged scanning, report, conversion. */
export const WebsiteGrader: React.FC<WebsiteGraderProps> = ({ onOpenConsultation, onNavigateToFixForm }) => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailNotice, setEmailNotice] = useState<EmailNotice | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stages, setStages] = useState<StageState[]>(
    STAGE_LIST.map((s) => ({ ...s, status: 'pending' as StageStatus }))
  );
  const [storageConfigured, setStorageConfigured] = useState(false);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedUrl, setScannedUrl] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  // When a scan finishes (or a shared report link loads), bring the results
  // into view so the visitor immediately sees the outcome.
  useEffect(() => {
    if (phase !== 'done' || !report) return;
    const id = window.setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(id);
  }, [phase, report]);

  // Support shareable report links: /tools/website-grader?scan=<id> loads the
  // persisted report so a copied link always resolves to a real result.
  useEffect(() => {
    const scanId = new URLSearchParams(window.location.search).get('scan');
    if (!scanId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tools/website-grader/scan/${encodeURIComponent(scanId)}`);
        if (res.ok) {
          const payload = (await res.json()) as { success?: boolean; report?: ScanReport };
          if (!cancelled && payload.success && payload.report) {
            cacheClientScanReport(payload.report);
            setStorageConfigured(true);
            setScannedUrl(payload.report.targetUrl);
            setReport(payload.report);
            setPhase('done');
            return;
          }
        }
        // A report may be available in this tab even when database persistence is not configured.
        const cachedReport = readClientScanReport(scanId);
        if (!cancelled && cachedReport) {
          setScannedUrl(cachedReport.targetUrl);
          setReport(cachedReport);
          setPhase('done');
        }
      } catch {
        const cachedReport = readClientScanReport(scanId);
        if (!cancelled && cachedReport) {
          setScannedUrl(cachedReport.targetUrl);
          setReport(cachedReport);
          setPhase('done');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const completedStages = stages.filter((s) => s.status === 'complete' || s.status === 'failed').length;
  const progressPct = Math.round((completedStages / STAGE_LIST.length) * 100);

  const resetToIdle = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhase('idle');
    setReport(null);
    setErrorMessage('');
    setEmailNotice(null);
    setStages(STAGE_LIST.map((s) => ({ ...s, status: 'pending' as StageStatus })));
  };

  const startScan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (phase === 'scanning') return;

    const validationError = validateTargetUrl(url);
    if (validationError) {
      setErrorMessage(validationError);
      setPhase('error');
      return;
    }
    if (email.trim() && !isValidEmail(email.trim())) {
      setEmailError('Enter a valid email address, or leave this field blank.');
      document.getElementById('grader-email')?.focus();
      return;
    }

    setPhase('scanning');
    setReport(null);
    setErrorMessage('');
    setEmailError('');
    setEmailNotice(null);
    setStages(STAGE_LIST.map((s) => ({ ...s, status: 'pending' as StageStatus })));

    const controller = new AbortController();
    abortRef.current = controller;
    let settled = false;

    const handleEvent = (evt: Record<string, unknown>) => {
      switch (evt.type) {
        case 'meta':
          setStorageConfigured(Boolean(evt.storageConfigured));
          if (typeof evt.targetUrl === 'string') setScannedUrl(evt.targetUrl);
          break;
        case 'stage': {
          const id = evt.id as StageId;
          setStages((prev) =>
            prev.map((stage) =>
              stage.id === id
                ? {
                    ...stage,
                    status: (evt.status as StageStatus) ?? stage.status,
                    detail: typeof evt.detail === 'string' ? evt.detail : stage.detail
                  }
                : stage
            )
          );
          break;
        }
        case 'email': {
          const status = evt.status;
          if (status === 'sent' || status === 'unavailable' || status === 'failed' || status === 'skipped') {
            setEmailNotice({
              status,
              message: typeof evt.message === 'string' ? evt.message : undefined
            });
          }
          break;
        }
        case 'result': {
          const completedReport = evt.report as ScanReport;
          cacheClientScanReport(completedReport);
          setReport(completedReport);
          setPhase('done');
          settled = true;
          break;
        }
        case 'error':
          setErrorMessage(typeof evt.message === 'string' ? evt.message : 'The audit could not be completed. Please try again.');
          setPhase('error');
          settled = true;
          break;
        default:
          break;
      }
    };

    try {
      const response = await fetch('/api/tools/website-grader/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), email: email.trim() || undefined }),
        signal: controller.signal
      });

      if (!response.ok) {
        let message = 'The audit could not be started. Please try again.';
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) message = payload.error;
        } catch { /* keep default */ }
        setErrorMessage(message);
        setPhase('error');
        return;
      }

      if (!response.body) {
        setErrorMessage('The audit could not be started. Please try again.');
        setPhase('error');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex = buffer.indexOf('\n');
        while (newlineIndex >= 0) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);
          if (line) {
            try {
              handleEvent(JSON.parse(line) as Record<string, unknown>);
            } catch { /* ignore partial/invalid lines */ }
          }
          newlineIndex = buffer.indexOf('\n');
        }
      }

      // The stream ended without a result or error event — treat as a failure
      // rather than leaving the UI stuck in the scanning state.
      if (!settled && !controller.signal.aborted) {
        setErrorMessage('The audit ended unexpectedly. Please try again.');
        setPhase('error');
      }
    } catch (err) {
      if (controller.signal.aborted) {
        resetToIdle();
        return;
      }
      console.error('Website grader request failed:', err);
      setErrorMessage('The audit could not be completed. Please check your connection and try again.');
      setPhase('error');
    } finally {
      abortRef.current = null;
    }
  };

  const openLeadModal = () => {
    if (!report) {
      onOpenConsultation();
      return;
    }
    const params = new URLSearchParams({
      scan: report.scanId,
      issues: 'all'
    });
    window.location.assign(`/tools/website-grader/fix-my-website?${params.toString()}`);
  };

  const openFixForm = (issues: string[] | 'all' | 'high-priority') => {
    if (!report) return;
    const value = Array.isArray(issues) ? issues.join(',') : issues;
    // Cache before full-page navigation so the exact report is available even without server persistence.
    cacheClientScanReport(report);
    const params = new URLSearchParams({ scan: report.scanId, issues: value });
    window.location.assign(`/tools/website-grader/fix-my-website?${params.toString()}`);
  };

  const reportDigest = report ? {
    scanId: report.scanId,
    targetUrl: report.targetUrl,
    overallLabel: report.overall.score === null ? 'Not enough measurable data' : `${report.overall.score}/100 · ${report.overall.grade} · ${report.overall.label}`,
    summaryLine: `${report.summary.fail} failed, ${report.summary.warning} warnings, ${report.summary.pass} passed.`,
    issueCount: report.recommendations.length,
    recommendations: report.recommendations.slice(0, 12)
  } : null;

  const stageIcon = (status: StageStatus) => {
    if (status === 'complete') return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />;
    if (status === 'failed') return <XCircle className="h-4 w-4 shrink-0 text-[#FF5575]" aria-hidden="true" />;
    if (status === 'started') return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#FF5575]" aria-hidden="true" />;
    return <span className="block h-4 w-4 shrink-0 rounded-full border border-white/20" aria-hidden="true" />;
  };

  return (
    <div className={`grader-page relative${phase === 'done' ? ' has-report' : ''}`}>
      {/* ============ Hero ============ */}
      <section className="border-b border-white/10 px-5 py-16 md:px-8 md:py-24" aria-labelledby="grader-hero-title">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#FF5575]">Free website audit</p>
          <h1 id="grader-hero-title" className="mt-5 text-4xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl">
            Website, SEO & AI search audit — find what to fix first.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Enter any public website for one joined-up audit of technical SEO, crawlability, structured data, AI search readiness,
            performance signals, accessibility and security. See the evidence, understand the limitations and prioritise your next fixes.
          </p>

          <form onSubmit={startScan} className="mx-auto mt-9 max-w-2xl" noValidate>
            <label htmlFor="grader-url" className="sr-only">Website URL to audit</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="grader-url"
                name="url"
                type="url"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (phase === 'error') setPhase('idle'); }}
                aria-describedby="grader-url-help grader-url-error"
                aria-invalid={phase === 'error'}
                className="min-h-12 w-full flex-1 border border-white/20 bg-black/50 px-4 text-sm text-white placeholder:text-white/35 transition-colors focus:border-[#FF5575] focus:outline-none sm:text-base"
              />
              <button
                type="submit"
                disabled={phase === 'scanning'}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-7 text-xs font-black tracking-[0.14em] text-white transition-colors hover:bg-[#ffb347] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === 'scanning' ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Scanning…</>) : (<>Analyse My Website <ArrowRight className="h-4 w-4" aria-hidden="true" /></>)}
              </button>
            </div>
            <div className="mt-4 text-left">
              <label htmlFor="grader-email" className="block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
                Email me the full PDF report <span className="font-normal text-white/40">(optional)</span>
              </label>
              <input
                id="grader-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={320}
                value={email}
                disabled={phase === 'scanning'}
                onChange={(event) => { setEmail(event.target.value); setEmailError(''); }}
                aria-invalid={Boolean(emailError)}
                aria-describedby="grader-email-help grader-email-error"
                placeholder="you@example.com"
                className="mt-2 min-h-11 w-full border border-white/20 bg-black/50 px-4 text-sm text-white placeholder:text-white/35 transition-colors focus:border-[#FF5575] focus:outline-none disabled:opacity-50"
              />
              <p id="grader-email-error" aria-live="polite" className={`mt-1 min-h-4 text-xs ${emailError ? 'text-[#FF5575]' : 'text-transparent'}`}>
                {emailError || 'No email error'}
              </p>
              <p id="grader-email-help" className="text-xs leading-relaxed text-white/45">
                Used only to send your audit PDF. You can still run the scan without it.
              </p>
            </div>
            <p id="grader-url-error" aria-live="polite" className={`mt-2 min-h-5 text-left text-xs sm:text-center ${phase === 'error' && errorMessage ? 'text-[#FF5575]' : 'text-transparent'}`}>
              {phase === 'error' && errorMessage ? errorMessage : 'No error'}
            </p>
            <p id="grader-url-help" className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
              Free audit. Actionable recommendations. No account required.
            </p>
          </form>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="What gets checked">
            {CATEGORY_INDICATORS.map(({ label, Icon }) => (
              <li key={label} className="inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/65">
                <Icon className="h-3.5 w-3.5 text-[#FF5575]" aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ Scanning / error ============ */}
      {(phase === 'scanning' || phase === 'error') && (
        <section className="border-b border-white/10 px-5 py-12 md:px-8" aria-labelledby="grader-progress-title" aria-live="polite">
          <div className="mx-auto max-w-3xl">
            <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">
                    {phase === 'error' ? 'Scan stopped' : 'Scanning in progress'}
                  </p>
                  <h2 id="grader-progress-title" className="mt-1.5 break-all text-sm font-bold text-white">{scannedUrl || url}</h2>
                </div>
                {phase === 'scanning' && (
                  <button
                    type="button"
                    onClick={() => { abortRef.current?.abort(); resetToIdle(); }}
                    className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
                  >
                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" /> Cancel
                  </button>
                )}
              </div>

              {phase === 'error' && (
                <div className="mt-4 flex items-start gap-3 border border-[#FF5575]/40 bg-[#FF003C]/10 p-4" role="alert">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5575]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">The audit could not be completed</p>
                    <p className="mt-1 break-words text-sm leading-relaxed text-white/75">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => setPhase('idle')}
                      className="mt-3 inline-flex min-h-10 items-center gap-2 border border-white/25 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/60"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                  <span>{completedStages} of {STAGE_LIST.length} stages completed</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct} aria-label="Scan progress">
                  <div className="h-2 rounded-full bg-[#FF003C] transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <ol className="mt-5 space-y-2.5">
                {stages.map((stage) => (
                  <li key={stage.id} className={`flex items-start gap-3 text-sm ${stage.status === 'pending' ? 'text-white/35' : 'text-white/85'}`}>
                    {stageIcon(stage.status)}
                    <span className="min-w-0 flex-1">
                      {stage.label}
                      {stage.detail && <span className="mt-0.5 block break-all font-mono text-[11px] text-white/50">{stage.detail}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ============ Results ============ */}
      {phase === 'done' && report && (
        <section ref={reportRef} className="scroll-mt-20 border-b border-white/10 px-5 py-12 md:px-8" aria-label="Audit report">
          <div className="mx-auto max-w-5xl">
            <WebsiteGraderReport
              report={report}
              storageConfigured={storageConfigured}
              emailNotice={emailNotice}
              onNewScan={resetToIdle}
              onOpenConsultation={() => openFixForm('high-priority')}
              onOpenFixForm={openFixForm}
            />
          </div>
        </section>
      )}

      {phase === 'done' && report && (
        <GraderFixTeaser
          reportDigest={reportDigest}
          onNavigateHome={() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      )}

      {/* ============ Trust & capability ============ */}
      <section className="border-b border-white/10 px-5 py-14 md:px-8 md:py-20" aria-labelledby="grader-checks-title">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF5575]">What gets checked</p>
          <h2 id="grader-checks-title" className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            Real checks against your live page — explained in plain English.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
            Every scan fetches your page the same way a search engine would, then runs deterministic checks against the
            response, headers and HTML. Nothing is invented: if a measurement is not available, it is reported as not
            measured instead of guessed.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ Icon, title, body }) => (
              <article key={title} className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#FF003C]/50">
                <span className="flex h-10 w-10 items-center justify-center border border-white/15 bg-black/40 text-[#FF5575] transition-colors group-hover:border-[#FF003C]/50">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
              </article>
            ))}
            <article className="group border border-white/10 bg-gradient-to-br from-[#FF003C]/10 to-transparent p-5 transition-colors hover:border-[#FF003C]/50">
              <span className="flex h-10 w-10 items-center justify-center border border-white/15 bg-black/40 text-[#FF5575]">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-black text-white">Prioritised fixes you can act on</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Every failed or warning check comes with what was detected, why it matters, a practical fix, an estimated
                impact and a direct route to get help implementing it.
              </p>
            </article>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {MEASUREMENT_NOTES.map((note) => (
              <div key={note.tag} className={`border p-4 ${note.tone}`}>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">{note.tag}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/70">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Conversion ============ */}
      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24" aria-labelledby="grader-cta-title">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#FF003C]/10 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF5575]">Next step</p>
          <h2 id="grader-cta-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
            Want me to fix it for you?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Your audit is the starting point. I can help turn those findings into a faster, better-optimised website
            that works harder for your business.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openLeadModal}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-7 text-xs font-black tracking-[0.14em] text-white transition-colors hover:bg-[#ffb347] hover:text-black sm:w-auto"
            >
              Fix My Website <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a href="/contact" className="inline-flex min-h-12 w-full items-center justify-center border border-white/25 px-7 text-xs font-bold tracking-[0.14em] text-white transition-colors hover:border-white/60 sm:w-auto">
              Discuss My Audit
            </a>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
            Prefer to explore first?{' '}
            <a href="/services" className="text-[#FF5575] transition-colors hover:text-white">Browse my services</a>
          </p>
        </div>
      </section>
    </div>
  );
};
