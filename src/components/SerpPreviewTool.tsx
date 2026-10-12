'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, CircleAlert, Copy, ExternalLink, LoaderCircle, Monitor, Search, Smartphone, Sparkles } from 'lucide-react';

type PreviewMode = 'desktop' | 'mobile';

interface KeywordRanking {
  keyword: string;
  evidence: string[];
  position: number | null;
  resultUrl: string | null;
  status: 'ranked' | 'not-found' | 'unavailable';
}

interface ScanResult {
  finalUrl: string;
  statusCode: number;
  title: string;
  description: string;
  keywords: KeywordRanking[];
  rankingsConfigured: boolean;
  region: string;
}

interface SnippetWidths {
  title: { width: number; lines: number };
  description: { width: number; lines: number };
}

interface LengthMeterProps {
  label: string;
  metrics: { width: number; lines: number };
  limit: number;
  maxLines: number;
}

const inputClass = 'min-h-11 w-full border border-white/20 bg-black/50 px-3.5 text-sm text-white placeholder:text-white/35 transition-colors focus:border-[#FF5575] focus:outline-none';
const labelClass = 'mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60';

const LengthMeter: React.FC<LengthMeterProps> = ({ label, metrics, limit, maxLines }) => {
  const overLimit = metrics.width > limit || metrics.lines > maxLines;
  const nearLimit = !overLimit && metrics.lines === maxLines;
  const fillWidth = Math.min(100, Math.round((metrics.lines / maxLines) * 100));
  const fillColor = overLimit ? 'bg-[#FF5575]' : nearLimit ? 'bg-amber-300' : 'bg-emerald-300';
  const textColor = overLimit ? 'text-[#FF8098]' : nearLimit ? 'text-amber-200' : 'text-emerald-200';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-semibold text-white/70">{label}</span>
        <span className="font-mono text-white/45">~{metrics.width}px widest line · {metrics.lines}/{maxLines} lines</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden bg-white/10" aria-hidden="true">
        <div className={`h-full transition-[width] ${fillColor}`} style={{ width: `${fillWidth}%` }} />
      </div>
      <p className={`mt-1.5 text-xs ${textColor}`}>
        {overLimit ? 'May be truncated in search results.' : nearLimit ? 'Uses all estimated display lines.' : 'Within the estimated display lines.'}
      </p>
    </div>
  );
};

function getDisplayAddress(value: string): { host: string; path: string } {
  try {
    const candidate = value.trim();
    const parsed = new URL(candidate.includes('://') ? candidate : `https://${candidate}`);
    const path = parsed.pathname.split('/').filter(Boolean).join(' › ');
    return { host: parsed.hostname.replace(/^www\./, ''), path };
  } catch {
    return { host: value.trim() || 'www.example.com', path: '' };
  }
}

