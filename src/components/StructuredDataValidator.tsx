'use client';

import React, { useMemo, useState } from 'react';
import { Braces, CircleAlert, CircleCheck, Info, RotateCcw } from 'lucide-react';
import { validateStructuredData, type StructuredFindingSeverity } from '../../lib/structuredDataValidator';

const example = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Company",
  "url": "https://example.com"
}`;

const severityStyles: Record<StructuredFindingSeverity, string> = {
  error: 'border-red-400/35 bg-red-400/10 text-red-200',
  warning: 'border-amber-300/35 bg-amber-300/10 text-amber-100',
  info: 'border-white/15 bg-white/[0.03] text-white/75'
};

export const StructuredDataValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const result = useMemo(() => validateStructuredData(input), [input]);
  const hasInput = input.trim().length > 0;

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5575]">Free structured data tool</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">Structured Data Validator</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            Check pasted JSON-LD or HTML for JSON syntax, detected entity types and a few common property gaps. Your input is checked in this browser; it is not uploaded.
          </p>
        </header>

        <div className="mt-9 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6" aria-labelledby="structured-input-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="structured-input-title" className="text-lg font-black text-white">Paste JSON-LD or page HTML</h2>
              <button type="button" onClick={() => setInput('')} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 text-xs text-white/65 transition-colors hover:border-white/35 hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              rows={18}
              maxLength={250000}
              aria-label="Paste JSON-LD or HTML to validate"
              placeholder={example}
              className="mt-4 min-h-[320px] w-full resize-y border border-white/15 bg-black/50 p-4 font-mono text-xs leading-relaxed text-white placeholder:text-white/25 focus:border-[#FF5575] focus:outline-none"
            />
            <p className="mt-2 text-xs text-white/40">Up to 250,000 characters. Paste JSON-LD directly or the HTML containing its script blocks.</p>
            <button type="button" onClick={() => setInput(example)} className="mt-4 min-h-10 border border-white/20 px-4 text-xs font-bold text-white/75 transition-colors hover:border-[#FF5575]/60 hover:text-white">Load example</button>
          </section>

          <section aria-labelledby="structured-results-title" aria-live="polite">
            <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-[#FF003C]/35 bg-[#FF003C]/10 text-[#FF5575]"><Braces className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h2 id="structured-results-title" className="text-lg font-black text-white">Findings</h2>
                  <p className="text-xs text-white/45">{hasInput ? `${result.scriptCount} block(s) parsed · ${result.entityCount} typed entity/entities` : 'Results appear as you paste input'}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {result.findings.map((finding, index) => {
                  const Icon = finding.severity === 'error' ? CircleAlert : finding.severity === 'warning' ? Info : CircleCheck;
                  return (
                    <article key={`${finding.title}-${index}`} className={`border p-3 ${severityStyles[finding.severity]}`}>
                      <h3 className="flex items-start gap-2 text-sm font-bold">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {finding.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed opacity-85">{finding.detail}</p>
                    </article>
                  );
                })}
              </div>

              {result.types.length > 0 && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">Detected types</h3>
                  <div className="mt-2 flex flex-wrap gap-2">{result.types.map((type) => <span key={type} className="border border-white/15 px-2 py-1 font-mono text-xs text-white/75">{type}</span>)}</div>
                </div>
              )}
            </div>

            <div className="mt-4 border border-white/10 p-5">
              <h2 className="text-sm font-black text-white">Official tools for deeper checks</h2>
              <p className="mt-1 text-xs leading-relaxed text-white/50">This utility is a quick syntax and property review, not a full Schema.org or Google eligibility validator.</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="text-[#FF8aa1] underline underline-offset-4 hover:text-white" href="https://validator.schema.org/" target="_blank" rel="noreferrer">Schema.org Validator</a></li>
                <li><a className="text-[#FF8aa1] underline underline-offset-4 hover:text-white" href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">Google Rich Results Test</a></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
