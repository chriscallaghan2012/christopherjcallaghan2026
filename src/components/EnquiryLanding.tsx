'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, CheckCircle2, Clock3, Code2, Globe2, Mail, MapPin, Search, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

const FiberNetwork = dynamic(() => import('./FiberNetwork').then((module) => module.FiberNetwork), { ssr: false, loading: () => null });

const PROJECT_TYPES = [
  'Website design & development',
  'Web application or SaaS',
  'Mobile app development',
  'AI integration & automation',
  'E-commerce',
  'Technical SEO & organic search',
  'Local SEO & Google Maps',
  'Google Business Profile optimisation',
  'Google Ads & PPC',
  'Ongoing development & support',
  'Something else'
];

const BUDGETS = ['Not sure yet', 'Under £1,000', '£1,000–£5,000', '£5,000–£10,000', '£10,000–£25,000', '£25,000+'];
const TIMELINES = ['As soon as possible', 'Within 1 month', '1–3 months', '3+ months', 'Just exploring / flexible'];

const fieldClass = 'mt-2 min-h-[52px] w-full border border-white/10 bg-[#111116]/90 px-4 text-[15px] text-white outline-none transition placeholder:text-white/30 focus:border-[#ff315f]/80 focus:bg-white/[0.055] focus:ring-2 focus:ring-[#ff003c]/10';
const labelClass = 'block min-w-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55';

