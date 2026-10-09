'use client';

import { Fragment, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, CreditCard, Laptop, LoaderCircle, ShieldCheck, ShoppingCart, Sparkles, X } from 'lucide-react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ACADEMY_URL } from '@/lib/academy';
import { WEBSITE_BOOTCAMP_PRICE, WEBSITE_CLASS_OFFERS, WEBSITE_CLASS_PRICE, type WebsiteClassOfferId } from '@/lib/websiteClassOffer';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

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
  const [isCheckingCustomer, setIsCheckingCustomer] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [cartOfferId, setCartOfferId] = useState<WebsiteClassOfferId | null>(null);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [accountMode, setAccountMode] = useState<'register' | 'login'>('register');
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [message, setMessage] = useState<{ kind: 'success' | 'info' | 'error'; text: string } | null>(null);
  const cartOffer = cartOfferId ? WEBSITE_CLASS_OFFERS[cartOfferId] : null;

  useEffect(() => {
    const checkoutStatus = new URLSearchParams(window.location.search).get('checkout');
    if (checkoutStatus === 'success') {
      setMessage({ kind: 'success', text: 'Checkout is complete. Your purchase will appear in your account once Stripe confirms the payment.' });
    } else if (checkoutStatus === 'cancelled') {
      setMessage({ kind: 'info', text: 'Checkout was cancelled. Nothing has been charged.' });
    }

  }, []);

  useEffect(() => {
    fetch('/api/customer/session', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json() as { authenticated?: boolean; customer?: { name: string; email: string }; error?: string };
        if (!response.ok) throw new Error(result.error || 'Could not check your account.');
        if (result.authenticated && result.customer) setCustomer(result.customer);
      })
      .catch((error) => {
        setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Could not check your account.' });
      })
      .finally(() => setIsCheckingCustomer(false));
  }, []);

  const selectOffer = (offerId: WebsiteClassOfferId) => {
    setCartOfferId(offerId);
    setCheckoutClientSecret(null);
    setMessage(null);
  };

  const startCheckout = async (offerId: WebsiteClassOfferId) => {
    if (!stripePromise) {
      setMessage({ kind: 'error', text: 'Online checkout needs the Stripe publishable key. Please contact me to book while checkout is being configured.' });
      return;
    }

    setIsCheckingOut(true);
    setMessage(null);

    try {
      if (!customer) {
        setIsAuthenticating(true);
        const accountResponse = await fetch(`/api/customer/${accountMode === 'register' ? 'register' : 'login'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountMode === 'register'
            ? { name: accountName, email: accountEmail, password: accountPassword }
            : { email: accountEmail, password: accountPassword })
        });
        const accountResult = await accountResponse.json() as {
          customer?: { name: string; email: string };
          error?: string
        };
        if (!accountResponse.ok || !accountResult.customer) {
          throw new Error(accountResult.error || 'Could not create your account or sign in.');
        }
        setCustomer(accountResult.customer);
        setAccountPassword('');
        setIsAuthenticating(false);
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId })
      });
      const result = await response.json() as { clientSecret?: string; error?: string };
      if (!response.ok || !result.clientSecret) throw new Error(result.error || 'Checkout could not be started.');
      setCheckoutClientSecret(result.clientSecret);
      setIsCheckingOut(false);
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Checkout could not be started. Please try again.' });
      setIsAuthenticating(false);
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
      <section aria-labelledby="academy-classes-banner-title" className="border-b border-white/10 bg-[#0b0b0e]/80 px-5 py-6 md:px-8 md:py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#00DFC9]">A separate way to learn</p>
            <h2 id="academy-classes-banner-title" className="mt-1 text-xl font-black text-white">AI Builder Academy</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">Alongside the one-to-one classes below, the Academy offers live 60-minute practical classes to help you use modern AI tools to turn an idea into a website, app or MVP. No traditional coding background needed.</p>
          </div>
          <a href={ACADEMY_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#FF003C] px-4 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">EXPLORE THE ACADEMY <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
      </section>

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
          <ol className="website-flow-grid mt-10 grid items-stretch gap-x-3 gap-y-2 xl:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1fr)_36px_minmax(0,1fr)] xl:gap-3">
            {[
              ['01', 'Shape the idea', 'Use AI to clarify your audience, offer and what the site needs to do.'],
              ['02', 'Design with AI', 'Explore visual directions, page layouts and starter content using online tools.'],
              ['03', 'Make a prototype', 'Turn the design into a clickable preview and test the journey before building.'],
              ['04', 'Build an MVP', 'Create the essential pages and learn how Stripe payments can fit your project.'],
              ['05', 'Launch and own it', 'Connect a domain, understand deployment and keep your site files and code.']
            ].map(([number, title, detail], index) => (
              <Fragment key={number}>
                <li className="website-flow-step min-w-0 border-t-2 border-[#FF003C]/60 bg-white/[0.025] px-4 py-4 sm:px-5 sm:py-5" style={{ animationDelay: `${index * 110}ms` }}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00DFC9]">STEP {number}</p>
                  <h3 className="mt-3 text-base font-bold leading-snug text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{detail}</p>
                </li>
                {index < 4 && <li aria-hidden="true" className="flex items-center justify-center gap-0 py-1 text-[#FF003C] xl:py-0">
                  <span className="flow-dash-y website-flow-y" />
                  <span className="flow-dash-x website-flow-x w-full" />
                  <ArrowDown className="h-4 w-4 shrink-0 xl:hidden" />
                  <ArrowRight className="hidden h-4 w-4 shrink-0 xl:block" />
                </li>}
              </Fragment>
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

          <div className="mt-10 grid gap-12 border-y border-white/15 py-8 xl:grid-cols-[0.8fr_1.2fr] xl:gap-14 xl:py-10">
            <article className="flex flex-col border-l-2 border-[#FF003C] pl-6">
              <div className="flex items-center gap-3"><Laptop className="h-5 w-5 text-[#FF5575]" /><h3 className="text-lg font-bold text-white">Flexible 60-minute session</h3></div>
              <p className="mt-4 text-sm leading-relaxed text-white/60">You choose what we work on. Use the full hour for any website-related topic: shaping your idea, exploring AI tools, improving a design, making a prototype, building a feature, fixing a problem, or getting guidance on payments and domains.</p>
              <div className="mt-5 flex items-center gap-5 text-xs text-white/45"><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#FF5575]" />One-to-one online</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#FF5575]" />Beginner friendly</span></div>
              <div className="mt-auto pt-8">
                <p className="text-4xl font-black text-white">{WEBSITE_CLASS_PRICE}</p>
                <button onClick={() => selectOffer('session')} aria-pressed={cartOfferId === 'session'} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-white px-5 text-xs font-black tracking-[0.1em] text-black transition-colors hover:bg-[#FF5575] hover:text-white">
                  {cartOfferId === 'session' ? <><Check className="h-4 w-4" /> ADDED TO CART</> : <><ShoppingCart className="h-4 w-4" /> ADD SESSION TO CART</>}
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
              <button onClick={() => selectOffer('bootcamp')} aria-pressed={cartOfferId === 'bootcamp'} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">
                {cartOfferId === 'bootcamp' ? <><Check className="h-4 w-4" /> ADDED TO CART</> : <><ShoppingCart className="h-4 w-4" /> ADD BOOTCAMP TO CART</>}
              </button>
            </article>
          </div>

          <aside id="class-checkout" aria-label="Your cart and checkout" className="mt-8 border border-white/15 bg-black/35 p-5 sm:p-7">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-[#FF5575]"><ShoppingCart className="h-4 w-4" /><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Your cart</p></div>
                {cartOffer ? (
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div><h3 className="text-base font-bold text-white">{cartOffer.name}</h3><p className="mt-1 text-sm text-white/50">{cartOffer.duration} · one-time payment</p></div>
                    <button onClick={() => { setCartOfferId(null); setCheckoutClientSecret(null); setMessage(null); }} aria-label="Remove item from cart" className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#FF5575] hover:text-white"><X className="h-4 w-4" /></button>
                  </div>
                ) : <p className="mt-3 text-sm text-white/50">Choose a session or bootcamp above to add it here.</p>}
              </div>
              <div className="min-w-52 border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <div className="flex items-baseline justify-between gap-8"><span className="text-sm text-white/55">Total</span><span className="text-2xl font-black text-white">{cartOfferId === 'bootcamp' ? WEBSITE_BOOTCAMP_PRICE : cartOfferId === 'session' ? WEBSITE_CLASS_PRICE : '—'}</span></div>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00DFC9]">Customer account</p>
                  <p className="mt-1 text-sm text-white/60">Your purchase history is saved to your account.</p>
                </div>
                {customer && <a href="/account" className="text-xs font-bold text-white underline underline-offset-4 hover:text-[#00DFC9]">View account</a>}
              </div>
              {customer ? (
                <p className="mt-4 text-sm text-white/80">Signed in as <strong>{customer.email}</strong></p>
              ) : (
                <>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => { setAccountMode('register'); setMessage(null); }} aria-pressed={accountMode === 'register'} className={`border px-3 py-2 text-xs font-bold ${accountMode === 'register' ? 'border-[#00DFC9] text-[#00DFC9]' : 'border-white/15 text-white/55'}`}>CREATE ACCOUNT</button>
                    <button type="button" onClick={() => { setAccountMode('login'); setMessage(null); }} aria-pressed={accountMode === 'login'} className={`border px-3 py-2 text-xs font-bold ${accountMode === 'login' ? 'border-[#00DFC9] text-[#00DFC9]' : 'border-white/15 text-white/55'}`}>SIGN IN</button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {accountMode === 'register' && <label className="text-xs text-white/60">Name<input autoComplete="name" maxLength={100} value={accountName} onChange={(event) => setAccountName(event.target.value)} className="mt-1 min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#00DFC9]" /></label>}
                    <label className="text-xs text-white/60">Email<input type="email" autoComplete="email" maxLength={254} value={accountEmail} onChange={(event) => setAccountEmail(event.target.value)} className="mt-1 min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#00DFC9]" /></label>
                    <label className="text-xs text-white/60">Password<input type="password" autoComplete={accountMode === 'register' ? 'new-password' : 'current-password'} minLength={accountMode === 'register' ? 12 : undefined} maxLength={128} value={accountPassword} onChange={(event) => setAccountPassword(event.target.value)} className="mt-1 min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#00DFC9]" />{accountMode === 'register' && <span className="mt-1 block text-[11px] text-white/40">Use at least 12 characters.</span>}</label>
                  </div>
                </>
              )}
            </div>
            {message && <div role={message.kind === 'error' ? 'alert' : 'status'} className={`mt-5 border px-4 py-3 text-sm ${statusStyle}`}><p>{message.text}</p>{message.kind === 'success' && <a href="/account" className="mt-2 inline-flex items-center gap-2 font-bold underline underline-offset-4">View your account <ArrowRight className="h-4 w-4" /></a>}</div>}
            {checkoutClientSecret && stripePromise && <div className="mt-6 border-t border-white/10 pt-6"><p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Secure payment</p><EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: checkoutClientSecret }}><div className="min-h-[420px]"><EmbeddedCheckout /></div></EmbeddedCheckoutProvider></div>}
            {!checkoutClientSecret && <button onClick={() => cartOfferId && startCheckout(cartOfferId)} disabled={!cartOfferId || isCheckingOut || isCheckingCustomer} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035] disabled:cursor-not-allowed disabled:opacity-40">
              {isCheckingCustomer || isAuthenticating ? <><LoaderCircle className="h-4 w-4 animate-spin" /> {isAuthenticating ? 'SETTING UP ACCOUNT' : 'CHECKING ACCOUNT'}</> : isCheckingOut ? <><LoaderCircle className="h-4 w-4 animate-spin" /> CONNECTING TO STRIPE</> : customer ? <>SECURE CHECKOUT <ArrowRight className="h-4 w-4" /></> : accountMode === 'register' ? <>CREATE ACCOUNT & CONTINUE <ArrowRight className="h-4 w-4" /></> : <>SIGN IN & CONTINUE <ArrowRight className="h-4 w-4" /></>}
            </button>}
            <p className="mt-4 text-xs leading-relaxed text-white/40">Stripe securely processes payment. Domain, hosting and optional AI/design tools are separate costs. You keep the accounts, project files and code.</p>
          </aside>

          <p className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-white/40"><CreditCard className="h-4 w-4 shrink-0" />Domain, hosting and optional AI/design tools are separate costs. Payment processing fees are charged by Stripe. We’ll use accounts in your name so you stay in control. A full MVP can take more than one session; we’ll agree a realistic next step together.</p>
          <p className="mt-3 text-xs text-white/40">After checkout, contact me to arrange your one-to-one session or plan the six programme dates.</p>
        </div>
      </section>

    </div>
  );
}