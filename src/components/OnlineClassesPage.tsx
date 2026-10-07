'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Code2, CreditCard, Laptop, LoaderCircle, ShieldCheck } from 'lucide-react';
import { WEBSITE_CLASS_OFFER, WEBSITE_CLASS_PRICE } from '@/lib/websiteClassOffer';

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

  const startCheckout = async () => {
    setIsCheckingOut(true);
    setMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
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
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">Get personal online guidance to plan, design and build a site you understand and own. You can start with no coding or design experience.</p>
          <a href="#website-package" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#FF003C] px-5 text-xs font-black tracking-[0.12em] text-white transition-colors hover:bg-[#df0035]">SEE THE PACKAGE <ArrowDown className="h-4 w-4" /></a>
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
            <p className="mt-4 text-sm leading-relaxed text-white/55">We’ll focus on what your project actually needs, not a generic course syllabus. Move at your pace and ask questions at every step.</p>
          </div>
          <ol className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Start with the idea', 'Who is your site for? What should visitors be able to do?'],
              ['02', 'Plan the pages', 'Organise your content, key messages and next steps for visitors.'],
              ['03', 'Design and build', 'Choose an approach that fits, then create the site together.'],
              ['04', 'Test and launch', 'Test what we build together and map the remaining steps to launch.']
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

      <section id="website-package" className="scroll-mt-20 border-t border-white/10 bg-[#0b0b0e]/90 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">One package · one clear next step</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Build your website together</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">A focused 60-minute session to move your real website idea forward, with a developer beside you and a clear next step to take away.</p>
          </div>

          {message && <div role={message.kind === 'error' ? 'alert' : 'status'} className={`mt-8 border px-4 py-3 text-sm ${statusStyle}`}><p>{message.text}</p>{message.kind === 'success' && <a href="/contact" className="mt-2 inline-flex items-center gap-2 font-bold underline underline-offset-4">Arrange your class <ArrowRight className="h-4 w-4" /></a>}</div>}

          <div className="mt-10 grid gap-10 border-y border-white/15 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-16 md:py-10">
            <div>
              <div className="flex items-center gap-3"><Laptop className="h-5 w-5 text-[#FF5575]" /><h3 className="text-lg font-bold text-white">Your one-to-one build session</h3></div>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  '60 minutes of live, one-to-one online guidance',
                  'Plan your pages, content and design together',
                  'Build a useful first version together',
                  'Leave with clear next steps for launch and updates'
                ].map((detail) => <li key={detail} className="flex gap-2 text-sm leading-relaxed text-white/65"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5575]" />{detail}</li>)}
              </ul>
              <div className="mt-7 flex flex-wrap gap-5 border-t border-white/10 pt-5 text-xs text-white/45">
                <span className="flex items-center gap-2"><Code2 className="h-4 w-4 text-[#FF5575]" />Beginner friendly</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#FF5575]" />You keep the project</span>
              </div>
            </div>

            <div className="min-w-60 border-l-2 border-[#FF003C] pl-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">{WEBSITE_CLASS_OFFER.duration} · one-time payment</p>
              <p className="mt-2 text-5xl font-black text-white">{WEBSITE_CLASS_PRICE}</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/45">Secure checkout powered by Stripe. Your payment is for the live session.</p>
              <div className="mt-6 grid gap-3">
                <button onClick={startCheckout} disabled={isCheckingOut} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035] disabled:cursor-wait disabled:opacity-60">
                  {isCheckingOut ? <><LoaderCircle className="h-4 w-4 animate-spin" /> OPENING CHECKOUT</> : <>BOOK YOUR SESSION <ArrowRight className="h-4 w-4" /></>}
                </button>
                <a href="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-white/25 px-5 text-center text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-[#FF5575] hover:text-[#FF5575]">ASK ABOUT A SESSION <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-white/40"><CreditCard className="h-4 w-4 shrink-0" />Domain, hosting and optional third-party tools are separate costs. We’ll set up accounts in your name so you stay in control. Larger projects may need more than one session; we’ll agree next steps together.</p>
          <p className="mt-3 text-xs text-white/40">After checkout, contact me to arrange your session time.</p>
        </div>
      </section>
    </div>
  );
}