export function EnquiryLanding() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessName: '', websiteUrl: '', projectType: '', budget: 'Not sure yet', timeline: 'Just exploring / flexible', message: '', privacyAccepted: false, website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          businessName: form.businessName.trim(),
          websiteUrl: form.websiteUrl.trim(),
          projectType: form.projectType,
          packageScope: form.projectType,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message.trim(),
          website: form.website,
          type: 'contact'
        })
      });
      const data = await response.json();
      if (data.refCode && !data.success) {
        setReference(data.refCode);
        setNotice(data.error || 'Your enquiry was saved, but the notification email needs attention. You can also email me directly.');
        setSubmitted(true);
        return;
      }
      if (!response.ok || !data.success) {
        setError(data.error || 'Your enquiry could not be sent. Please try again.');
        return;
      }
      setReference(data.refCode || 'ENQ-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      setNotice(data.warning || '');
      setSubmitted(true);
    } catch {
      setError('There was a connection problem. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#060608] text-[#ededed]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#060608]">
        <FiberNetwork />
        <div className="site-fiber-shade absolute inset-0" />
      </div>

      <header className="relative z-10 border-b border-white/[0.08] bg-[#060608]/75 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Christopher J. Callaghan home">
            <img src="/icon.svg" alt="" className="h-8 w-8 shrink-0" />
            <span className="truncate text-xs font-bold tracking-tight text-white sm:text-sm">Christopher J. Callaghan</span>
          </a>
          <a href="mailto:christopher@christopherjcallaghan.com" className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-white/10 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white/65 transition hover:border-white/25 hover:text-white sm:px-4">
            <Mail className="h-3.5 w-3.5" /><span className="hidden sm:inline">Prefer email?</span><span>Email me</span>
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative overflow-hidden px-4 pb-8 pt-10 text-center sm:px-6 sm:pb-11 sm:pt-14">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-56 w-[min(90vw,760px)] -translate-x-1/2 rounded-full bg-[#FF003C]/[0.12] blur-[100px]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 border border-[#FF003C]/30 bg-[#FF003C]/[0.08] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff8199] sm:text-[10px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF003C]" /> Project enquiries · Manchester & UK-wide
            </p>
            <h1 className="text-[2.65rem] font-black leading-[0.94] tracking-[-0.06em] text-white sm:text-5xl md:text-6xl">
              Let’s make your<br className="sm:hidden" /> next move<span className="text-[#FF003C]">.</span>
              <span className="mt-2 block text-white/60">Start with a conversation.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[13px] leading-6 text-white/65 sm:text-sm sm:leading-7">
              A new website, better search visibility, Google Maps, custom software or practical AI. Tell me what you need and what you want to achieve.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-white/50 sm:text-[11px]">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#ff5575]" /> Manchester, UK · Remote projects welcome</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#00DFC9]" /> No-obligation first conversation</span>
            </div>
          </div>
        </section>

        <section id="project-enquiry" className="scroll-mt-6 px-3 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto grid max-w-6xl items-start gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8">
            <aside className="order-2 flex min-w-0 flex-col gap-3 lg:order-1 lg:sticky lg:top-8">
              <div className="relative overflow-hidden border border-white/10 bg-[#0b0b10]/85 p-5 backdrop-blur-xl sm:p-6">
                <div aria-hidden="true" className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#ff003c]/10 blur-3xl" />
                <div className="relative flex h-10 w-10 items-center justify-center border border-[#FF003C]/30 bg-[#FF003C]/[0.09] text-[#ff718d]"><Sparkles className="h-4 w-4" /></div>
                <p className="relative mt-5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#00DFC9]">A good place to start</p>
                <h2 className="relative mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">You bring the challenge.<br />We’ll work out the route.</h2>
                <p className="relative mt-3 text-xs leading-6 text-white/55">You don’t need a finished brief or all the technical answers. A few honest details are enough to understand what you’re aiming for.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/10 bg-white/[0.035] p-4">
                  <Code2 className="h-4 w-4 text-[#00DFC9]" />
                  <p className="mt-3 text-[11px] font-bold text-white">Websites & software</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/45">From high-performing websites to bespoke platforms.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.035] p-4">
                  <Search className="h-4 w-4 text-[#ff718d]" />
                  <p className="mt-3 text-[11px] font-bold text-white">SEO & Google Maps</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/45">Organic search, local visibility and business profiles.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.035] p-4">
                  <Workflow className="h-4 w-4 text-[#ffb347]" />
                  <p className="mt-3 text-[11px] font-bold text-white">AI & automation</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/45">Connected tools and practical workflows.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.035] p-4">
                  <Globe2 className="h-4 w-4 text-[#8b9cff]" />
                  <p className="mt-3 text-[11px] font-bold text-white">Digital growth</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/45">Landing pages, campaigns and conversion journeys.</p>
                </div>
              </div>
              <div className="border-l-2 border-[#00DFC9]/60 bg-white/[0.025] px-4 py-3">
                <p className="text-[10px] font-semibold text-white/75">Direct, personal communication</p>
                <p className="mt-1 text-[10px] leading-5 text-white/40">You’ll speak directly with Christopher — not a sales team or call centre.</p>
              </div>
            </aside>

            <div className="order-1 min-w-0 border border-white/[0.13] bg-[#0b0b10]/95 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7 lg:order-2 lg:p-8">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center px-3 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"><CheckCircle2 className="h-7 w-7" /></div>
                  <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Enquiry received</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Thanks, {form.name}.</h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Your enquiry has been saved. I’ll follow up using the contact details you provided.</p>
                  <p className="mt-5 border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-white/65">Reference: <strong className="text-white">{reference}</strong></p>
                  {notice && <p className="mt-4 max-w-sm text-xs leading-5 text-amber-300">{notice}</p>}
                  <a href="/" className="mt-7 inline-flex min-h-11 items-center gap-2 border border-white/15 px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 transition hover:border-white/35 hover:text-white">Back to website <ArrowRight className="h-3.5 w-3.5" /></a>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#00DFC9]">01 / Tell me about it</p>
                      <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">What can I help you with?</h2>
                      <p className="mt-2 text-xs leading-5 text-white/45">Share as much or as little as you know. Fields marked * are required.</p>
                    </div>
                    <span className="hidden shrink-0 border border-white/10 px-2.5 py-1.5 font-mono text-[9px] text-white/40 sm:inline-flex">2 MIN</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <div role="alert" className="border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs leading-5 text-rose-200">{error}</div>}
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <label className={labelClass}>Your name *
                        <input className={fieldClass} autoComplete="name" required maxLength={120} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
                      </label>
                      <label className={labelClass}>Email address *
                        <input className={fieldClass} type="email" autoComplete="email" inputMode="email" required maxLength={254} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
                      </label>
                    </div>
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <label className={labelClass}>What do you need? *
                        <select className={fieldClass} required value={form.projectType} onChange={(e) => update('projectType', e.target.value)}>
                          <option value="" disabled className="bg-[#0b0b10]">Choose a service</option>
                          {PROJECT_TYPES.map((item) => <option key={item} value={item} className="bg-[#0b0b10]">{item}</option>)}
                        </select>
                      </label>
                      <label className={labelClass}>Budget range
                        <select className={fieldClass} value={form.budget} onChange={(e) => update('budget', e.target.value)}>
                          {BUDGETS.map((item) => <option key={item} value={item} className="bg-[#0b0b10]">{item}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <label className={labelClass}>Business / organisation <span className="normal-case tracking-normal text-white/30">(optional)</span>
                        <input className={fieldClass} autoComplete="organization" maxLength={160} value={form.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="Business name" />
                      </label>
                      <label className={labelClass}>Current website <span className="normal-case tracking-normal text-white/30">(optional)</span>
                        <input className={fieldClass} type="url" inputMode="url" autoComplete="url" maxLength={500} value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} placeholder="https://yourwebsite.co.uk" />
                      </label>
                    </div>
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <label className={labelClass}>When would you like to start?
                        <select className={fieldClass} value={form.timeline} onChange={(e) => update('timeline', e.target.value)}>
                          {TIMELINES.map((item) => <option key={item} value={item} className="bg-[#0b0b10]">{item}</option>)}
                        </select>
                      </label>
                      <label className={labelClass}>Phone number <span className="normal-case tracking-normal text-white/30">(optional)</span>
                        <input className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Your number" />
                      </label>
                    </div>
                    <label className={labelClass}>Tell me about the project *
                      <textarea className={fieldClass + ' min-h-36 resize-y py-3 leading-6'} required minLength={10} maxLength={5000} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="What are you trying to achieve? What isn't working today? Is there a deadline or something you want to improve?" />
                    </label>
                    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                      <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} /></label>
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 border border-white/10 bg-white/[0.025] p-3.5 text-[11px] leading-5 text-white/55">
                      <input type="checkbox" required checked={form.privacyAccepted} onChange={(e) => update('privacyAccepted', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff003c]" />
                      <span>I agree that my details can be used to respond to this enquiry. This form is for project enquiries only; it does not sign me up to marketing emails.</span>
                    </label>
                    <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xs text-[10px] leading-5 text-white/40"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#00DFC9]" /> Your information is only used to handle your enquiry.</p>
                      <button type="submit" disabled={submitting} className="brief-shine-button inline-flex min-h-[54px] w-full items-center justify-center gap-3 bg-[#FF003C] px-7 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_8px_30px_rgba(255,0,60,0.18)] transition hover:bg-[#ff315f] hover:shadow-[0_10px_38px_rgba(255,0,60,0.28)] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                        {submitting ? 'Sending enquiry…' : 'Send my enquiry'} <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/[0.08] px-4 py-6 text-center">
        <p className="text-[10px] leading-5 text-white/35">© {new Date().getFullYear()} Christopher J. Callaghan <span className="mx-2 text-white/15">·</span> <a href="/" className="transition hover:text-white">christopherjcallaghan.com</a></p>
      </footer>
    </div>
  );
}
