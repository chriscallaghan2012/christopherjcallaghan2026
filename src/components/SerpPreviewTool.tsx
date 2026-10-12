'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, Monitor, Search, Smartphone } from 'lucide-react';

type PreviewMode = 'desktop' | 'mobile';

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
  const [pageUrl, setPageUrl] = useState('https://example.com/services');
  const [title, setTitle] = useState('Web Design & Development Services | Acme Studio');
  const [description, setDescription] = useState('Build a clearer, faster website with expert design and development. Explore services, see how the process works, and request a project estimate.');
  const [mode, setMode] = useState<PreviewMode>('desktop');
  const [copyComplete, setCopyComplete] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [widths, setWidths] = useState<SnippetWidths>({ title: { width: 0, lines: 0 }, description: { width: 0, lines: 0 } });

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

  const address = getDisplayAddress(pageUrl);
  const titleLimit = mode === 'desktop' ? 600 : 350;
  const descriptionLimit = titleLimit;
  const tags = `<title>${escapeHtml(title)}</title>\n<meta name="description" content="${escapeHtml(description)}">`;

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
    setPageUrl('https://example.com/services');
    setTitle('Web Design & Development Services | Acme Studio');
    setDescription('Build a clearer, faster website with expert design and development. Explore services, see how the process works, and request a project estimate.');
    setCopyComplete(false);
    setCopyFailed(false);
  };

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5575]">Free SEO tool</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">Preview your Google search result</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            Shape your page title and meta description, then preview how the snippet could appear on desktop and mobile.
          </p>
        </header>

        <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            <div>
              <label htmlFor="serp-page-url" className={labelClass}>Page URL</label>
              <input id="serp-page-url" className={inputClass} type="url" inputMode="url" value={pageUrl} onChange={(event) => { setPageUrl(event.target.value); setCopyComplete(false); }} placeholder="https://example.com/page" />
            </div>
            <div>
              <label htmlFor="serp-title" className={labelClass}>Page title</label>
              <input id="serp-title" className={inputClass} type="text" value={title} onChange={(event) => { setTitle(event.target.value); setCopyComplete(false); }} placeholder="Your page title | Your brand" />
              <p className="mt-1.5 text-xs text-white/40">Use a clear, distinct title that describes this page.</p>
            </div>
            <div>
              <label htmlFor="serp-description" className={labelClass}>Meta description</label>
              <textarea id="serp-description" className={`${inputClass} min-h-32 resize-y py-3`} value={description} onChange={(event) => { setDescription(event.target.value); setCopyComplete(false); }} placeholder="Summarise what visitors will find on this page." />
              <p className="mt-1.5 text-xs text-white/40">Summarise the page accurately and give people a reason to visit.</p>
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
              <button type="button" onClick={resetFields} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 text-xs font-bold text-white/70 transition-colors hover:border-white/45 hover:text-white">Reset example</button>
              {(copyComplete || copyFailed) && <span className="text-xs text-white/55" role="status">{copyComplete ? 'Title and description tags copied.' : 'Clipboard unavailable in this browser.'}</span>}
            </div>
          </form>

          <section aria-labelledby="serp-preview-title" className="min-w-0 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="serp-preview-title" className="text-lg font-black text-white">Search result preview</h2>
                <p className="mt-1 text-xs text-white/45">Approximate layout. Search engines may rewrite snippets.</p>
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

            <div className="flex min-h-[390px] justify-center border border-white/10 bg-white p-5 sm:p-8" aria-label={`${mode} search result preview`}>
              <div className={`w-full self-start ${mode === 'mobile' ? 'max-w-[390px]' : 'max-w-[660px]'}`}>
                <div className="flex h-11 items-center gap-3 rounded-full border border-[#dadce0] px-4 text-sm text-[#5f6368] shadow-[0_1px_6px_rgba(32,33,36,0.18)]">
                  <Search className="h-4 w-4 shrink-0 text-[#5f6368]" aria-hidden="true" />
                  <span className="truncate">Search</span>
                </div>

                <article className="mt-8 max-w-[600px] font-[Arial,sans-serif]">
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
                    {title || 'Your page title will appear here'}
                  </h3>
                  <p className={`mt-1 text-sm leading-[1.58] text-[#4d5156] ${mode === 'mobile' ? 'line-clamp-3' : 'line-clamp-2'}`}>
                    {description || 'Your page description will appear here. Write a clear summary that helps people understand the page.'}
                  </p>
                </article>
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-white/45">
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF5575]" aria-hidden="true" />
              Pixel widths are estimates using common snippet fonts. Google can truncate, combine, or rewrite page titles and descriptions based on the search.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};