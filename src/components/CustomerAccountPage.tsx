'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, LoaderCircle, LogOut } from 'lucide-react';

interface Customer {
  name: string;
  email: string;
}

interface Purchase {
  id: string;
  offerName: string;
  amount: number;
  currency: string;
  status: 'paid';
  createdAt: string;
}

export function CustomerAccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/customer/session', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json() as { authenticated?: boolean; customer?: Customer; error?: string };
        if (!response.ok) throw new Error(result.error || 'Could not load your account.');
        if (result.authenticated && result.customer) {
          setCustomer(result.customer);
          const purchaseResponse = await fetch('/api/customer/purchases', { cache: 'no-store' });
          const purchaseResult = await purchaseResponse.json() as { purchases?: Purchase[]; error?: string };
          if (!purchaseResponse.ok) throw new Error(purchaseResult.error || 'Could not load your purchases.');
          setPurchases(purchaseResult.purchases ?? []);
        }
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load your account.'))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async () => {
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json() as { customer?: Customer; error?: string };
      if (!response.ok || !result.customer) throw new Error(result.error || 'Could not sign in.');

      setCustomer(result.customer);
      setPassword('');
      const purchaseResponse = await fetch('/api/customer/purchases', { cache: 'no-store' });
      const purchaseResult = await purchaseResponse.json() as { purchases?: Purchase[]; error?: string };
      if (!purchaseResponse.ok) throw new Error(purchaseResult.error || 'Could not load your purchases.');
      setPurchases(purchaseResult.purchases ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/customer/logout', { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not sign out. Please try again.');
      setCustomer(null);
      setPurchases([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not sign out.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060608] px-5 py-12 text-white sm:py-20">
      <div className="mx-auto max-w-3xl">
        <a href="/classes" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4" /> Online classes</a>
        <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#00DFC9]">Customer account</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{customer ? `Welcome, ${customer.name}` : 'Your purchases'}</h1>

        {isLoading ? (
          <p className="mt-8 flex items-center gap-2 text-sm text-white/80"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading your account…</p>
        ) : customer ? (
          <section className="mt-8 border border-white/15 bg-white/[0.03] p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div><p className="text-sm text-white/80">Signed in as</p><p className="mt-1 font-bold">{customer.email}</p></div>
              <button onClick={signOut} disabled={isSubmitting} className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-xs font-bold text-white/75 hover:border-[#FF5575] hover:text-white disabled:opacity-50"><LogOut className="h-4 w-4" /> Sign out</button>
            </div>
            <h2 className="mt-6 text-xl font-bold">Purchase history</h2>
            {purchases.length ? (
              <ul className="mt-4 divide-y divide-white/10">
                {purchases.map((purchase) => (
                  <li key={purchase.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div><p className="font-semibold">{purchase.offerName}</p><p className="mt-1 text-xs text-white/75">{new Date(purchase.createdAt).toLocaleDateString('en-GB')} · Payment confirmed</p></div>
                    <p className="font-bold">{new Intl.NumberFormat('en-GB', { style: 'currency', currency: purchase.currency.toUpperCase() }).format(purchase.amount / 100)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/80">No completed purchases yet. Your paid one-to-one classes and six-session MVP bootcamp will appear here.</p>
                <a href="/classes#website-package" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#00DFC9]">Explore classes <ArrowRight className="h-4 w-4" /></a>
              </div>
            )}
          </section>
        ) : (
          <section className="mt-8 max-w-lg border border-white/15 bg-white/[0.03] p-5 sm:p-7">
            <p className="text-sm leading-relaxed text-white/80">Sign in with the email and password you created at checkout. New customers can add a class on the <a href="/classes#website-package" className="font-bold text-[#8affef] underline underline-offset-4">classes page</a>, then create their account during checkout.</p>
            <div className="mt-6 grid gap-4">
              <label className="text-sm text-white/85">Email<input type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 min-h-11 w-full border border-white/25 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#00DFC9]" /></label>
              <label className="text-sm text-white/85">Password<input type="password" autoComplete="current-password" maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !isSubmitting) void signIn(); }} className="mt-1 min-h-11 w-full border border-white/25 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#00DFC9]" /></label>
              <button onClick={signIn} disabled={isSubmitting || !email || !password} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white hover:bg-[#df0035] disabled:cursor-not-allowed disabled:opacity-40">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null} SIGN IN</button>
            </div>
          </section>
        )}

        {message && <p role="alert" className="mt-5 border border-[#FF003C]/40 bg-[#FF003C]/10 px-4 py-3 text-sm text-white">{message}</p>}
      </div>
    </main>
  );
}
