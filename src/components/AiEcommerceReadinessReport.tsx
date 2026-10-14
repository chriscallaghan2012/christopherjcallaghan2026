'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, PackageSearch, Info } from 'lucide-react';
import type { ProductReadinessReport, ProductReadinessFinding } from '../../lib/aiEcommerceReadiness';

const statusStyles = {
  pass: 'border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-100',
  warning: 'border-amber-300/30 bg-amber-300/[0.07] text-amber-100',
  info: 'border-white/15 bg-white/[0.03] text-white/75',
  unknown: 'border-white/10 bg-black/20 text-white/50'
} as const;

function FindingCard({ finding }: { finding: ProductReadinessFinding }) {
  const Icon = finding.status === 'pass' ? CheckCircle2 : finding.status === 'warning' ? AlertCircle : Info;
  return (
    <article className={`border p-4 ${statusStyles[finding.status]}`}>
      <h3 className="flex items-start gap-2 text-sm font-bold"><Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{finding.title}</h3>
      <p className="mt-1 text-xs leading-relaxed opacity-80">{finding.detail}</p>
      {finding.evidence && <p className="mt-2 break-words border-t border-white/10 pt-2 font-mono text-[11px] opacity-70">{finding.evidence}</p>}
    </article>
  );
}

export const AiEcommerceReadinessReport: React.FC = () => {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<ProductReadinessReport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const runScan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setReport(null);
    setLoading(true);
    try {
      const response = await fetch('/api/tools/ai-ecommerce-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const payload = await response.json() as { success?: boolean; report?: ProductReadinessReport; error?: string };
      if (!response.ok || !payload.success || !payload.report) throw new Error(payload.error || 'The product page could not be analysed.');
      setReport(payload.report);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The product page could not be analysed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5575]">Free eCommerce tool</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">AI eCommerce Readiness Report</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">Check observable product-page signals including metadata, canonical URLs, images and Product structured data. Findings show the evidence available to the scanner.</p>
        </header>

        <form onSubmit={runScan} className="mt-8 flex flex-col gap-3 border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-end sm:p-6">
          <div className="flex-1">
            <label htmlFor="product-page-url" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Public product page URL</label>
            <input id="product-page-url" type="url" inputMode="url" autoComplete="url" required maxLength={2048} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://shop.example/products/item" className="min-h-12 w-full border border-white/20 bg-black/50 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#FF5575] focus:outline-none" />
            <p className="mt-2 text-xs text-white/40">Public HTTP/HTTPS pages only. The scan is rate-limited and blocks private or local network destinations.</p>
          </div>
          <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ffb347] hover:text-black disabled:cursor-wait disabled:opacity-60">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <PackageSearch className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Scanning…' : 'Run report'}
          </button>
        </form>

        {error && <p role="alert" className="mt-4 border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">{error}</p>}
        {report && (
          <section className="mt-8" aria-live="polite">
            <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5575]">Report</p>
              <h2 className="mt-2 break-words text-xl font-black text-white">{report.pageTitle || report.finalUrl}</h2>
              <p className="mt-2 break-all text-xs text-white/45">Scanned: {report.finalUrl}</p>
              {report.description && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">{report.description}</p>}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border border-white/10 p-3"><p className="text-xs text-white/45">Product schema</p><p className="mt-1 text-sm font-bold text-white">{report.productTypes.length ? report.productTypes.join(', ') : 'Not detected'}</p></div>
                <div className="border border-white/10 p-3"><p className="text-xs text-white/45">Price</p><p className="mt-1 text-sm font-bold text-white">{report.price ? `${report.price}${report.priceCurrency ? ` ${report.priceCurrency}` : ''}` : 'Not observed'}</p></div>
                <div className="border border-white/10 p-3"><p className="text-xs text-white/45">Availability</p><p className="mt-1 text-sm font-bold text-white">{report.availability ?? 'Not observed'}</p></div>
                <div className="border border-white/10 p-3"><p className="text-xs text-white/45">HTML images</p><p className="mt-1 text-sm font-bold text-white">{report.imageCount}</p></div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">{report.findings.map((finding, index) => <FindingCard key={`${finding.title}-${index}`} finding={finding} />)}</div>
            <div className="mt-5 border border-white/10 p-5">
              <h3 className="text-sm font-black text-white">Limitations</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-white/55">{report.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
            </div>
            <p className="mt-5 text-sm text-white/65">Want help fixing these findings? <a href="/build" className="font-bold text-[#FF8aa1] underline underline-offset-4 hover:text-white">Send a project brief</a> or <a href="/contact" className="font-bold text-[#FF8aa1] underline underline-offset-4 hover:text-white">get in touch</a>.</p>
          </section>
        )}
      </div>
    </div>
  );
};
