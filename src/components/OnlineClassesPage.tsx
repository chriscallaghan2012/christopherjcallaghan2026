'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Laptop, ShieldCheck, ShoppingCart, Sparkles, X } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { ACADEMY_URL } from '@/lib/academy';
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
  const [cartOfferId, setCartOfferId] = useState<WebsiteClassOfferId | null>(null);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const continueButtonRef = useRef<HTMLAnchorElement>(null);

  const selectOffer = (offerId: WebsiteClassOfferId) => {
    setCartOfferId(offerId);
    setShowCartDialog(true);
  };

  const closeCartDialog = () => setShowCartDialog(false);

  useEffect(() => {
    if (!showCartDialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    continueButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCartDialog();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCartDialog]);

  return (
    <div className="overflow-hidden">
      <section aria-labelledby="academy-classes-banner-title" className="border-b border-white/10 bg-[#0b0b0e]/80 px-5 py-6 md:px-8 md:py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#00DFC9]">A separate way to learn</p>
            <h2 id="academy-classes-banner-title" className="mt-1 text-xl font-black text-white">AI Builder Academy</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Alongside the one-to-one classes below, the Academy offers live 60-minute practical classes to help you use modern AI tools to turn an idea into a website, app or MVP. No traditional coding background needed.</p>
          </div>
          <a href={ACADEMY_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#FF003C] px-4 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">EXPLORE THE ACADEMY <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
      </section>

      <section className="relative border-b border-white/10 px-5 py-16 md:px-8 md:py-24">
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,60,0.14),transparent_65%)]" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Live one-to-one website classes</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.06] text-white sm:text-5xl lg:text-6xl">Your website idea,<br /><span className="text-[#FF5575]">built together.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">Use online AI and design tools to turn your idea into a prototype, then learn how to shape it into an MVP with payments, a domain and code you own. No coding experience needed to start.</p>
          <a href="#website-package" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#FF003C] px-5 text-xs font-black tracking-[0.12em] text-white transition-colors hover:bg-[#df0035]">SEE THE CLASS <ArrowDown className="h-4 w-4 class-arrow-down" /></a>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-white/75">
            <span>One-to-one online</span><span>No coding needed</span><span>Your project stays yours</span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0b0e]/90 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">From first thought to live site</p>
            <h2 className="mt-3 text-3xl font-black text-white">A clear path, built around you</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">Go from a clear brief to an AI-assisted design, a clickable prototype and a practical first version. Ask questions and learn by making your own project.</p>
          </div>
          <MotionConfig reducedMotion="user">
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
            className="website-flow-grid mt-10 grid items-stretch gap-x-3 gap-y-2 xl:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1fr)] xl:gap-3"
          >
            {[
              ['01', 'Shape the idea', 'Use AI to clarify your audience, offer and what the site needs to do.'],
              ['02', 'Design with AI', 'Explore visual directions, page layouts and starter content using online tools.'],
              ['03', 'Make a prototype', 'Turn the design into a clickable preview and test the journey before building.'],
              ['04', 'Build an MVP', 'Create the essential pages and learn how Stripe payments can fit your project.'],
              ['05', 'Launch and own it', 'Connect a domain, understand deployment and keep your site files and code.']
            ].map(([number, title, detail], index) => (
              <Fragment key={number}>
                <motion.li variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="min-w-0 border-t-2 border-[#FF003C]/60 bg-white/[0.025] px-4 py-4 transition-colors hover:border-[#FF003C] hover:bg-white/[0.045] sm:px-5 sm:py-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00DFC9]">STEP {number}</p>
                  <h3 className="mt-3 text-base font-bold leading-snug text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{detail}</p>
                </motion.li>
                {index < 4 && <li aria-hidden="true" className="flex items-center justify-center gap-0 py-1 text-[#FF003C] xl:py-0">
                  <span className="flow-dash-y website-flow-y" />
                  <span className="flow-dash-x website-flow-x w-full" />
                  <ArrowDown className="h-4 w-4 shrink-0 xl:hidden" />
                  <ArrowRight className="hidden h-4 w-4 shrink-0 xl:block" />
                </li>}
              </Fragment>
            ))}
          </motion.ol>
          </MotionConfig>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Start from zero</p>
            <h2 className="mt-3 text-3xl font-black text-white">No coding experience? You can still build.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">You don’t need a finished plan, a design background or technical vocabulary. We’ll use guided online tools and AI together. You’ll learn what each tool is doing, make the decisions and build confidence as your idea takes shape.</p>
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {[
              ['AI as your design partner', 'Learn to prompt AI for ideas, page structure, visual directions and first drafts.'],
              ['Prototype before building', 'Use browser-based design tools to make a preview and get the user journey right.'],
              ['Code is explained, not assumed', 'AI can help create code; I’ll explain it in plain English and show you how to work with it.'],
              ['You stay in control', 'Use accounts you own, connect your domain and keep your project files and code.']
            ].map(([title, detail]) => <div key={title} className="border-t border-white/10 pt-4"><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/75">{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section id="website-package" className="scroll-mt-20 border-t border-white/10 bg-[#0b0b0e]/90 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Choose your learning format</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Start with one hour or go all the way to MVP</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">Both options are live, one-to-one and designed for beginners. Bring your own website idea and work directly on it.</p>
          </div>

          <div className="mt-10 grid gap-12 border-y border-white/15 py-8 xl:grid-cols-[0.8fr_1.2fr] xl:gap-14 xl:py-10">
            <article className="flex flex-col border-l-2 border-[#FF003C] pl-6">
              <div className="flex items-center gap-3"><Laptop className="h-5 w-5 text-[#FF5575]" /><h3 className="text-lg font-bold text-white">Flexible 60-minute session</h3></div>
              <p className="mt-4 text-sm leading-relaxed text-white/75">You choose what we work on. Use the full hour for any website-related topic: shaping your idea, exploring AI tools, improving a design, making a prototype, building a feature, fixing a problem, or getting guidance on payments and domains.</p>
              <div className="mt-5 flex items-center gap-5 text-xs text-white/75"><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#FF5575]" />One-to-one online</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#FF5575]" />Beginner friendly</span></div>
              <div className="mt-auto pt-8">
                <p className="text-4xl font-black text-white">{WEBSITE_CLASS_PRICE}</p>
                <button onClick={() => cartOfferId === 'session' ? setShowCartDialog(true) : selectOffer('session')} aria-pressed={cartOfferId === 'session'} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">
                  {cartOfferId === 'session' ? <><Check className="h-4 w-4" /> ADDED TO CART</> : <><ShoppingCart className="h-4 w-4" /> ADD SESSION TO CART</>}
                </button>
                <a href="/contact" className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/25 px-5 text-center text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-[#FF5575] hover:text-[#FF5575]">ASK ABOUT A SESSION <ArrowRight className="h-4 w-4" /></a>
              </div>
            </article>

            <article className="border-t border-white/15 pt-8 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div><div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-[#FF5575]" /><h3 className="text-lg font-bold text-white">Website to MVP bootcamp</h3></div><p className="mt-2 text-sm text-white/75">Six one-hour sessions. Learn by building your own project.</p></div>
                <p className="text-4xl font-black text-white">{WEBSITE_BOOTCAMP_PRICE}</p>
              </div>
              <MotionConfig reducedMotion="user">
                <motion.ol
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                  className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2"
                >
                  {bootcampSessions.map((session, index) => <motion.li key={session.title} variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="border-t border-white/10 pt-3"><span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF5575]">Session {index + 1} · 60 minutes</span><h4 className="mt-2 text-sm font-bold text-white">{session.title}</h4><p className="mt-1 text-xs leading-relaxed text-white/75">{session.detail}</p></motion.li>)}
                </motion.ol>
              </MotionConfig>
              <button onClick={() => cartOfferId === 'bootcamp' ? setShowCartDialog(true) : selectOffer('bootcamp')} aria-pressed={cartOfferId === 'bootcamp'} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">
                {cartOfferId === 'bootcamp' ? <><Check className="h-4 w-4" /> ADDED TO CART</> : <><ShoppingCart className="h-4 w-4" /> ADD BOOTCAMP TO CART</>}
              </button>
            </article>
          </div>

          <p className="mt-7 text-sm leading-relaxed text-white/70">Add an option to your cart to review it before creating your account and paying on the secure checkout page.</p>
        </div>
      </section>

      {showCartDialog && cartOfferId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCartDialog(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="cart-dialog-title" className="relative w-full max-w-md border border-white/15 bg-[#101014] p-6 text-white shadow-2xl sm:p-8">
            <button type="button" onClick={closeCartDialog} aria-label="Close cart confirmation" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white"><X className="h-5 w-5" /></button>
            <div className="flex h-12 w-12 items-center justify-center border border-emerald-300/40 bg-emerald-300/10 text-emerald-200"><Check className="h-5 w-5" /></div>
            <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#00DFC9]">Added to your cart</p>
            <h2 id="cart-dialog-title" className="mt-2 pr-10 text-2xl font-black text-white">Ready for the next step?</h2>
            <div className="mt-6 flex items-start justify-between gap-5 border-y border-white/15 py-5">
              <div><p className="font-bold text-white">{WEBSITE_CLASS_OFFERS[cartOfferId].name}</p><p className="mt-1 text-sm text-white/75">{WEBSITE_CLASS_OFFERS[cartOfferId].duration} · one-time payment</p></div>
              <p className="shrink-0 text-xl font-black text-white">{cartOfferId === 'bootcamp' ? WEBSITE_BOOTCAMP_PRICE : WEBSITE_CLASS_PRICE}</p>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/75">Continue to the secure checkout page to create your account and complete payment.</p>
            <a ref={continueButtonRef} href={`/checkout?offer=${cartOfferId}`} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">CONTINUE TO CHECKOUT <ArrowRight className="h-4 w-4" /></a>
            <button type="button" onClick={closeCartDialog} className="mt-4 min-h-10 w-full text-sm font-semibold text-white/80 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white">Keep browsing classes</button>
          </section>
        </div>
      )}
    </div>
  );
}