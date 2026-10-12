'use client';

import React, { useRef, useState } from 'react';
import { Check, ClipboardCopy, Download, Plus, Trash2 } from 'lucide-react';
import { buildLlmsTxt, validateLlmsInput, type LlmsTxtInput, type LlmsTxtLink, type LlmsTxtSection } from '../../lib/llmsTxt';

const initialInput: LlmsTxtInput = {
  siteName: '',
  siteUrl: '',
  summary: '',
  guidance: '',
  sections: [{ id: 'section-1', title: '', links: [{ id: 'link-1', title: '', url: '', description: '' }] }]
};

const fieldClass = 'min-h-11 w-full border border-white/20 bg-black/50 px-3.5 text-sm text-white placeholder:text-white/35 transition-colors focus:border-[#FF5575] focus:outline-none';
const labelClass = 'mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60';

export const LlmsTxtBuilder: React.FC = () => {
  const [input, setInput] = useState(initialInput);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const nextId = useRef(2);
  const errors = validateLlmsInput(input);
  const preview = buildLlmsTxt(input);
  const isValid = Object.keys(errors).every((key) => {
    const value = errors[key as keyof typeof errors];
    return typeof value === 'object' ? Object.keys(value).length === 0 : !value;
  });

  const createId = (prefix: string) => `${prefix}-${nextId.current++}`;
  const markTouched = (field: string) => setTouched((current) => ({ ...current, [field]: true }));

  const updateSection = (sectionId: string, update: (section: LlmsTxtSection) => LlmsTxtSection) => {
    setInput((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === sectionId ? update(section) : section)
    }));
  };

  const updateLink = (sectionId: string, linkId: string, patch: Partial<LlmsTxtLink>) => {
    updateSection(sectionId, (section) => ({
      ...section,
      links: section.links.map((link) => link.id === linkId ? { ...link, ...patch } : link)
    }));
  };

  const addSection = () => {
    setInput((current) => ({
      ...current,
      sections: [...current.sections, { id: createId('section'), title: '', links: [{ id: createId('link'), title: '', url: '', description: '' }] }]
    }));
  };

  const addLink = (sectionId: string) => {
    updateSection(sectionId, (section) => ({
      ...section,
      links: [...section.links, { id: createId('link'), title: '', url: '', description: '' }]
    }));
  };

  const removeSection = (sectionId: string) => {
    setInput((current) => ({ ...current, sections: current.sections.filter((section) => section.id !== sectionId) }));
  };

  const removeLink = (sectionId: string, linkId: string) => {
    updateSection(sectionId, (section) => ({ ...section, links: section.links.filter((link) => link.id !== linkId) }));
  };

  const copyPreview = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const downloadPreview = () => {
    const file = new Blob([preview], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'llms.txt';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5575]">Free AI search tool</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">Build your llms.txt</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            Create a concise, structured guide to your site for AI systems. Add the pages and descriptions you want represented.
          </p>
        </header>

        <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
            <section className="space-y-4 border-b border-white/10 pb-7" aria-labelledby="llms-site-title">
              <h2 id="llms-site-title" className="text-lg font-black text-white">Site details</h2>
              <div>
                <label htmlFor="llms-site-name" className={labelClass}>Site or business name</label>
                <input id="llms-site-name" className={fieldClass} maxLength={120} value={input.siteName} aria-invalid={Boolean(errors.siteName && touched.siteName)} aria-describedby="llms-site-name-error" onBlur={() => markTouched('siteName')} onChange={(event) => setInput((current) => ({ ...current, siteName: event.target.value }))} placeholder="Acme Studio" />
                {errors.siteName && touched.siteName && <p id="llms-site-name-error" className="mt-1 text-xs text-[#FF5575]">{errors.siteName}</p>}
              </div>
              <div>
                <label htmlFor="llms-site-url" className={labelClass}>Canonical website URL</label>
                <input id="llms-site-url" className={fieldClass} type="url" inputMode="url" maxLength={2048} value={input.siteUrl} aria-invalid={Boolean(errors.siteUrl && touched.siteUrl)} aria-describedby="llms-site-url-error" onBlur={() => markTouched('siteUrl')} onChange={(event) => setInput((current) => ({ ...current, siteUrl: event.target.value }))} placeholder="https://example.com" />
                {errors.siteUrl && touched.siteUrl && <p id="llms-site-url-error" className="mt-1 text-xs text-[#FF5575]">{errors.siteUrl}</p>}
              </div>
              <div>
                <label htmlFor="llms-summary" className={labelClass}>Short site summary</label>
                <textarea id="llms-summary" className={`${fieldClass} min-h-24 resize-y py-3`} maxLength={280} value={input.summary} aria-invalid={Boolean(errors.summary && touched.summary)} aria-describedby="llms-summary-error llms-summary-count" onBlur={() => markTouched('summary')} onChange={(event) => setInput((current) => ({ ...current, summary: event.target.value }))} placeholder="What does this site offer, and who is it for?" />
                <div className="mt-1 flex justify-between gap-3 text-xs">
                  {errors.summary && touched.summary ? <p id="llms-summary-error" className="text-[#FF5575]">{errors.summary}</p> : <span />}
                  <p id="llms-summary-count" className="shrink-0 text-white/40">{input.summary.length}/280</p>
                </div>
              </div>
              <div>
                <label htmlFor="llms-guidance" className={labelClass}>Guidance for AI systems <span className="font-normal text-white/40">(optional)</span></label>
                <textarea id="llms-guidance" className={`${fieldClass} min-h-24 resize-y py-3`} maxLength={2000} value={input.guidance} aria-invalid={Boolean(errors.guidance && touched.guidance)} aria-describedby="llms-guidance-error" onBlur={() => markTouched('guidance')} onChange={(event) => setInput((current) => ({ ...current, guidance: event.target.value }))} placeholder="Preferred naming, attribution, or source-of-truth notes." />
                {errors.guidance && touched.guidance && <p id="llms-guidance-error" className="mt-1 text-xs text-[#FF5575]">{errors.guidance}</p>}
              </div>
            </section>

            <section className="space-y-5" aria-labelledby="llms-pages-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="llms-pages-title" className="text-lg font-black text-white">Important pages</h2>
                  <p className="mt-1 text-xs text-white/50">Group related pages under a clear heading.</p>
                </div>
                <button type="button" onClick={addSection} className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-xs font-bold text-white transition-colors hover:border-[#FF5575]">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add section
                </button>
              </div>

              {input.sections.map((section, sectionIndex) => (
                <fieldset key={section.id} className="space-y-4 border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                  <div className="flex items-end gap-3">
                    <div className="min-w-0 flex-1">
                      <label htmlFor={`llms-section-${section.id}`} className={labelClass}>Section {sectionIndex + 1}</label>
                      <input id={`llms-section-${section.id}`} className={fieldClass} maxLength={100} value={section.title} aria-invalid={Boolean(errors.sectionTitles[section.id] && touched[`section:${section.id}`])} aria-describedby={`llms-section-error-${section.id}`} onBlur={() => markTouched(`section:${section.id}`)} onChange={(event) => updateSection(section.id, (current) => ({ ...current, title: event.target.value }))} placeholder="About and contact" />
                      {errors.sectionTitles[section.id] && touched[`section:${section.id}`] && <p id={`llms-section-error-${section.id}`} className="mt-1 text-xs text-[#FF5575]">{errors.sectionTitles[section.id]}</p>}
                    </div>
                    <button type="button" onClick={() => removeSection(section.id)} aria-label={`Remove section ${sectionIndex + 1}`} title="Remove section" className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#FF5575] hover:text-[#FF5575]">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  {section.links.map((link, linkIndex) => (
                    <div key={link.id} className="space-y-3 border-l-2 border-white/10 pl-3 sm:pl-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">Page {linkIndex + 1}</p>
                        <button type="button" onClick={() => removeLink(section.id, link.id)} aria-label={`Remove page ${linkIndex + 1} from section ${sectionIndex + 1}`} title="Remove page" className="inline-flex h-8 w-8 items-center justify-center text-white/45 transition-colors hover:text-[#FF5575]">
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`llms-link-title-${link.id}`} className={labelClass}>Page title</label>
                          <input id={`llms-link-title-${link.id}`} className={fieldClass} maxLength={140} value={link.title} aria-invalid={Boolean(errors.linkTitles[link.id] && touched[`title:${link.id}`])} aria-describedby={`llms-link-title-error-${link.id}`} onBlur={() => markTouched(`title:${link.id}`)} onChange={(event) => updateLink(section.id, link.id, { title: event.target.value })} placeholder="Services" />
                          {errors.linkTitles[link.id] && touched[`title:${link.id}`] && <p id={`llms-link-title-error-${link.id}`} className="mt-1 text-xs text-[#FF5575]">{errors.linkTitles[link.id]}</p>}
                        </div>
                        <div>
                          <label htmlFor={`llms-link-url-${link.id}`} className={labelClass}>Page URL</label>
                          <input id={`llms-link-url-${link.id}`} className={fieldClass} type="url" inputMode="url" maxLength={2048} value={link.url} aria-invalid={Boolean(errors.linkUrls[link.id] && touched[`url:${link.id}`])} aria-describedby={`llms-link-url-error-${link.id}`} onBlur={() => markTouched(`url:${link.id}`)} onChange={(event) => updateLink(section.id, link.id, { url: event.target.value })} placeholder="https://example.com/services" />
                          {errors.linkUrls[link.id] && touched[`url:${link.id}`] && <p id={`llms-link-url-error-${link.id}`} className="mt-1 text-xs text-[#FF5575]">{errors.linkUrls[link.id]}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`llms-link-description-${link.id}`} className={labelClass}>What is on this page <span className="font-normal text-white/40">(optional)</span></label>
                        <input id={`llms-link-description-${link.id}`} className={fieldClass} maxLength={240} value={link.description} aria-invalid={Boolean(errors.linkDescriptions[link.id] && touched[`description:${link.id}`])} aria-describedby={`llms-link-description-error-${link.id}`} onBlur={() => markTouched(`description:${link.id}`)} onChange={(event) => updateLink(section.id, link.id, { description: event.target.value })} placeholder="A brief, accurate description" />
                        {errors.linkDescriptions[link.id] && touched[`description:${link.id}`] && <p id={`llms-link-description-error-${link.id}`} className="mt-1 text-xs text-[#FF5575]">{errors.linkDescriptions[link.id]}</p>}
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={() => addLink(section.id)} className="inline-flex min-h-9 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF5575] transition-colors hover:text-white">
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add page
                  </button>
                </fieldset>
              ))}
            </section>
          </form>

          <aside className="border border-white/15 bg-[#0c0c10] lg:sticky lg:top-6" aria-label="Generated llms.txt preview">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">Live preview</p>
                <h2 className="mt-1 text-base font-black text-white">llms.txt</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={copyPreview} disabled={!isValid || !preview} title="Copy llms.txt" aria-label="Copy llms.txt" className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-35">
                  {copyState === 'copied' ? <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button type="button" onClick={downloadPreview} disabled={!isValid || !preview} title="Download llms.txt" aria-label="Download llms.txt" className="inline-flex h-10 w-10 items-center justify-center bg-[#FF003C] text-white transition-colors hover:bg-[#ffb347] hover:text-black disabled:cursor-not-allowed disabled:opacity-35">
                  <Download className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <label htmlFor="llms-preview" className="sr-only">Generated llms.txt content</label>
              <textarea id="llms-preview" readOnly spellCheck={false} value={preview} placeholder="Complete the site name, URL, and summary to see your file." className="min-h-[28rem] w-full resize-y border border-white/10 bg-black/60 p-4 font-mono text-xs leading-relaxed text-white/80 placeholder:text-white/35 focus:border-[#FF5575] focus:outline-none" />
              <div className="mt-3 min-h-5 text-xs" aria-live="polite">
                {copyState === 'copied' && <p className="text-emerald-300">Copied to clipboard.</p>}
                {copyState === 'failed' && <p className="text-amber-300">Could not access the clipboard. Select and copy the preview text.</p>}
                {!isValid && <p className="text-white/45">Complete the required details and fix any invalid page links to enable file actions.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};