function getWrappedTextMetrics(context: CanvasRenderingContext2D, text: string, maxWidth: number): { width: number; lines: number } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { width: 0, lines: 0 };

  let currentLine = '';
  let widestLine = 0;
  let lines = 0;
  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && context.measureText(candidate).width > maxWidth) {
      widestLine = Math.max(widestLine, context.measureText(currentLine).width);
      lines += 1;
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  widestLine = Math.max(widestLine, context.measureText(currentLine).width);
  return { width: Math.ceil(widestLine), lines: lines + 1 };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export const SerpPreviewTool: React.FC = () => {
  const [pageUrl, setPageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<PreviewMode>('desktop');
  const [copyComplete, setCopyComplete] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [widths, setWidths] = useState<SnippetWidths>({ title: { width: 0, lines: 0 }, description: { width: 0, lines: 0 } });
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [region, setRegion] = useState('gb');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const previewWidth = mode === 'desktop' ? 600 : 350;
    context.font = '400 20px Arial';
    const titleMetrics = getWrappedTextMetrics(context, title, previewWidth);
    context.font = '400 14px Arial';
    const descriptionMetrics = getWrappedTextMetrics(context, description, previewWidth);
    setWidths({ title: titleMetrics, description: descriptionMetrics });
  }, [title, description, mode]);

  const address = getDisplayAddress(scan?.finalUrl || pageUrl);
  const titleLimit = mode === 'desktop' ? 600 : 350;
  const descriptionLimit = titleLimit;
  const tags = `<title>${escapeHtml(title)}</title>\n<meta name="description" content="${escapeHtml(description)}">`;

  const scanWebsite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setScanError('');
    setScan(null);
    setIsScanning(true);
    setCopyComplete(false);
    setCopyFailed(false);

    try {
      const response = await fetch('/api/tools/serp-preview/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pageUrl.trim(), region })
      });
      const payload = await response.json() as ScanResult & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'We could not scan that page. Check the address and try again.');
      }
      setScan(payload);
      setPageUrl(payload.finalUrl);
      setTitle(payload.title);
      setDescription(payload.description);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'We could not scan that page. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const copyTags = async () => {
    try {
      await navigator.clipboard.writeText(tags);
      setCopyComplete(true);
      setCopyFailed(false);
    } catch {
      setCopyComplete(false);
      setCopyFailed(true);
    }
  };

  const resetFields = () => {
    setPageUrl('');
    setTitle('');
    setDescription('');
    setScan(null);
    setScanError('');
    setCopyComplete(false);
    setCopyFailed(false);
  };

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5575]">Free SEO tool</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">See how your page could show up on Google</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            Enter a page address to read its real title and description, find keywords from its on-page content, check Google positions when ranking data is connected, and preview the search snippet.
          </p>
        </header>

        <form onSubmit={scanWebsite} className="mt-8 grid gap-3 border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end sm:p-5">
          <div>
            <label htmlFor="serp-page-url" className={labelClass}>Your page or domain</label>
            <input
              id="serp-page-url"
              className={inputClass}
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              value={pageUrl}
              onChange={(event) => { setPageUrl(event.target.value); setScanError(''); }}
              placeholder="example.com or https://example.com/services"
              aria-describedby="serp-url-help"
            />
            <p id="serp-url-help" className="mt-1.5 text-xs text-white/45">We’ll scan the page you enter. No need to type https://.</p>
          </div>
          <div>
            <label htmlFor="serp-region" className={labelClass}>Google region</label>
            <select id="serp-region" value={region} onChange={(event) => setRegion(event.target.value)} className={`${inputClass} pr-8`}>
              <option value="gb">United Kingdom</option>
              <option value="us">United States</option>
              <option value="ie">Ireland</option>
            </select>
          </div>
          <button type="submit" disabled={isScanning} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.08em] text-white transition-colors hover:bg-[#ffb347] hover:text-black disabled:cursor-wait disabled:opacity-70">
            {isScanning ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
            {isScanning ? 'SCANNING PAGE…' : 'SCAN MY PAGE'}
          </button>
        </form>

        {scanError && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-[#FF8098]">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{scanError}
          </p>
        )}

        {isScanning && (
          <div className="mt-5 flex items-center gap-3 border border-white/10 bg-white/[0.03] p-4" role="status" aria-live="polite">
            <span className="flex shrink-0 items-center gap-0.5 font-bold" aria-hidden="true">
              <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-1/3 animate-pulse rounded-full bg-[#4285F4]" />
            </span>
            <span className="text-xs text-white/55">Reading page content and finding keyword topics…</span>
          </div>
        )}

        {scan && (
          <section aria-labelledby="serp-scan-heading" className="mt-6 border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5575]">Page scanned · HTTP {scan.statusCode}</p>
            <h2 id="serp-scan-heading" className="mt-1 text-lg font-black text-white">Keywords found in your page</h2>
            <p className="mt-1 break-all text-xs text-white/50">{scan.finalUrl}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">These are candidate search phrases extracted from the page title, main heading and description. They are not keyword-volume estimates or SEO scores.</p>
          </section>
        )}

        {scan && (
          <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
            <div className="space-y-7">
              <section aria-labelledby="serp-keyword-rankings-title">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">Google · {scan.region.toUpperCase()}</p>
                    <h2 id="serp-keyword-rankings-title" className="mt-1 text-lg font-black text-white">Keyword ranking table</h2>
                  </div>
                </div>
                <div className="mt-3 overflow-x-auto border border-white/10">
                  <table className="w-full min-w-[540px] border-collapse text-left text-xs">
                    <thead className="bg-white/[0.04] font-mono uppercase tracking-[0.1em] text-white/50">
                      <tr>
                        <th scope="col" className="px-3 py-3">Keyword</th>
                        <th scope="col" className="px-3 py-3">Found in</th>
                        <th scope="col" className="px-3 py-3">Google position</th>
                        <th scope="col" className="px-3 py-3">Search</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {scan.keywords.map((item) => (
                        <tr key={item.keyword} className="align-top">
                          <th scope="row" className="max-w-44 px-3 py-3 font-semibold text-white">{item.keyword}</th>
                          <td className="px-3 py-3 text-white/55">{item.evidence.join(', ')}</td>
                          <td className="px-3 py-3 font-mono font-bold text-white">
                            {item.position !== null
                              ? item.resultUrl
                                ? <a href={item.resultUrl} target="_blank" rel="noreferrer" className="text-[#8ab4f8] hover:underline">#{item.position}</a>
                                : `#${item.position}`
                              : item.status === 'not-found'
                                ? 'Outside top 100'
                                : scan.rankingsConfigured
                                  ? 'Unavailable'
                                  : 'Not connected'}
                          </td>
                          <td className="px-3 py-3">
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}&gl=${encodeURIComponent(scan.region)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#8ab4f8] hover:underline"
                            >
                              Google <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          </td>
                        </tr>
                      ))}
                      {scan.keywords.length === 0 && (
                        <tr><td colSpan={4} className="px-3 py-5 text-center text-white/50">No clear keyword phrases were found in the page metadata.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/50">
                  {scan.rankingsConfigured
                    ? 'Positions are organic Google results from the selected region and can change over time. “Outside top 100” means this page was not found in the results returned for that keyword. SERP provider usage may incur charges.'
                    : 'Live positions need a SERP data API. The ranking provider is not configured yet, so this table shows page-derived keywords and search links without inventing rank numbers. Configure SERPAPI_API_KEY on the server to enable position checks; provider usage may incur charges.'}
                </p>
              </section>

              <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label htmlFor="serp-title" className={labelClass}>Page title</label>
                  <input id="serp-title" className={inputClass} type="text" value={title} onChange={(event) => { setTitle(event.target.value); setCopyComplete(false); }} placeholder="Your page title | Your brand" />
                  <p className="mt-1.5 text-xs text-white/40">This is read from the page title tag. Edit it to test a better version.</p>
                </div>
                <div>
                  <label htmlFor="serp-description" className={labelClass}>Meta description</label>
                  <textarea id="serp-description" className={`${inputClass} min-h-32 resize-y py-3`} value={description} onChange={(event) => { setDescription(event.target.value); setCopyComplete(false); }} placeholder="Summarise what visitors will find on this page." />
                  <p className="mt-1.5 text-xs text-white/40">Google may use this text, or generate a snippet from the page instead.</p>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-5">
                  <LengthMeter label="Title width estimate" metrics={widths.title} limit={titleLimit} maxLines={2} />
                  <LengthMeter label="Description width estimate" metrics={widths.description} limit={descriptionLimit} maxLines={mode === 'desktop' ? 2 : 3} />
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button type="button" onClick={copyTags} className="inline-flex min-h-11 items-center gap-2 bg-[#FF003C] px-4 text-xs font-black tracking-[0.08em] text-white transition-colors hover:bg-[#ffb347] hover:text-black">
                    {copyComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copyComplete ? 'TAGS COPIED' : 'COPY META TAGS'}
                  </button>
                  <button type="button" onClick={resetFields} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 text-xs font-bold text-white/70 transition-colors hover:border-white/45 hover:text-white">Scan another page</button>
                  {(copyComplete || copyFailed) && <span className="text-xs text-white/55" role="status">{copyComplete ? 'Title and description tags copied.' : 'Clipboard unavailable in this browser.'}</span>}
                </div>
              </form>

            </div>

            <section aria-labelledby="serp-preview-title" className="min-w-0 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="serp-preview-title" className="text-lg font-black text-white">Animated search preview</h2>
                  <p className="mt-1 text-xs text-white/45">A Google-style mock-up using this page’s actual metadata.</p>
                </div>
                <div className="inline-flex border border-white/15 p-1" role="group" aria-label="Preview device">
                  <button type="button" onClick={() => setMode('desktop')} aria-pressed={mode === 'desktop'} className={`inline-flex min-h-9 items-center gap-2 px-3 text-xs font-bold transition-colors ${mode === 'desktop' ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}>
                    <Monitor className="h-4 w-4" aria-hidden="true" /> Desktop
                  </button>
                  <button type="button" onClick={() => setMode('mobile')} aria-pressed={mode === 'mobile'} className={`inline-flex min-h-9 items-center gap-2 px-3 text-xs font-bold transition-colors ${mode === 'mobile' ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}>
                    <Smartphone className="h-4 w-4" aria-hidden="true" /> Mobile
                  </button>
                </div>
              </div>

              <div key={`${scan.finalUrl}-${mode}`} className="serp-result-reveal flex min-h-[390px] justify-center border border-white/10 bg-white p-5 sm:p-8" aria-label={`${mode} search result preview`}>
                <div className={`w-full self-start ${mode === 'mobile' ? 'max-w-[390px]' : 'max-w-[660px]'}`}>
                  <div className="flex h-11 items-center gap-3 rounded-full border border-[#dadce0] px-4 text-sm text-[#5f6368] shadow-[0_1px_6px_rgba(32,33,36,0.18)]">
                    <Search className="h-4 w-4 shrink-0 text-[#5f6368]" aria-hidden="true" />
                    <span className="truncate">{address.host}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-2 font-[Arial,sans-serif] text-sm font-semibold" aria-label="Google style">
                    <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
                    <Sparkles className="ml-1 h-3.5 w-3.5 text-[#FBBC05]" aria-hidden="true" />
                  </div>

                  <article className="mt-5 max-w-[600px] font-[Arial,sans-serif]">
                    <div className="flex items-center gap-3 text-xs text-[#202124]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f1f3f4] text-[#5f6368]" aria-hidden="true">
                        <span className="text-[11px] font-bold">{address.host.charAt(0).toUpperCase()}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">{address.host}</span>
                        <span className="block truncate text-[#5f6368]">{address.path ? `› ${address.path}` : '›'}</span>
                      </span>
                    </div>
                    <h3 className="mt-1 line-clamp-2 cursor-pointer text-[20px] font-normal leading-[1.3] text-[#1a0dab] hover:underline">
                      {title || 'No page title tag found'}
                    </h3>
                    <p className={`mt-1 text-sm leading-[1.58] text-[#4d5156] ${mode === 'mobile' ? 'line-clamp-3' : 'line-clamp-2'}`}>
                      {description || 'No meta description found. Search engines may create a snippet from your page content.'}
                    </p>
                  </article>
                </div>
              </div>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-white/45">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF5575]" aria-hidden="true" />
                This is an illustrative preview, not a live Google result. Search engines can truncate, combine or rewrite titles and snippets.
              </p>
            </section>
          </div>
        )}

        {!scan && !isScanning && (
          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div><p className="text-sm font-bold text-white">1. Scan the real page</p><p className="mt-1 text-xs leading-relaxed text-white/50">We fetch its public HTML and read its title, description and page structure.</p></div>
            <div><p className="text-sm font-bold text-white">2. See what to improve</p><p className="mt-1 text-xs leading-relaxed text-white/50">Get a weighted list of on-page signals ordered by potential impact.</p></div>
            <div><p className="text-sm font-bold text-white">3. Preview the snippet</p><p className="mt-1 text-xs leading-relaxed text-white/50">View the page title and description in an animated Google-style result card.</p></div>
          </div>
        )}
      </div>
    </div>
  );
};
