'use client';

import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, ArrowRight, Check, CreditCard, LoaderCircle, LockKeyhole, ShieldCheck, ShoppingBag } from 'lucide-react';
import {
  WEBSITE_BOOTCAMP_PRICE,
  WEBSITE_CLASS_OFFERS,
  WEBSITE_CLASS_PRICE,
  type WebsiteClassOfferId
} from '@/lib/websiteClassOffer';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface Customer {
  name: string;
  email: string;
}

export function ClassCheckoutPage() {
  const [offerId, setOfferId] = useState<WebsiteClassOfferId | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accountMode, setAccountMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedOffer = params.get('offer');
    if (selectedOffer === 'session' || selectedOffer === 'bootcamp') setOfferId(selectedOffer);

    const checkoutStatus = params.get('checkout');
    if (checkoutStatus === 'success') {
      setIsCheckoutComplete(true);
    } else if (checkoutStatus === 'cancelled') {
      setStatus({ kind: 'info', text: 'Checkout was cancelled. Nothing has been charged.' });
    }

    fetch('/api/customer/session', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json() as { authenticated?: boolean; customer?: Customer; error?: string };
        if (!response.ok) throw new Error(result.error || 'Could not check your account.');
        if (result.authenticated && result.customer) {
          setCustomer(result.customer);
          setEmail(result.customer.email);
          setName(result.customer.name);
        }
      })
      .catch((error) => {
        setStatus({ kind: 'error', text: error instanceof Error ? error.message : 'Could not check your account.' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const continueToPayment = async () => {
    if (!offerId) return;
    if (!stripePromise) {
      setStatus({ kind: 'error', text: 'Checkout is not ready yet. Please contact me to book.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    try {
      if (!customer) {
        const accountResponse = await fetch(`/api/customer/${accountMode === 'register' ? 'register' : 'login'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountMode === 'register' ? { name, email, password } : { email, password })
        });
        const accountResult = await accountResponse.json() as { customer?: Customer; error?: string };
        if (!accountResponse.ok || !accountResult.customer) {
          throw new Error(accountResult.error || 'Could not create your account or sign in.');
        }
        setCustomer(accountResult.customer);
        setPassword('');
      }

      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId })
      });
      const checkoutResult = await checkoutResponse.json() as { clientSecret?: string; error?: string };
      if (!checkoutResponse.ok || !checkoutResult.clientSecret) {
        throw new Error(checkoutResult.error || 'Checkout could not be started.');
      }
      setClientSecret(checkoutResult.clientSecret);
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof Error ? error.message : 'Checkout could not be started. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const offer = offerId ? WEBSITE_CLASS_OFFERS[offerId] : null;
  const price = offerId === 'bootcamp' ? WEBSITE_BOOTCAMP_PRICE : offerId === 'session' ? WEBSITE_CLASS_PRICE : '';
  const statusStyle = status?.kind === 'success'
    ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100'
    : status?.kind === 'error'
      ? 'border-[#FF5575]/50 bg-[#FF5575]/10 text-white'
      : 'border-white/20 bg-white/[0.05] text-white';

  return (
    <main className="min-h-screen bg-[#060608] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <a href="/classes#website-package" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to classes</a>
          <a href="/account" className="text-sm font-semibold text-white/80 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white">My account</a>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:gap-12">
          <section aria-labelledby="checkout-title">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#00DFC9]">Secure checkout</p>
            <h1 id="checkout-title" className="mt-3 text-4xl font-black text-white sm:text-5xl">Complete your booking</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">Create your account or sign in, then complete payment below. Your account and secure Stripe payment stay together on this page.</p>

            {status && !isCheckoutComplete && <div role={status.kind === 'error' ? 'alert' : 'status'} className={`mt-6 border px-4 py-3 text-sm leading-relaxed ${statusStyle}`}>{status.text}{status.kind === 'success' && <a href="/account" className="ml-1 font-bold underline underline-offset-4">View your account</a>}</div>}

            {!offer && (
              <div className="mt-8 border border-white/20 bg-white/[0.04] p-6">
                <p className="font-bold text-white">Your cart is empty.</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">Choose a one-to-one session or MVP bootcamp to continue.</p>
                <a href="/classes#website-package" className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#FF003C] px-4 text-xs font-black tracking-[0.08em] text-white hover:bg-[#df0035]">CHOOSE A CLASS <ArrowRight className="h-4 w-4" /></a>
              </div>
            )}

            {offer && isLoading && <p className="mt-8 flex items-center gap-2 text-sm text-white/75"><LoaderCircle className="h-4 w-4 animate-spin" /> Checking your account…</p>}

            {offer && isCheckoutComplete && (
              <section className="mt-8 border border-emerald-300/30 bg-emerald-300/[0.06] p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center border border-emerald-300/40 bg-emerald-300/10 text-emerald-200"><Check className="h-6 w-6" /></div>
                <h2 className="mt-5 text-2xl font-black text-white">Thanks for your booking.</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/80">Stripe has returned you to checkout. Your purchase will show in your account once the payment confirmation arrives.</p>
                <a href="/account" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white hover:bg-[#df0035]">GO TO YOUR ACCOUNT <ArrowRight className="h-4 w-4" /></a>
              </section>
            )}

            {offer && !isLoading && !isCheckoutComplete && (
              <section className="mt-8 border border-white/20 bg-[#0d0d11] p-5 sm:p-7">
                <form onSubmit={(event) => { event.preventDefault(); void continueToPayment(); }}>
                {customer ? (
                  <div className="flex items-start gap-3 border-b border-white/15 pb-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-300/40 bg-emerald-300/10 text-emerald-200"><Check className="h-5 w-5" /></span>
                    <div><h2 className="font-bold text-white">Account ready</h2><p className="mt-1 text-sm text-white/75">Signed in as {customer.email}. Complete your payment below to add this purchase to your account.</p></div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white">Your account</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">Use your account to sign in later and view your purchases.</p>
                    <div className="mt-5 flex gap-2">
                      <button type="button" onClick={() => { setAccountMode('register'); setStatus(null); }} aria-pressed={accountMode === 'register'} className={`min-h-10 border px-3 text-xs font-bold transition-colors ${accountMode === 'register' ? 'border-[#FF003C]/80 text-white' : 'border-white/25 text-white/80 hover:text-white'}`}>CREATE ACCOUNT</button>
                      <button type="button" onClick={() => { setAccountMode('login'); setStatus(null); }} aria-pressed={accountMode === 'login'} className={`min-h-10 border px-3 text-xs font-bold transition-colors ${accountMode === 'login' ? 'border-[#FF003C]/80 text-white' : 'border-white/25 text-white/80 hover:text-white'}`}>SIGN IN</button>
                    </div>
                    <div className="mt-5 grid gap-4">
                      {accountMode === 'register' && <label className="text-sm font-medium text-white/85">Name<span className="premium-input-wrap mt-2"><input required autoComplete="name" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="premium-input min-h-12 w-full px-3 text-base text-white placeholder:text-white/75" /></span></label>}
                      <label className="text-sm font-medium text-white/85">Email<span className="premium-input-wrap mt-2"><input required type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="premium-input min-h-12 w-full px-3 text-base text-white placeholder:text-white/75" /></span></label>
                      <label className="text-sm font-medium text-white/85">Password<span className="premium-input-wrap mt-2"><input required type="password" autoComplete={accountMode === 'register' ? 'new-password' : 'current-password'} minLength={accountMode === 'register' ? 12 : 1} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="premium-input min-h-12 w-full px-3 text-base text-white placeholder:text-white/75" /></span>{accountMode === 'register' && <span className="mt-2 block text-xs text-white/75">At least 12 characters.</span>}</label>
                    </div>
                  </>
                )}

                {!clientSecret && (
                  <button type="submit" disabled={isSubmitting || (accountMode === 'register' && !customer && (!name.trim() || !email.trim() || password.length < 12)) || (accountMode === 'login' && !customer && (!email.trim() || !password))} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#FF003C] px-5 py-3 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035] disabled:cursor-not-allowed disabled:opacity-45">
                    {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> PREPARING SECURE PAYMENT</> : <>{customer ? 'CONTINUE TO PAYMENT' : accountMode === 'register' ? 'CREATE ACCOUNT & CONTINUE' : 'SIGN IN & CONTINUE'} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                )}
                </form>
              </section>
            )}

            {clientSecret && stripePromise && !isCheckoutComplete && (
              <section className="mt-8 border border-white/20 bg-[#0d0d11] p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-3 border-b border-white/15 pb-5">
                  <span className="flex h-10 w-10 items-center justify-center border border-[#00DFC9]/40 bg-[#00DFC9]/10 text-[#8affef]"><LockKeyhole className="h-5 w-5" /></span>
                  <div><h2 className="font-bold text-white">Payment details</h2><p className="mt-1 text-sm text-white/75">Securely processed by Stripe</p></div>
                </div>
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                  <div className="min-h-[420px]"><EmbeddedCheckout /></div>
                </EmbeddedCheckoutProvider>
              </section>
            )}

            <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-white/75"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00DFC9]" />Your password is securely hashed, and card details are entered directly into Stripe’s secure checkout.</p>
          </section>

          <aside aria-label="Order summary" className="h-fit border border-white/20 bg-[#0d0d11] p-5 sm:p-7 lg:sticky lg:top-8">
            <div className="flex items-center gap-3 border-b border-white/15 pb-5">
              <span className="flex h-10 w-10 items-center justify-center border border-[#FF5575]/40 bg-[#FF5575]/10 text-[#ff9bac]"><ShoppingBag className="h-5 w-5" /></span>
              <div><h2 className="font-bold text-white">Order summary</h2><p className="mt-1 text-sm text-white/75">Review your selected class</p></div>
            </div>
            {offer ? (
              <>
                <div className="py-6">
                  <p className="text-lg font-bold leading-snug text-white">{offer.name}</p>
                  <p className="mt-2 text-sm text-white/75">{offer.duration} · one-time payment</p>
                  {offerId === 'bootcamp' && <p className="mt-4 border-l-2 border-[#FF5575] pl-3 text-sm leading-relaxed text-white/75">Six one-to-one sessions to plan, prototype, build and launch your MVP.</p>}
                </div>
                <div className="flex items-center justify-between border-t border-white/15 pt-5">
                  <span className="text-sm font-semibold text-white/85">Total today</span>
                  <span className="text-3xl font-black text-white">{price}</span>
                </div>
              </>
            ) : (
              <p className="py-6 text-sm leading-relaxed text-white/75">No class selected.</p>
            )}
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="flex items-center gap-2 text-sm font-bold text-white"><CreditCard className="h-4 w-4 text-[#00DFC9]" /> Payment security</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">Payments are handled by Stripe. You’ll receive purchase access through your account after payment confirmation.</p>
            </div>
            <a href="/classes#website-package" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" /> Change your selection</a>
          </aside>
        </div>
      </div>
    </main>
  );
}
