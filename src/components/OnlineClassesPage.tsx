'use client';

import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Check, Code2, CreditCard, Laptop, Lightbulb, LoaderCircle, ShieldCheck, Video } from 'lucide-react';

const classOptions = [
  {
    id: 'one_to_one',
    number: '01',
    title: '1:1 website session',
    description: 'Bring one idea, decision or problem. We’ll work through it together in a focused live online lesson.',
    details: ['Choose the right platform and domain', 'Plan your pages and content', 'Work through design or setup questions'],
    icon: Video
  },
  {
    id: 'build_together',
    number: '02',
    title: 'Build your website together',
    description: 'Get guided support from the first plan through the build, testing and launch of your website.',
    details: ['Shape the idea and page structure', 'Design and build at your own pace', 'Test, publish and understand what comes next'],
    icon: Laptop
  }
] as const;

type ProductId = (typeof classOptions)[number]['id'];

export function OnlineClassesPage() {
  const [loadingProduct, setLoadingProduct] = useState<ProductId | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'info' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const checkoutStatus = new URLSearchParams(window.location.search).get('checkout');
    if (checkoutStatus === 'success') {
      setMessage({ kind: 'success', text: 'Payment complete. Contact me to arrange a time for your online class.' });
    } else if (checkoutStatus === 'cancelled') {
      setMessage({ kind: 'info', text: 'Checkout was cancelled. Nothing has been charged.' });
    }
  }, []);

  const startCheckout = async (product: ProductId) => {
    setLoadingProduct(product);
    setMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || 'Checkout could not be started.');
      window.location.assign(result.url);
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Checkout could not be started. Please try again.' });
      setLoadingProduct(null);
    }
  };

  const statusStyle = message?.kind === 'success'
    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
    : message?.kind === 'error'
      ? 'border-[#FF003C]/50 bg-[#FF003C]/10 text-white'
      : 'border-white/20 bg-white/[0.04] text-white/80';

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-white/10 px-5 py-16 md:px-8 md:py-24">
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,60,0.16),transparent_65%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Live, one-to-one, online</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.06] text-white sm:text-5xl lg:text-6xl">Learn to build your website.<br /><span className="text-[#FF5575]">Make it yours.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">No coding experience needed. We’ll plan, design and build together in plain English, with practical guidance shaped around your idea.</p>
            <a href="#class-options" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#FF003C] px-5 text-xs font-black tracking-[0.12em] text-white transition-colors hover:bg-[#df0035]">EXPLORE CLASS OPTIONS <ArrowDownRight className="h-4 w-4" /></a>
          </div>
          <div className="border-l-2 border-[#FF003C] py-2 pl-6">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">The point of every class</p>
            <p className="mt-3 text-xl font-bold leading-snug text-white">You leave knowing what we built, how it works and how to keep moving.</p>
            <p className="mt-3 text-sm leading-relaxed text-white/55">Your project is set up in accounts you control. Your website, content and design work stay yours.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b0b0e]/90 px-5 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          <div className="flex gap-3"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5575]" /><div><h2 className="text-sm font-bold text-white">Start with your idea</h2><p className="mt-1 text-sm leading-relaxed text-white/55">Bring a rough thought. We’ll turn it into clear next steps.</p></div></div>
          <div className="flex gap-3"><Code2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5575]" /><div><h2 className="text-sm font-bold text-white">No coding assumed</h2><p className="mt-1 text-sm leading-relaxed text-white/55">No programming, design software or technical vocabulary needed to begin.</p></div></div>
          <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5575]" /><div><h2 className="text-sm font-bold text-white">Keep control</h2><p className="mt-1 text-sm leading-relaxed text-white/55">Your logins, domain and project remain under your control.</p></div></div>
        </div>
      </section>

      <section id="class-options" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Choose where to begin</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">A real project. Built together.</h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-white/55">Both options are live online and tailored to you. The total is shown in Stripe before you confirm payment.</p>
          </div>

          {message && <div role={message.kind === 'error' ? 'alert' : 'status'} className={`mb-6 border px-4 py-3 text-sm ${statusStyle}`}><p>{message.text}</p>{message.kind === 'success' && <a href="/contact" className="mt-2 inline-flex items-center gap-2 font-bold underline underline-offset-4">Arrange your class <ArrowRight className="h-4 w-4" /></a>}</div>}

          <div className="divide-y divide-white/10 border-y border-white/10">
            {classOptions.map(({ id, number, title, description, details, icon: Icon }) => (
              <article key={id} className="grid gap-6 py-8 md:grid-cols-[64px_1fr_auto] md:items-start md:gap-8 md:py-10">
                <span className="font-mono text-sm text-[#FF5575]">{number}</span>
                <div>
                  <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-[#FF5575]" /><h3 className="text-xl font-bold text-white">{title}</h3></div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{description}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                    {details.map((detail) => <li key={detail} className="flex gap-2 text-xs leading-relaxed text-white/65"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF5575]" />{detail}</li>)}
                  </ul>
                </div>
                <button onClick={() => startCheckout(id)} disabled={loadingProduct !== null} className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-5 text-xs font-black tracking-[0.1em] text-black transition-colors hover:bg-[#FF5575] hover:text-white disabled:cursor-wait disabled:opacity-60 md:self-center">
                  {loadingProduct === id ? <><LoaderCircle className="h-4 w-4 animate-spin" /> OPENING CHECKOUT</> : <>CONTINUE TO CHECKOUT <ArrowRight className="h-4 w-4" /></>}
                </button>
              </article>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-white/40"><CreditCard className="h-4 w-4 shrink-0" />One-time payment through Stripe. Third-party platform, domain and hosting fees are separate and remain your choice.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0b0e]/90 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">From first thought to live site</p>
            <h2 className="mt-3 text-3xl font-black text-white">A clear path, built around you</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">We’ll focus on what your project actually needs, not a generic course syllabus. Move at your pace and ask questions at every step.</p>
          </div>
          <ol className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Start with the idea', 'Who is your site for? What should visitors be able to do?'],
              ['02', 'Plan the pages', 'Organise your content, key messages and next steps for visitors.'],
              ['03', 'Design and build', 'Choose an approach that fits, then create the site together.'],
              ['04', 'Test and launch', 'Check mobile layouts, publish when ready and learn how to update it.']
            ].map(([number, title, detail], index) => (
              <li key={number} className="relative border-t border-white/15 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FF5575]">STEP {number}</span>
                  {index < 3 && <ArrowRight aria-hidden="true" className="hidden h-4 w-4 text-white/30 lg:block" />}
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Start from zero</p>
            <h2 className="mt-3 text-3xl font-black text-white">You don’t need to know how to code.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">You don’t need to arrive with a finished plan, a design background or the right technical words. Bring your idea and we’ll work out the next step together.</p>
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {[
              ['No programming experience', 'We can use beginner-friendly tools where they fit your project.'],
              ['No design software required', 'We’ll shape the look and layout together, one decision at a time.'],
              ['Questions are part of it', 'I’ll explain unfamiliar terms and show you what each choice means.'],
              ['Custom features explained', 'If your idea needs code, I’ll explain what it does and guide you through it.']
            ].map(([title, detail]) => <div key={title} className="border-t border-white/10 pt-4"><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/55">{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-l-2 border-[#FF003C] py-1 pl-5 sm:flex-row sm:items-center sm:justify-between sm:pl-7">
          <div><h2 className="text-xl font-bold text-white">Not sure which class fits?</h2><p className="mt-1 text-sm text-white/55">Tell me what you’re hoping to make and we’ll work out a good starting point.</p></div>
          <a href="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-white/25 px-4 text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-[#FF5575] hover:text-[#FF5575]">ASK A QUESTION <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </div>
  );
}