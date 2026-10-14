'use client';

import React, { useMemo, useState } from 'react';
import { Braces, CircleAlert, CircleCheck, ClipboardCopy, Info, RotateCcw } from 'lucide-react';
import { validateStructuredData, type StructuredDataResult, type StructuredFindingSeverity } from '../../lib/structuredDataValidator';

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
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState<{ url: string; result: StructuredDataResult } | null>(null);
  const [urlError, setUrlError] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const localResult = useMemo(() => validateStructuredData(input), [input]);
  const result = urlResult?.result ?? localResult;
  const hasInput = input.trim().length > 0 || Boolean(urlResult);

  const copyFindings = async () => {
    const text = result.findings.map((finding) => `[${finding.severity.toUpperCase()}] ${finding.title}\n${finding.detail}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Findings copied.');
    } catch {
      setCopyStatus('Clipboard access is unavailable; select the findings and copy them manually.');
    }
  };

  const scanUrl = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrlError('');
    setUrlResult(null);
    setUrlLoading(true);
    try {
      const response = await fetch('/api/tools/structured-data-validator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput })
      });
      const payload = await response.json() as { success?: boolean; url?: string; result?: StructuredDataResult; error?: string };
      if (!response.ok || !payload.success || !payload.result || !payload.url) throw new Error(payload.error || 'The page could not be analysed.');
      setUrlResult({ url: payload.url, result: payload.result });
    } catch (cause) {
      setUrlError(cause instanceof Error ? cause.message : 'The page could not be analysed.');
    } finally {
      setUrlLoading(false);
    }
  };

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
              onChange={(event) => { setInput(event.target.value); setUrlResult(null); setUrlError(''); }}
              spellCheck={false}
              rows={18}
              maxLength={250000}
              aria-label="Paste JSON-LD or HTML to validate"
              placeholder={example}
              className="mt-4 min-h-[320px] w-full resize-y border border-white/15 bg-black/50 p-4 font-mono text-xs leading-relaxed text-white placeholder:text-white/25 focus:border-[#FF5575] focus:outline-none"
            />
            <p className="mt-2 text-xs text-white/40">Up to 250,000 characters. Paste JSON-LD directly or the HTML containing its script blocks.</p>
            <button type="button" onClick={() => { setInput(example); setUrlResult(null); setUrlError(''); }} className="mt-4 min-h-10 border border-white/20 px-4 text-xs font-bold text-white/75 transition-colors hover:border-[#FF5575]/60 hover:text-white">Load example</button>
            <form onSubmit={scanUrl} className="mt-6 border-t border-white/10 pt-5">
              <label htmlFor="structured-page-url" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Or inspect a public page URL</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input id="structured-page-url" type="url" inputMode="url" required maxLength={2048} value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="https://example.com/product" className="min-h-11 min-w-0 flex-1 border border-white/20 bg-black/50 px-3 text-sm text-white placeholder:text-white/30 focus:border-[#FF5575] focus:outline-none" />
                <button type="submit" disabled={urlLoading} className="min-h-11 border border-[#FF003C]/60 bg-[#FF003C]/10 px-4 text-xs font-bold text-white transition-colors hover:bg-[#FF003C]/20 disabled:opacity-50">{urlLoading ? 'Scanning…' : 'Scan URL'}</button>
              </div>
              <p className="mt-2 text-xs text-white/40">The server fetch is rate-limited, size-capped and protected against private-network destinations and unsafe redirects.</p>
              {urlError && <p role="alert" className="mt-2 text-xs text-red-200">{urlError}</p>}
            </form>
          </section>

          <section aria-labelledby="structured-results-title" aria-live="polite">
            <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-[#FF003C]/35 bg-[#FF003C]/10 text-[#FF5575]"><Braces className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 id="structured-results-title" className="text-lg font-black text-white">Findings</h2>
                    <button type="button" onClick={copyFindings} disabled={!hasInput || result.findings.length === 0} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 text-xs text-white/65 transition-colors hover:border-white/35 hover:text-white disabled:opacity-40"><ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" /> Copy findings</button>
                  </div>
                  <p className="mt-1 text-xs text-white/45">{urlResult ? `Fetched: ${urlResult.url}` : hasInput ? `${result.scriptCount} block(s) parsed · ${result.entityCount} typed entity/entities` : 'Results appear as you paste input'}</p>
                  {copyStatus && <p className="mt-1 text-xs text-white/55" role="status">{copyStatus}</p>
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
