import React, { useState } from 'react';
import { CATEGORY_LABELS } from '../../lib/grader/types';
import type { Recommendation } from '../../lib/grader/types';

interface ReportDigest {
  scanId: string;
  targetUrl: string;
  overallLabel: string;
  summaryLine: string;
  issueCount: number;
  recommendations: Recommendation[];
}

interface GraderFixTeaserProps {
  reportDigest: ReportDigest | null;
  onNavigateHome: () => void;
}

const ISSUE_OPTIONS = ['Fix every issue found', 'Only the high-priority issues', 'Only specific issues I will pick below'] as const;

/** Short scan-aware teaser shown on the grader page when a scan completes. */
export const GraderFixTeaser: React.FC<GraderFixTeaserProps> = ({ reportDigest, onNavigateHome }) => {
  const [pick, setPick] = useState<(typeof ISSUE_OPTIONS)[number]>(ISSUE_OPTIONS[0]);
  const [selected, setSelected] = useState<string[]>([]);

  if (!reportDigest) return null;

  const maxSelectable = Math.min(reportDigest.recommendations.length, 12);
  const pickingSpecific = pick === ISSUE_OPTIONS[2];

  const toggle = (checkId: string) => {
    setSelected((prev) => (prev.includes(checkId) ? prev.filter((id) => id !== checkId) : [...prev, checkId]));
  };

  const fixHref = pickingSpecific
    ? `/tools/website-grader/fix-my-website?scan=${encodeURIComponent(reportDigest.scanId)}&issues=${encodeURIComponent(selected.join(','))}`
    : pick === ISSUE_OPTIONS[1]
      ? `/tools/website-grader/fix-my-website?scan=${encodeURIComponent(reportDigest.scanId)}&issues=high-priority`
      : `/tools/website-grader/fix-my-website?scan=${encodeURIComponent(reportDigest.scanId)}&issues=all`;

  return (
    <section className="border-b border-white/10 px-5 py-12 md:px-8" aria-label="Fix these findings">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF5575]">Fix my website</p>
        <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-4xl">
          Send this exact scan to me.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
          {reportDigest.targetUrl} — {reportDigest.overallLabel}. {reportDigest.summaryLine} Choose which
          problems you want priced up, then continue to the request form. The completed audit is attached to
          your enquiry automatically.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Which issues should be fixed?">
          {ISSUE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={pick === option}
              onClick={() => setPick(option)}
              className={`rounded-2xl border p-4 text-left text-sm font-bold transition-colors ${
                pick === option
                  ? 'border-[#FF003C]/70 bg-[#FF003C]/10 text-white'
                  : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {pickingSpecific && (
          <fieldset className="mt-5">
            <legend className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Pick the issues to include
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {reportDigest.recommendations.slice(0, maxSelectable).map((rec) => (
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
            {selected.length === 0 && (
              <p className="mt-3 text-xs text-amber-300">Pick at least one issue to continue.</p>
            )}
          </fieldset>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={pickingSpecific && selected.length === 0 ? undefined : fixHref}
            aria-disabled={pickingSpecific && selected.length === 0}
            onClick={(e) => { if (pickingSpecific && selected.length === 0) e.preventDefault(); }}
            className={`inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-7 text-xs font-black tracking-[0.14em] text-white transition-colors hover:bg-[#ffb347] hover:text-black sm:w-auto ${
              pickingSpecific && selected.length === 0 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Continue to the fix form
          </a>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex min-h-12 items-center justify-center border border-white/25 px-7 text-xs font-bold tracking-[0.14em] text-white transition-colors hover:border-white/60"
          >
            Back to my results
          </button>
        </div>
      </div>
    </section>
  );
};
