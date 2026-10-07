'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Code2, CreditCard, Laptop, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { WEBSITE_BOOTCAMP_PRICE, WEBSITE_CLASS_OFFERS, WEBSITE_CLASS_PRICE, type WebsiteClassOfferId } from '@/lib/websiteClassOffer';

const bootcampSessions = [
  { title: 'Your idea and website plan', detail: 'Clarify your audience, goals and offer. Use AI to turn your idea into a clear website brief.' },
  { title: 'AI-assisted design', detail: 'Explore visual directions, page structure and content with beginner-friendly online tools.' },
  { title: 'Clickable prototype', detail: 'Turn the design into a prototype and walk through the customer journey before building.' },
  { title: 'Build the MVP', detail: 'Create the essential responsive pages and understand how the pieces of your site fit together.' },
  { title: 'Payments and domain', detail: 'Learn how Stripe checkout works and connect a domain you own to your website.' },
  { title: 'Test, launch and own it', detail: 'Check the experience, plan deployment and leave with your project files and code under your control.' }
];

export function OnlineClassesPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'info' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const checkoutStatus = new URLSearchParams(window.location.search).get('checkout');
    if (checkoutStatus === 'success') {
      setMessage({ kind: 'success', text: 'Payment complete. Contact me to arrange a time for your online class.' });
    } else if (checkoutStatus === 'cancelled') {
      setMessage({ kind: 'info', text: 'Checkout was cancelled. Nothing has been charged.' });
    }

  }, []);

  const startCheckout = async (offerId: WebsiteClassOfferId) => {
    setIsCheckingOut(true);
    setMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId })
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || 'Checkout could not be started.');
      window.location.assign(result.url);
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Checkout could not be started. Please try again.' });
      setIsCheckingOut(false);
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
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,60,0.14),transparent_65%)]" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Live one-to-one website classes</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.06] text-white sm:text-5xl lg:text-6xl">Your website idea,<br /><span className="text-[#FF5575]">built together.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">Use online AI and design tools to turn your idea into a prototype, then learn how to shape it into an MVP with payments, a domain and code you own. No coding experience needed to start.</p>
          <a href="#website-package" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#FF003C] px-5 text-xs font-black tracking-[0.12em] text-white transition-colors hover:bg-[#df0035]">SEE THE CLASS <ArrowDown className="h-4 w-4 class-arrow-down" /></a>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-white/55">
            <span>One-to-one online</span><span>No coding needed</span><span>Your project stays yours</span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0b0e]/90 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">From first thought to live site</p>
            <h2 className="mt-3 text-3xl font-black text-white">A clear path, built around you</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Go from a clear brief to an AI-assisted design, a clickable prototype and a practical first version. Ask questions and learn by making your own project.</p>
          </div>
          <ol className="mt-10 grid gap-x-6 gap-y-7 xl:grid-cols-5">
            {[
              ['01', 'Shape the idea', 'Use AI to clarify your audience, offer and what the site needs to do.'],
              ['02', 'Design with AI', 'Explore visual directions, page layouts and starter content using online tools.'],
              ['03', 'Make a prototype', 'Turn the design into a clickable preview and test the journey before building.'],
              ['04', 'Build an MVP', 'Create the essential pages and learn how Stripe payments can fit your project.'],
              ['05', 'Launch and own it', 'Connect a domain, understand deployment and keep your site files and code.']
            ].map(([number, title, detail], index) => (
              <li key={number} className="website-flow-step relative border-t border-white/15 pt-4" style={{ animationDelay: `${index * 110}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FF5575]">STEP {number}</span>
                  {index < 4 && <ArrowRight aria-hidden="true" className="website-flow-arrow h-4 w-4 rotate-90 text-[#FF5575] xl:rotate-0" />}
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
            <h2 className="mt-3 text-3xl font-black text-white">No coding experience? You can still build.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">You don’t need a finished plan, a design background or technical vocabulary. We’ll use guided online tools and AI together. You’ll learn what each tool is doing, make the decisions and build confidence as your idea takes shape.</p>
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {[
              ['AI as your design partner', 'Learn to prompt AI for ideas, page structure, visual directions and first drafts.'],
              ['Prototype before building', 'Use browser-based design tools to make a preview and get the user journey right.'],
              ['Code is explained, not assumed', 'AI can help create code; I’ll explain it in plain English and show you how to work with it.'],
              ['You stay in control', 'Use accounts you own, connect your domain and keep your project files and code.']
            ].map(([title, detail]) => <div key={title} className="border-t border-white/10 pt-4"><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/55">{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section id="website-package" className="scroll-mt-20 border-t border-white/10 bg-[#0b0b0e]/90 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Choose your learning format</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Start with one hour or go all the way to MVP</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">Both options are live, one-to-one and designed for beginners. Bring your own website idea and work directly on it.</p>
          </div>

          {message && <div role={message.kind === 'error' ? 'alert' : 'status'} className={`mt-8 border px-4 py-3 text-sm ${statusStyle}`}><p>{message.text}</p>{message.kind === 'success' && <a href="/contact" className="mt-2 inline-flex items-center gap-2 font-bold underline underline-offset-4">Arrange your class <ArrowRight className="h-4 w-4" /></a>}</div>}

          <div className="mt-10 grid gap-12 border-y border-white/15 py-8 xl:grid-cols-[0.8fr_1.2fr] xl:gap-14 xl:py-10">
            <article className="flex flex-col border-l-2 border-[#FF003C] pl-6">
              <div className="flex items-center gap-3"><Laptop className="h-5 w-5 text-[#FF5575]" /><h3 className="text-lg font-bold text-white">Flexible 60-minute session</h3></div>
              <p className="mt-4 text-sm leading-relaxed text-white/60">You choose what we work on. Use the full hour for any website-related topic: shaping your idea, exploring AI tools, improving a design, making a prototype, building a feature, fixing a problem, or getting guidance on payments and domains.</p>
              <div className="mt-5 flex items-center gap-5 text-xs text-white/45"><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#FF5575]" />One-to-one online</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#FF5575]" />Beginner friendly</span></div>
              <div className="mt-auto pt-8">
                <p className="text-4xl font-black text-white">{WEBSITE_CLASS_PRICE}</p>
                <button onClick={() => startCheckout('session')} disabled={isCheckingOut} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-white px-5 text-xs font-black tracking-[0.1em] text-black transition-colors hover:bg-[#FF5575] hover:text-white disabled:cursor-wait disabled:opacity-60">
                  {isCheckingOut ? <><LoaderCircle className="h-4 w-4 animate-spin" /> OPENING CHECKOUT</> : <>BOOK A FLEXIBLE SESSION <ArrowRight className="h-4 w-4" /></>}
                </button>
                <a href="/contact" className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/25 px-5 text-center text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-[#FF5575] hover:text-[#FF5575]">ASK ABOUT A SESSION <ArrowRight className="h-4 w-4" /></a>
              </div>
            </article>

            <article className="border-t border-white/15 pt-8 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div><div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-[#FF5575]" /><h3 className="text-lg font-bold text-white">Website to MVP bootcamp</h3></div><p className="mt-2 text-sm text-white/55">Six one-hour sessions. Learn by building your own project.</p></div>
                <p className="text-4xl font-black text-white">{WEBSITE_BOOTCAMP_PRICE}</p>
              </div>
              <ol className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {bootcampSessions.map((session, index) => <li key={session.title} className="website-flow-step border-t border-white/10 pt-3" style={{ animationDelay: `${index * 90}ms` }}><span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF5575]">Session {index + 1} · 60 minutes</span><h4 className="mt-2 text-sm font-bold text-white">{session.title}</h4><p className="mt-1 text-xs leading-relaxed text-white/55">{session.detail}</p></li>)}
              </ol>
              <button onClick={() => startCheckout('bootcamp')} disabled={isCheckingOut} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035] disabled:cursor-wait disabled:opacity-60">
                {isCheckingOut ? <><LoaderCircle className="h-4 w-4 animate-spin" /> OPENING CHECKOUT</> : <>BOOK THE SIX-SESSION BOOTCAMP <ArrowRight className="h-4 w-4" /></>}
              </button>
            </article>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-white/40"><CreditCard className="h-4 w-4 shrink-0" />Domain, hosting and optional AI/design tools are separate costs. Payment processing fees are charged by Stripe. We’ll use accounts in your name so you stay in control. A full MVP can take more than one session; we’ll agree a realistic next step together.</p>
          <p className="mt-3 text-xs text-white/40">After checkout, contact me to arrange your session or plan the six bootcamp dates.</p>
        </div>
      </section>
    </div>
  );
}