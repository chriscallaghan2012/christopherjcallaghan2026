'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, CheckCircle2, Clock3, Code2, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

const FiberNetwork = dynamic(() => import('./FiberNetwork').then((module) => module.FiberNetwork), { ssr: false, loading: () => null });

const PROJECT_TYPES = [
  'Website design & development',
  'Web application or SaaS',
  'Mobile app development',
  'AI integration & automation',
  'E-commerce',
  'SEO & Google visibility',
  'Google Ads & paid marketing',
  'Ongoing development support',
  'Something else'
];

const BUDGETS = ['Not sure yet', 'Under £1,000', '£1,000–£5,000', '£5,000–£10,000', '£10,000+'];
const TIMELINES = ['As soon as possible', 'Within 1 month', '1–3 months', '3+ months', 'Flexible'];

const fieldClass = 'mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] px-4 text-[15px] text-white outline-none transition placeholder:text-white/30 focus:border-[#FF003C]/70 focus:bg-white/[0.055]';
const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.17em] text-white/55';

export function EnquiryLanding() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', projectType: '', budget: 'Not sure yet', timeline: 'Flexible', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          projectType: form.projectType,
          packageScope: form.projectType,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message,
          type: 'contact'
        })
      });
      const data = await response.json();
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

      <header className="relative z-10 border-b border-white/[0.08] bg-[#060608]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5" aria-label="Christopher J. Callaghan home">
            <img src="/icon.svg" alt="" className="h-8 w-8 rounded-full" />
            <span className="text-xs font-bold tracking-tight text-white sm:text-sm">Christopher J. Callaghan</span>
          </a>
          <a href="mailto:christopher@christopherjcallaghan.com" className="inline-flex min-h-10 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 transition hover:text-white">
            <Mail className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Prefer email?</span> Get in touch
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative overflow-hidden px-4 pb-7 pt-10 text-center sm:px-6 sm:pb-10 sm:pt-14">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-56 w-[min(90vw,760px)] -translate-x-1/2 rounded-full bg-[#FF003C]/[0.10] blur-[100px]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 border border-[#FF003C]/25 bg-[#FF003C]/[0.07] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff718d] sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF003C]" /> Project enquiries
            </p>
            <h1 className="text-[2.45rem] font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-5xl md:text-6xl">
              Have something<br className="sm:hidden" /> in mind<span className="text-[#FF003C]">?</span>
              <span className="mt-1 block text-white/65">Let’s make it work.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-white/60 sm:mt-5 sm:text-sm sm:leading-7">
              Tell me what you’re looking to build, improve or figure out. A few details are all it takes to start the conversation.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-white/45 sm:text-[11px]">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#FF5575]" /> Manchester, UK · Working remotely</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#00DFC9]" /> No-obligation first conversation</span>
            </div>
          </div>
        </section>

        <section className="px-3 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
            <aside className="order-2 flex flex-col gap-3 lg:order-1">
              <div className="border border-white/10 bg-[#0b0b10]/80 p-5 backdrop-blur-xl sm:p-6">
                <div className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/25 bg-[#FF003C]/[0.08] text-[#ff5575]"><Sparkles className="h-4 w-4" /></div>
                <h2 className="mt-4 text-lg font-black tracking-tight text-white">Start with the idea.</h2>
                <p className="mt-2 text-xs leading-6 text-white/55">You don’t need a finished brief or all the technical answers. Explain the problem or opportunity in your own words.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <div className="border border-white/10 bg-white/[0.025] p-4">
                  <Code2 className="h-4 w-4 text-[#00DFC9]" />
                  <p className="mt-3 text-[11px] font-bold text-white">Websites, apps & software</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/45">From first build to complex platforms.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.025] p-4">
                  <Sparkles className="h-4 w-4 text-[#ff5575]" />
                  <p className="mt-3 text-[11px] font-bold text-white">AI & business systems</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/45">Integrations, automation and better workflows.</p>
                </div>
              </div>
              <p className="px-1 text-[10px] leading-5 text-white/35">Independent development and AI integration. Based in Manchester, working with businesses across the UK.</p>
            </aside>

            <div className="order-1 border border-white/[0.12] bg-[#0b0b10]/90 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-7 lg:order-2">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center px-3 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"><CheckCircle2 className="h-7 w-7" /></div>
                  <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Enquiry received</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Thanks, {form.name}.</h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Your message has been submitted. I’ll follow up using the email address you provided.</p>
                  <p className="mt-5 border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-white/65">Reference: <strong className="text-white">{reference}</strong></p>
                  {notice && <p className="mt-4 max-w-sm text-xs leading-5 text-amber-300">{notice}</p>}
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#00DFC9]">01 / Your project</p>
                      <h2 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">Tell me a little about it.</h2>
                      <p className="mt-1 text-xs text-white/45">Fields marked * are required.</p>
                    </div>
                    <span className="hidden border border-white/10 px-2.5 py-1 font-mono text-[9px] text-white/35 sm:inline">~2 MINUTES</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <div role="alert" className="border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">{error}</div>}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={labelClass}>Your name *
                        <input className={fieldClass} autoComplete="name" required maxLength={120} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
                      </label>
                      <label className={labelClass}>Email address *
                        <input className={fieldClass} type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={labelClass}>What do you need? *
                        <select className={fieldClass} required value={form.projectType} onChange={(e) => update('projectType', e.target.value)}>
                          <option value="" disabled className="bg-[#0b0b10]">Choose a project type</option>
                          {PROJECT_TYPES.map((item) => <option key={item} value={item} className="bg-[#0b0b10]">{item}</option>)}
                        </select>
                      </label>
                      <label className={labelClass}>Budget range
                        <select className={fieldClass} value={form.budget} onChange={(e) => update('budget', e.target.value)}>
                          {BUDGETS.map((item) => <option key={item} value={item} className="bg-[#0b0b10]">{item}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={labelClass}>When are you looking to start?
                        <select className={fieldClass} value={form.timeline} onChange={(e) => update('timeline', e.target.value)}>
                          {TIMELINES.map((item) => <option key={item} value={item} className="bg-[#0b0b10]">{item}</option>)}
                        </select>
                      </label>
                      <label className={labelClass}>Phone number <span className="normal-case tracking-normal text-white/30">(optional)</span>
                        <input className={fieldClass} type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Your number" />
                      </label>
                    </div>
                    <label className={labelClass}>Tell me about the project *
                      <textarea className={`${fieldClass} min-h-32 resize-y py-3 leading-6`} required minLength={10} maxLength={5000} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="What are you trying to achieve? What’s the challenge, idea or opportunity?" />
                    </label>
                    <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xs text-[10px] leading-5 text-white/40"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#00DFC9]" /> Your details are used to respond to this enquiry.</p>
                      <button type="submit" disabled={submitting} className="brief-shine-button inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#FF003C] px-6 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff315f] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
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
      <footer className="relative z-10 border-t border-white/[0.08] px-4 py-5 text-center">
        <p className="text-[10px] text-white/35">© {new Date().getFullYear()} Christopher J. Callaghan <span className="mx-2 text-white/15">·</span> <a href="/" className="transition hover:text-white">christopherjcallaghan.com</a></p>
      </footer>
    </div>
  );
}
