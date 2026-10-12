'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  CircleMinus,
  ExternalLink,
  Info,
  RefreshCw,
  XCircle
} from 'lucide-react';
import type {
  CategoryId,
  CategoryResult,
  Check,
  Recommendation,
  ScanReport
} from '../../lib/grader/types';
import { CATEGORY_LABELS } from '../../lib/grader/types';

interface ReportProps {
  report: ScanReport;
  /** True when reports are persisted server-side (enables a copyable report link). */
  storageConfigured: boolean;
  emailNotice?: { status: 'sent' | 'unavailable' | 'failed' | 'skipped'; message?: string } | null;
  onNewScan: () => void;
  /** Opens the scan-specific lead form so the owner receives this report. */
  onOpenConsultation: () => void;
  /** Navigates to the scan-aware "Fix my website" page with the chosen issues. */
  onOpenFixForm: (issues: string[] | 'all' | 'high-priority') => void;
}

type TabId = 'overview' | CategoryId | 'details';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'seo', label: 'SEO' },
  { id: 'ai', label: 'AI Search' },
  { id: 'performance', label: 'Performance' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'security', label: 'Security' },
  { id: 'details', label: 'Technical Details' }
];

const STATUS_STYLES: Record<Check['status'], { label: string; className: string; iconColor: string; Icon: React.ComponentType<{ className?: string }> }> = {
  pass: { label: 'Pass', className: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300', iconColor: 'text-emerald-300', Icon: CheckCircle2 },
  warning: { label: 'Warning', className: 'border-amber-400/40 bg-amber-400/10 text-amber-300', iconColor: 'text-amber-300', Icon: AlertTriangle },
  fail: { label: 'Fail', className: 'border-[#FF5575]/50 bg-[#FF003C]/15 text-[#FF5575]', iconColor: 'text-[#FF5575]', Icon: XCircle },
  info: { label: 'Info', className: 'border-white/20 bg-white/[0.06] text-white/70', iconColor: 'text-white/60', Icon: Info },
  not_measured: { label: 'Not measured', className: 'border-white/15 bg-white/[0.04] text-white/50', iconColor: 'text-white/45', Icon: CircleMinus }
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'border-[#FF003C] bg-[#FF003C] text-white font-bold',
  high: 'border-[#FF003C]/60 bg-[#FF003C]/15 text-[#FF5575]',
  medium: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  low: 'border-white/20 bg-white/[0.06] text-white/60'
};

function scoreColor(score: number | null): string {
  if (score === null) return '#6b7280';
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#fbbf24';
  return '#FF5575';
}

/** Radial overall score visualisation. */
function ScoreRing({ score, grade, label }: { score: number | null; grade: string; label: string }) {
  const radius = 66;
  const stroke = 11;
  const circumference = 2 * Math.PI * radius;
  const ratio = (score ?? 0) / 100;
  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 160 160" className="h-44 w-44 -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-black leading-none text-white" data-testid="overall-score">{score ?? '—'}</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">out of 100</span>
        <span className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: scoreColor(score) }}>
          {grade} · {label}
        </span>
      </div>
    </div>
  );
}

