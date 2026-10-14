'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import type { ScanReport } from '../../lib/grader/types';
import { CATEGORY_LABELS } from '../../lib/grader/types';
import { cacheClientScanReport, readClientScanReport } from '../../lib/grader/clientReportCache';

interface GraderFixFormProps {
  onNavigateHome: () => void;
  onNavigateToGrader: () => void;
}

type LoadState = 'loading' | 'ready' | 'missing';

const FIELD =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#FF003C]/70 focus:outline-none';
const LABEL = 'mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/50';

function readIssuesParam(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = new URLSearchParams(window.location.search).get('issues') ?? '';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

/** Standalone scan-aware request page: the completed audit is attached to the enquiry. */
export const GraderFixForm: React.FC<GraderFixFormProps> = ({ onNavigateHome, onNavigateToGrader }) => {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [report, setReport] = useState<ScanReport | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const requestedIssues = useMemo(readIssuesParam, []);

  const returnToResults = () => {
    const scanId = report?.scanId || new URLSearchParams(window.location.search).get('scan');
    if (scanId) {
      window.location.assign(`/tools/website-grader?scan=${encodeURIComponent(scanId)}`);
      return;
    }
    onNavigateToGrader();
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const scanId = params.get('scan');
        if (!scanId) {
          if (!cancelled) setLoadState('missing');
          return;
        }
        let loadedReport: ScanReport | null = null;
        try {
          const res = await fetch(`/api/tools/website-grader/scan/${encodeURIComponent(scanId)}`);
          if (res.ok) {
            const payload = (await res.json()) as { success?: boolean; report?: ScanReport };
            if (payload.success && payload.report) loadedReport = payload.report;
          }
        } catch {
          // Try the same-tab cache below when server persistence is unavailable.
        }
        loadedReport = loadedReport ?? readClientScanReport(scanId);
        if (cancelled) return;
        if (!loadedReport) {
          setLoadState('missing');
          return;
        }
        cacheClientScanReport(loadedReport);
        setReport(loadedReport);
        if (requestedIssues.includes('all')) {
          setSelected(loadedReport.recommendations.slice(0, 12).map((r) => r.checkId));
        } else if (requestedIssues.includes('high-priority')) {
          setSelected(loadedReport.recommendations.filter((r) => r.priority === 'critical' || r.priority === 'high').map((r) => r.checkId));
        } else {
          const valid = new Set(loadedReport.recommendations.map((r) => r.checkId));
          setSelected(requestedIssues.filter((id) => valid.has(id)));
        }
        setLoadState('ready');
      } catch {
        if (!cancelled) setLoadState('missing');
      }
    })();
    return () => { cancelled = true; };
  }, [requestedIssues]);

  if (loadState === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#FF5575]" aria-hidden="true" />
        <p className="mt-4 text-sm text-white/65">Loading your completed scan…</p>
      </div>
    );
  }

  if (loadState === 'missing' || !report) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
        <Wrench className="mx-auto h-8 w-8 text-[#FF5575]" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-white sm:text-4xl">Run a scan first</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65">
          This form needs a completed Website Grader scan so the exact findings travel with your request.
          Run a free audit, then choose “Fix my website”.
        </p>
        <button
          type="button"
          onClick={returnToResults}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-7 text-xs font-black tracking-[0.14em] text-white transition-colors hover:bg-[#ffb347] hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the scanner
        </button>
      </div>
    );
  }

  const scoreLine = report.overall.score === null
    ? 'Not enough measurable data'
    : `${report.overall.score}/100 · ${report.overall.grade} · ${report.overall.label}`;
  const selectable = report.recommendations.slice(0, 12);

  const toggle = (checkId: string) => {
    setSelected((prev) => (prev.includes(checkId) ? prev.filter((id) => id !== checkId) : [...prev, checkId]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Add your name and email so I can reply to your scan.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/tools/website-grader/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId: report.scanId,
          report,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() ? phone.trim() : undefined,
          message: message.trim() ? message.trim() : undefined,
          issues: selected
        })
      });
      const data = (await res.json()) as { success?: boolean; error?: string; confirmationEmailSent?: boolean };
      if (res.ok && data.success) {
        setConfirmationEmailSent(Boolean(data.confirmationEmailSent));
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Network error. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-black text-white sm:text-4xl">Request received.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65">
          Thanks, {name.trim()}. Your scan of <strong className="break-all text-white">{report.targetUrl}</strong>{' '}
          {selected.length > 0 ? `and ${selected.length} selected issue${selected.length === 1 ? '' : 's'} are` : 'and your full-scan review request is'} with me.
          {' '}{confirmationEmailSent
            ? <>A PDF copy has been emailed to <strong className="break-all text-white">{email.trim()}</strong>. I&apos;ll review the findings and be in touch.</>
            : <>I&apos;ll review the findings and be in touch. The confirmation email could not be sent, but your request reached me successfully.</>}
        </p>
        <button
          type="button"
          onClick={returnToResults}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-white/10 px-6 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/20"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#FF5575]">Fix my website</p>
      <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
        Send this scan to me.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
        This request is attached to your completed audit of{' '}
        <span className="break-all font-semibold text-white">{report.targetUrl}</span>{' '}
        (<span className="font-semibold text-white">{scoreLine}</span>). Nothing unrelated is asked for: only your
        contact details, the issues you want fixed, and an optional note.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-400">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="grader-fix-name" className={LABEL}>Name *</label>
              <input
                id="grader-fix-name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="grader-fix-email" className={LABEL}>Email *</label>
              <input
                id="grader-fix-email"
                type="email"
                autoComplete="email"
                required
                maxLength={320}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourbusiness.com"
                className={FIELD}
              />
            </div>
          </div>

          <div>
            <label htmlFor="grader-fix-phone" className={LABEL}>Number (optional)</label>
            <input
              id="grader-fix-phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7700 900000"
              className={FIELD}
            />
          </div>

          <fieldset>
            <legend className={LABEL}>Which issues would you like help with? (optional)</legend>
            <p className="mb-3 text-xs leading-relaxed text-white/55">Select specific fixes, or leave them unchecked to ask for a review of the full scan.</p>
            <div className="grid gap-2">
              {selectable.map((rec) => (
                <label
                  key={rec.checkId}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed transition-colors ${
                    selected.includes(rec.checkId)
                      ? 'border-[#FF003C]/70 bg-[#FF003C]/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(rec.checkId)}
                    onChange={() => toggle(rec.checkId)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF003C]"
                  />
                  <span>
                    <span className="block font-bold">{rec.title}</span>
                    <span className="mt-0.5 block text-white/55">{CATEGORY_LABELS[rec.category]} · {rec.priority}</span>
                  </span>
                </label>
              ))}
            </div>
            {selectable.length === 0 && (
              <p className="text-xs leading-relaxed text-white/55">No fix-specific recommendations were generated. You can still send the scan for a review.</p>
            )}
          </fieldset>



          <div>
            <label htmlFor="grader-fix-message" className={LABEL}>Anything I should know? (optional)</label>
            <textarea
              id="grader-fix-message"
              rows={4}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deadlines, access, hosting, or anything urgent."
              className={`${FIELD} resize-none`}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5575]" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-white/55">
              Your details are sent with this scan so I can respond. They are not added to a marketing list.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF003C] px-7 text-xs font-black tracking-[0.2em] text-white uppercase shadow-[0_0_25px_rgba(255,0,60,0.4)] transition-all hover:scale-[1.01] hover:bg-[#ffb347] hover:text-black active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
              </>
            ) : (
              <>
                Send scan &amp; request a fix plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.02] p-5" aria-label="Attached scan">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Attached scan</p>
          <p className="mt-2 break-all text-sm font-bold text-white">{report.targetUrl}</p>
          <p className="mt-1 text-xs text-white/60">{scoreLine}</p>
          <p className="mt-3 text-xs leading-relaxed text-white/65">
            {report.summary.pass} passed · {report.summary.warning} warnings · {report.summary.fail} failed · {report.summary.notMeasured} not measured
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/65">{report.executiveSummary}</p>
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Category scores</p>
            <div className="mt-3 space-y-2">
              {report.categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-white/65">{category.label}</span>
                  <span className="shrink-0 font-mono font-bold text-white">{category.score === null ? 'Not measured' : `${category.score}/100`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Key findings</p>
            {report.recommendations.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {report.recommendations.slice(0, 6).map((recommendation) => (
                  <li key={recommendation.checkId} className="border-l-2 border-[#FF003C]/70 pl-3">
                    <p className="text-xs font-bold leading-relaxed text-white">{recommendation.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">{recommendation.priority} priority · {CATEGORY_LABELS[recommendation.category]}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{recommendation.whatDetected}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-white/60">No actionable recommendations were generated by this scan.</p>
            )}
          </div>
          <button
            type="button"
            onClick={returnToResults}
            className="mt-5 inline-flex min-h-11 items-center justify-center border border-white/25 px-5 text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-white/60"
          >
            Back to full results
          </button>
        </aside>
      </div>
    </div>
  );
};

