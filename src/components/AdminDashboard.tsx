'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpenText, Check, FileText, Inbox, LoaderCircle, RefreshCw, ShoppingBag, Trash2, UserRoundPlus } from 'lucide-react';
import type { AdminSubmission } from '../../lib/database';
import type { AdminCustomerAccount, AdminCustomerPurchase } from '../../lib/customerAccounts';

type DashboardTab = 'overview' | 'purchases' | 'signups' | 'submissions' | 'blog';

interface DashboardData {
  accounts: AdminCustomerAccount[];
  purchases: AdminCustomerPurchase[];
  submissions: AdminSubmission[];
}

interface AdminDashboardProps {
  blogContent: React.ReactNode;
  postCount: number;
  onLogout: () => void;
}

const tabs: { id: DashboardTab; label: string; icon: typeof Inbox }[] = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
  { id: 'signups', label: 'Sign-ups', icon: UserRoundPlus },
  { id: 'submissions', label: 'Submissions', icon: Inbox },
  { id: 'blog', label: 'Blog', icon: BookOpenText }
];

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const formatCurrency = (amount: number, currency: string) => {
  const code = currency.toUpperCase();
  const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: code });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits;
  return formatter.format(amount / 10 ** fractionDigits);
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ blogContent, postCount, onLogout }) => {
  const [tab, setTab] = useState<DashboardTab>('overview');
  const [data, setData] = useState<DashboardData>({ accounts: [], purchases: [], submissions: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadDashboard = async () => {
    setError('');
    try {
      const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load dashboard data.');
      setData(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const updateSubmission = async (submission: AdminSubmission, status: 'pending' | 'reviewed') => {
    setIsWorking(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/control-center/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submission.id, kind: submission.kind, status })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update submission.');
      setData((current) => ({
        ...current,
        submissions: current.submissions.map((item) => item.id === submission.id && item.kind === submission.kind ? { ...item, status } : item)
      }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update submission.');
    } finally {
      setIsWorking(false);
    }
  };

  const deleteSubmission = async (submission: AdminSubmission) => {
    if (!window.confirm(`Delete the submission from ${submission.name}? This cannot be undone.`)) return;
    setIsWorking(true);
    setError('');
    setNotice('');
    try {
      const parameters = new URLSearchParams({ id: submission.id, kind: submission.kind });
      const response = await fetch(`/api/admin/control-center/submissions?${parameters}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete submission.');
      setData((current) => ({
        ...current,
        submissions: current.submissions.filter((item) => item.id !== submission.id || item.kind !== submission.kind)
      }));
      setNotice('Submission deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete submission.');
    } finally {
      setIsWorking(false);
    }
  };

  const pendingCount = data.submissions.filter((submission) => submission.status === 'pending').length;
  const revenueByCurrency = data.purchases.reduce<Record<string, number>>((totals, purchase) => {
    const currency = purchase.currency.toUpperCase();
    totals[currency] = (totals[currency] ?? 0) + purchase.amount;
    return totals;
  }, {});

  const metricCards = [
    { label: 'Purchases', value: data.purchases.length, detail: 'Paid orders recorded', icon: ShoppingBag, color: 'text-[#FF5575]' },
    { label: 'Sign-ups', value: data.accounts.length, detail: 'Customer accounts created', icon: UserRoundPlus, color: 'text-[#00DFC9]' },
    { label: 'Submissions', value: data.submissions.length, detail: `${pendingCount} awaiting review`, icon: Inbox, color: 'text-[#FFB347]' },
    { label: 'Blog posts', value: postCount, detail: 'Drafts and published articles', icon: BookOpenText, color: 'text-[#DF80FF]' }
  ];

  const submissionList = (items: AdminSubmission[]) => <div className="divide-y divide-white/10 border-y border-white/10">
    {items.map((submission) => (
      <article key={`${submission.kind}-${submission.id}`} className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-white">{submission.name}</h3>
            <span className={`font-mono text-[9px] uppercase tracking-widest ${submission.status === 'reviewed' ? 'text-[#00DFC9]' : 'text-[#FFB347]'}`}>{submission.status}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">{submission.kind === 'consultation' ? 'Project brief' : 'Contact'}</span>
          </div>
          <a href={`mailto:${submission.email}`} className="mt-1 inline-block break-all text-sm text-white/60 hover:text-[#00DFC9]">{submission.email}</a>
          <p className="mt-2 text-sm text-white/80">{submission.subject || 'No subject provided'}</p>
          <p className="mt-1 text-xs text-white/45">{submission.budget || 'Budget not specified'} · {submission.timeline || 'Flexible'} · {formatDate(submission.createdAt)}</p>
          {submission.message && <details className="mt-3">
            <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-widest text-white/45 hover:text-white">Read submitted details</summary>
            <p className="mt-2 whitespace-pre-wrap border-l border-white/15 pl-3 text-sm leading-relaxed text-white/65">{submission.message}</p>
          </details>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => updateSubmission(submission, submission.status === 'reviewed' ? 'pending' : 'reviewed')} disabled={isWorking} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 font-mono text-[9px] font-bold tracking-widest text-white/70 hover:text-white disabled:opacity-50">
            <Check className="h-3.5 w-3.5" />{submission.status === 'reviewed' ? 'REOPEN' : 'MARK REVIEWED'}
          </button>
          <button onClick={() => deleteSubmission(submission)} disabled={isWorking} aria-label={`Delete submission from ${submission.name}`} className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/45 hover:border-[#FF6F91]/50 hover:text-[#FF6F91] disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      </article>
    ))}
    {!items.length && <p className="py-8 text-sm text-white/45">No submissions yet.</p>}
  </div>;

  const purchaseRows = (items: AdminCustomerPurchase[]) => <div className="overflow-x-auto border-y border-white/10">
    <table className="w-full min-w-[680px] text-left">
      <thead><tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/45"><th className="py-3 pr-4 font-medium">Customer</th><th className="py-3 pr-4 font-medium">Purchase</th><th className="py-3 pr-4 font-medium">Status</th><th className="py-3 pr-4 font-medium">Date</th><th className="py-3 text-right font-medium">Total</th></tr></thead>
      <tbody className="divide-y divide-white/[0.07]">
        {items.map((purchase) => <tr key={purchase.id}>
          <td className="py-4 pr-4"><span className="block text-sm font-semibold text-white">{purchase.customerName}</span><a href={`mailto:${purchase.customerEmail}`} className="mt-1 block text-xs text-white/50 hover:text-white">{purchase.customerEmail}</a></td>
          <td className="py-4 pr-4 text-sm text-white/75">{purchase.offerName}</td>
          <td className="py-4 pr-4"><span className="font-mono text-[9px] uppercase tracking-widest text-[#00DFC9]">{purchase.status}</span></td>
          <td className="py-4 pr-4 text-xs text-white/50">{formatDate(purchase.createdAt)}</td>
          <td className="py-4 text-right text-sm font-bold text-white">{formatCurrency(purchase.amount, purchase.currency)}</td>
        </tr>)}
        {!items.length && <tr><td colSpan={5} className="py-8 text-sm text-white/45">No purchases recorded yet.</td></tr>}
      </tbody>
    </table>
  </div>;

  return <main className="mx-auto min-h-[75svh] max-w-7xl px-5 py-8 md:px-8 md:py-12">
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">Private / business desk</p>
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">Admin dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => { setIsLoading(true); void loadDashboard(); }} disabled={isLoading} className="inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 font-mono text-[9px] font-bold tracking-widest text-white/70 hover:text-white disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH</button>
        <button onClick={onLogout} className="min-h-10 border border-white/15 px-4 font-mono text-[9px] font-bold tracking-widest text-white/70 hover:border-[#FF003C]/50 hover:text-white">SIGN OUT</button>
      </div>
    </div>

    <nav className="scrollbar-none mt-5 flex gap-1 overflow-x-auto border-b border-white/10" aria-label="Admin sections">
      {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setTab(id); setError(''); setNotice(''); }} aria-current={tab === id ? 'page' : undefined} className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-3 font-mono text-[10px] font-bold tracking-[0.1em] transition-colors ${tab === id ? 'border-[#FF003C] text-white' : 'border-transparent text-white/45 hover:text-white/80'}`}>
        <Icon className="h-3.5 w-3.5" />{label}{id === 'submissions' && pendingCount > 0 && <span className="ml-1 flex h-5 min-w-5 items-center justify-center bg-[#FF003C]/15 px-1 text-[9px] text-[#FF5575]">{pendingCount}</span>}
      </button>)}
    </nav>

    {error && <p role="alert" className="mt-5 border border-[#FF6F91]/30 bg-[#FF6F91]/[0.05] px-4 py-3 text-sm text-[#FF9BAC]">{error}</p>}
    {notice && <p role="status" className="mt-5 border border-[#00DFC9]/25 bg-[#00DFC9]/[0.04] px-4 py-3 text-sm text-[#8CF1E5]">{notice}</p>}
    {isLoading ? <div className="flex min-h-56 items-center gap-3 text-sm text-white/55"><LoaderCircle className="h-4 w-4 animate-spin" />Loading dashboard…</div> : <>
      {tab === 'overview' && <section className="mt-7" aria-labelledby="overview-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><h2 id="overview-title" className="text-xl font-bold text-white">At a glance</h2><p className="mt-1 text-sm text-white/50">Purchases, customers, incoming enquiries and publishing.</p></div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/35">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date())}</span>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(({ label, value, detail, icon: Icon, color }) => <div key={label} className="border border-white/10 bg-white/[0.025] p-4">
            <dt className="flex items-center justify-between gap-3 font-mono text-[9px] font-bold uppercase tracking-widest text-white/50"><span>{label}</span><Icon className={`h-4 w-4 ${color}`} /></dt>
            <dd className="mt-5 text-3xl font-black leading-none text-white">{isLoading ? '—' : value}</dd>
            <p className="mt-2 text-xs text-white/45">{detail}</p>
          </div>)}
        </dl>

        <div className="mt-8 grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
          <section>
            <div className="mb-3 flex items-baseline justify-between gap-3"><h3 className="text-sm font-bold text-white">Latest submissions</h3><button onClick={() => setTab('submissions')} className="inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-widest text-white/50 hover:text-white">ALL SUBMISSIONS <ArrowRight className="h-3 w-3" /></button></div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {data.submissions.slice(0, 5).map((submission) => <button key={`${submission.kind}-${submission.id}`} onClick={() => setTab('submissions')} className="flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left hover:bg-white/[0.02]">
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{submission.name}</span><span className="mt-1 block truncate text-xs text-white/50">{submission.subject || submission.email}</span></span>
                <span className="shrink-0 text-right"><span className={`block font-mono text-[9px] uppercase tracking-widest ${submission.status === 'pending' ? 'text-[#FFB347]' : 'text-white/40'}`}>{submission.status}</span><span className="mt-1 block text-[10px] text-white/40">{formatDate(submission.createdAt)}</span></span>
              </button>)}
              {!data.submissions.length && <p className="py-6 text-sm text-white/45">No submissions yet.</p>}
            </div>
          </section>
          <section>
            <div className="mb-3 flex items-baseline justify-between gap-3"><h3 className="text-sm font-bold text-white">Latest purchases</h3><button onClick={() => setTab('purchases')} className="inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-widest text-white/50 hover:text-white">ALL PURCHASES <ArrowRight className="h-3 w-3" /></button></div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {data.purchases.slice(0, 5).map((purchase) => <div key={purchase.id} className="flex min-h-16 items-center justify-between gap-4 py-3">
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{purchase.customerName}</span><span className="mt-1 block truncate text-xs text-white/50">{purchase.offerName} · {formatDate(purchase.createdAt)}</span></span>
                <span className="shrink-0 text-sm font-bold text-white">{formatCurrency(purchase.amount, purchase.currency)}</span>
              </div>)}
              {!data.purchases.length && <p className="py-6 text-sm text-white/45">No purchases yet.</p>}
            </div>
          </section>
        </div>
      </section>}

      {tab === 'purchases' && <section className="mt-7" aria-labelledby="purchases-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-widest text-[#FF5575]">Payments</p><h2 id="purchases-title" className="mt-1 text-xl font-bold text-white">All purchases</h2></div><span className="font-mono text-[10px] text-white/45">{data.purchases.length} PAID</span></div>
        {purchaseRows(data.purchases)}
      </section>}

      {tab === 'signups' && <section className="mt-7" aria-labelledby="signups-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-widest text-[#00DFC9]">Customers</p><h2 id="signups-title" className="mt-1 text-xl font-bold text-white">All sign-ups</h2></div><span className="font-mono text-[10px] text-white/45">{data.accounts.length} ACCOUNTS</span></div>
        <div className="overflow-x-auto border-y border-white/10">
          <table className="w-full min-w-[560px] text-left">
            <thead><tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/45"><th className="py-3 pr-4 font-medium">Name</th><th className="py-3 pr-4 font-medium">Email</th><th className="py-3 text-right font-medium">Signed up</th></tr></thead>
            <tbody className="divide-y divide-white/[0.07]">
              {data.accounts.map((account) => <tr key={account.id}><td className="py-4 pr-4 text-sm font-semibold text-white">{account.name}</td><td className="py-4 pr-4"><a href={`mailto:${account.email}`} className="text-sm text-white/60 hover:text-white">{account.email}</a></td><td className="py-4 text-right text-xs text-white/50">{formatDate(account.createdAt)}</td></tr>)}
              {!data.accounts.length && <tr><td colSpan={3} className="py-8 text-sm text-white/45">No customer sign-ups yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>}

      {tab === 'submissions' && <section className="mt-7" aria-labelledby="submissions-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-widest text-[#FFB347]">Inbox</p><h2 id="submissions-title" className="mt-1 text-xl font-bold text-white">All submissions</h2></div><span className="font-mono text-[10px] text-white/45">{pendingCount} NEED REVIEW</span></div>
        {submissionList(data.submissions)}
      </section>}

      {tab === 'blog' && <section className="mt-2" aria-label="Blog post management">{blogContent}</section>}
    </>}
  </main>;
};