function CountChip({ value, label, className }: { value: number; label: string; className: string }) {
  if (value === 0) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${className}`}>
      {value} {label}
    </span>
  );
}

/** Full report interface: scores, tabs, checks, recommendations, technical details. */
export const WebsiteGraderReport: React.FC<ReportProps> = ({
  report,
  storageConfigured,
  emailNotice,
  onNewScan,
  onOpenFixForm
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const categories = useMemo(() => report.categories, [report]);

  /** Opens the scan-aware "Fix my website" page for one finding. */
  const openFinding = (rec: Recommendation) => {
    onOpenFixForm([rec.checkId]);
  };

  /** Opens the scan-aware "Fix my website" page for the whole report. */
  const openReport = () => {
    onOpenFixForm('all');
  };

  const copyReportLink = async () => {
    try {
      const url = new URL('/tools/website-grader', window.location.origin);
      url.searchParams.set('scan', report.scanId);
      await navigator.clipboard.writeText(url.toString());
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const renderCheck = (check: Check) => {
    const status = STATUS_STYLES[check.status];
    return (
      <details key={check.id} className="group border border-white/10 bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3">
          <status.Icon className={`mt-0.5 h-4 w-4 shrink-0 ${status.iconColor}`} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-white">{check.name}</span>
            <span className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] ${status.className}`}>{status.label}</span>
              {check.severity && (
                <span className={`border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] ${SEVERITY_STYLES[check.severity]}`}>{check.severity}</span>
              )}
              {check.measured !== 'measured' && (
                <span className="border border-white/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-white/45">
                  {check.measured === 'inferred' ? 'inferred' : 'n/a'}
                </span>
              )}
            </span>
          </span>
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-white/40 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          {check.evidence.length > 0 && (
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Evidence</p>
              <ul className="mt-1.5 space-y-1">
                {check.evidence.map((line, i) => (
                  <li key={i} className="break-words font-mono text-[11px] leading-relaxed text-white/70">– {line}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">What this means</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">{check.explanation}</p>
          </div>
          {check.fix && (
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Suggested fix</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">{check.fix}</p>
            </div>
          )}
          {check.docs && check.docs.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {check.docs.map((doc) => (
                <a key={doc.url} href={doc.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF5575] transition-colors hover:text-white">
                  {doc.label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </details>
    );
  };

  const renderRecommendations = (recommendations: Recommendation[]) => (
    <div className="grid gap-4">
      {recommendations.map((rec) => (
        <article key={rec.checkId} className="border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${SEVERITY_STYLES[rec.priority]}`}>{rec.priority}</span>
            <span className="border border-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">{CATEGORY_LABELS[rec.category]}</span>
            <span className="border border-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">{rec.difficulty}</span>
            {rec.nonTechnical && (
              <span className="border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-300">DIY-friendly</span>
            )}
          </div>
          <h4 className="mt-3 text-base font-black text-white">{rec.title}</h4>
          <dl className="mt-3 space-y-2.5 text-sm leading-relaxed">
            <div>
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Detected</dt>
              <dd className="mt-0.5 text-white/75">{rec.whatDetected}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Why it matters</dt>
              <dd className="mt-0.5 text-white/75">{rec.whyItMatters}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Suggested fix</dt>
              <dd className="mt-0.5 text-white/75">{rec.fix}</dd>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/45">
                Estimated impact: <span className="text-white/70">{rec.estimatedImpact}</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/45">
                Priority: <span className="text-white/70">{rec.priority}</span>
              </p>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openFinding(rec)}
              className="inline-flex min-h-11 items-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#ffb347] hover:text-black"
            >
              {rec.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a href={rec.cta.href} className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white">
              View related service <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );

  const categoryPanel = (category: CategoryResult | undefined) => {
    if (!category) return null;
    const recs = report.recommendations.filter((r) => r.category === category.id);
    return (
      <div className="space-y-6">
        <div className="border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white">{category.label}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                Category score {category.score ?? '—'}/100 · weight {Math.round(category.weight * 100)}% of overall
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CountChip value={category.counts.pass} label="pass" className="border-emerald-400/40 bg-emerald-400/10 text-emerald-300" />
              <CountChip value={category.counts.warning} label="warn" className="border-amber-400/40 bg-amber-400/10 text-amber-300" />
              <CountChip value={category.counts.fail} label="fail" className="border-[#FF5575]/50 bg-[#FF003C]/15 text-[#FF5575]" />
              <CountChip value={category.counts.notMeasured} label="not measured" className="border-white/15 bg-white/[0.04] text-white/50" />
            </div>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-2.5 rounded-full transition-[width] duration-700"
              style={{ width: `${category.score ?? 0}%`, backgroundColor: scoreColor(category.score) }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={category.score ?? undefined}
              aria-label={`${category.label} score`}
            />
          </div>
        </div>

        {recs.length > 0 && (
          <section aria-label={`${category.label} recommendations`}>
            <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
              Recommended actions ({recs.length})
            </h3>
            {renderRecommendations(recs)}
          </section>
        )}

        <section aria-label={`${category.label} checks`}>
          <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
            All checks ({category.checks.length})
          </h3>
          <div className="space-y-2">
            {category.checks.map(renderCheck)}
          </div>
        </section>
      </div>
    );
  };

  const overviewPanel = (
    <div className="space-y-8">
      {/* Executive summary */}
      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6" aria-label="Executive summary">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">Executive summary</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">{report.executiveSummary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <CountChip value={report.summary.pass} label="passed" className="border-emerald-400/40 bg-emerald-400/10 text-emerald-300" />
          <CountChip value={report.summary.warning} label="warnings" className="border-amber-400/40 bg-amber-400/10 text-amber-300" />
          <CountChip value={report.summary.fail} label="failed" className="border-[#FF5575]/50 bg-[#FF003C]/15 text-[#FF5575]" />
          <CountChip value={report.summary.notMeasured} label="not measured" className="border-white/15 bg-white/[0.04] text-white/50" />
        </div>
      </section>

      {/* Category scores */}
      <section aria-label="Category scores">
        <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Category scores</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className="text-left text-sm font-bold text-white transition-colors hover:text-[#FF5575]"
                >
                  {cat.label}
                </button>
                <span className="font-mono text-xs font-bold" style={{ color: scoreColor(cat.score) }}>
                  {cat.score ?? '—'}/100
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${cat.score ?? 0}%`, backgroundColor: scoreColor(cat.score) }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                {cat.counts.pass} pass · {cat.counts.warning} warn · {cat.counts.fail} fail · {cat.counts.notMeasured} not measured
                {cat.score === null && ' · no measurable checks in this category'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Highest priority issues */}
      <section aria-label="Highest-priority issues">
        <div id="grader-priority-fixes" className="scroll-mt-24" />
        <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
          Highest-priority issues {report.recommendations.length > 0 ? `(${Math.min(report.recommendations.length, 5)} of ${report.recommendations.length})` : ''}
        </h3>
        {report.recommendations.length === 0 ? (
          <div className="border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm text-emerald-200">
            No failing or warning checks needed a recommendation on this scan. Well done.
          </div>
        ) : (
          renderRecommendations(report.recommendations.slice(0, 5))
        )}
        {report.recommendations.length > 5 && (
          <p className="mt-3 text-xs text-white/50">
            Open the individual category tabs above to see every recommendation.
          </p>
        )}
      </section>

      {/* Next actions */}
      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6" aria-label="Recommended next actions">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">Recommended next actions</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/80">
          <li>Start with the highest-priority findings above — they carry the best estimated impact.</li>
          <li>Open each finding&apos;s evidence to see exactly what the scan detected on your page.</li>
          <li>Share this report with whoever maintains your website, or ask me to implement the fixes.</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openReport}
            className="inline-flex min-h-11 items-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#ffb347] hover:text-black"
          >
            Fix My Website <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href="/contact" className="inline-flex min-h-11 items-center justify-center border border-white/25 px-5 text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-white/60">
            Discuss My Audit
          </a>
        </div>
      </section>

      {/* Scan limitations */}
      <section aria-label="Scan limitations" className="border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">What this scan does not cover</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-white/60">
          {report.limitations.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );

  const detailsPanel = (
    <div className="space-y-6">
      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6" aria-label="Scan metadata">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">Scan details</h3>
        <dl className="mt-3 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Requested URL</dt>
            <dd className="mt-0.5 break-all text-white/80">{report.targetUrl}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Final URL</dt>
            <dd className="mt-0.5 break-all text-white/80">{report.finalUrl}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">HTTP status</dt>
            <dd className="mt-0.5 text-white/80">{report.scanMeta.httpStatus || '—'}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Redirect hops</dt>
            <dd className="mt-0.5 text-white/80">{report.scanMeta.redirectChain.length}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Page size</dt>
            <dd className="mt-0.5 text-white/80">{(report.scanMeta.pageBytes / 1024).toFixed(1)} KB</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Duration</dt>
            <dd className="mt-0.5 text-white/80">{(report.scanMeta.durationMs / 1000).toFixed(1)}s</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Checks run</dt>
            <dd className="mt-0.5 text-white/80">{report.scanMeta.checksRun} measured · {report.scanMeta.checksNotMeasured} not measured</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Scanner</dt>
            <dd className="mt-0.5 text-white/80">CJC Website Grader v{report.version}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Completed at</dt>
            <dd className="mt-0.5 text-white/80">{new Date(report.scanMeta.completedAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Scan ID</dt>
            <dd className="mt-0.5 break-all font-mono text-white/80">{report.scanId || 'not persisted'}</dd>
          </div>
        </dl>
      </section>

      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6" aria-label="Score methodology">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">How scoring works</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Each check contributes points within its category. Passing checks earn full points, warnings earn half, and
          failures earn none. Informational and not-measured checks are excluded from both sides of the calculation, so
          unavailable data never awards or removes points. The overall score weights categories: SEO 30%, AI search 25%,
          performance 20%, accessibility 15% and security 10%. If a category could not be measured its weight is
          redistributed across the measurable categories and this is disclosed in the report.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          This is a diagnostic assessment of observable signals — not a guarantee of search rankings, conversions,
          revenue or AI citations.
        </p>
      </section>

      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6" aria-label="Limitations">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Limitations</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-white/60">
          {report.limitations.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <div className="grader-report space-y-8">
      {/* Report header */}
      <div className="border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Audit complete</p>
            <p className="mt-1 break-all text-sm font-bold text-white">{report.targetUrl}</p>
            {report.finalUrl !== report.targetUrl && (
              <p className="mt-1 break-all font-mono text-[11px] text-white/50">redirected to {report.finalUrl}</p>
            )}
          </div>
          <div className="grader-no-print flex flex-wrap gap-2">
            {storageConfigured && report.scanId && (
              <button
                type="button"
                onClick={copyReportLink}
                className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/75 transition-colors hover:border-white/50 hover:text-white"
              >
                <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
                {copyState === 'copied' ? 'Link copied' : copyState === 'failed' ? 'Copy failed' : 'Copy report link'}
              </button>
            )}
            <button
              type="button"
              onClick={onNewScan}
              className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/75 transition-colors hover:border-white/50 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> New scan
            </button>
          </div>
        </div>
      </div>

      {/* Score + summary */}
      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div className="flex justify-center">
          <ScoreRing score={report.overall.score} grade={report.overall.grade} label={report.overall.label} />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <CountChip value={report.summary.pass} label="passed" className="border-emerald-400/40 bg-emerald-400/10 text-emerald-300" />
            <CountChip value={report.summary.warning} label="warnings" className="border-amber-400/40 bg-amber-400/10 text-amber-300" />
            <CountChip value={report.summary.fail} label="failed" className="border-[#FF5575]/50 bg-[#FF003C]/15 text-[#FF5575]" />
            <CountChip value={report.summary.notMeasured} label="not measured" className="border-white/15 bg-white/[0.04] text-white/50" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{report.executiveSummary}</p>
        </div>
      </div>

      {emailNotice && (
        <div
          role={emailNotice.status === 'sent' ? 'status' : 'alert'}
          className={`flex items-start gap-3 border p-4 ${emailNotice.status === 'sent' ? 'border-emerald-400/30 bg-emerald-400/[0.06]' : 'border-amber-400/30 bg-amber-400/[0.06]'}`}
        >
          {emailNotice.status === 'sent'
            ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
            : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />}
          <p className="text-sm leading-relaxed text-white/80">
            {emailNotice.message || (emailNotice.status === 'sent'
              ? 'Your full audit PDF has been emailed.'
              : 'The scan is ready, but the report email could not be delivered.')}
          </p>
        </div>
      )}

      <div className="grader-no-print flex flex-col gap-3 border-y border-white/10 py-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => document.getElementById('grader-priority-fixes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/25 px-5 text-xs font-bold tracking-[0.08em] text-white transition-colors hover:border-white/60"
        >
          Review {report.recommendations.length} recommended {report.recommendations.length === 1 ? 'fix' : 'fixes'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onOpenFixForm(report.recommendations.some((item) => item.priority === 'critical' || item.priority === 'high') ? 'high-priority' : 'all')}
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.08em] text-white transition-colors hover:bg-[#ffb347] hover:text-black"
        >
          {report.recommendations.length > 0 ? 'Help me fix these' : 'Request a scan review'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Tabs */}
      <div>
        <div className="scrollbar-none grader-no-print flex gap-1 overflow-x-auto border-b border-white/10 pb-px" role="tablist" aria-label="Report sections">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`grader-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`grader-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  isActive
                    ? 'border-[#FF003C] text-white'
                    : 'border-transparent text-white/45 hover:text-white/80'
                }`}
              >
                {tab.label}
                {tab.id !== 'overview' && tab.id !== 'details' && (() => {
                  const cat = categories.find((c) => c.id === tab.id);
                  const fails = cat?.counts.fail ?? 0;
                  return fails > 0 ? (
                    <span className="ml-2 inline-block rounded-full bg-[#FF003C] px-1.5 py-0.5 text-[9px] text-white">{fails}</span>
                  ) : null;
                })()}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`grader-panel-${activeTab}`}
          aria-labelledby={`grader-tab-${activeTab}`}
          tabIndex={0}
          className="pt-6"
        >
          {activeTab === 'overview' && overviewPanel}
          {activeTab === 'details' && detailsPanel}
          {activeTab !== 'overview' && activeTab !== 'details' &&
            categoryPanel(categories.find((c) => c.id === activeTab))}
        </div>
      </div>
    </div>
  );
};
