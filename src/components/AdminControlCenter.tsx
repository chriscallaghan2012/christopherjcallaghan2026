'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, CalendarClock, LoaderCircle, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import type {
  AdminResearchTrack,
  AdminResearchTrackInput,
  AdminSocialDraft,
  AdminSocialDraftInput,
  ResearchCadence,
  ResearchScope,
  SocialChannel
} from '../../lib/database';

interface AdminControlCenterProps {
  onBackToBlog: () => void;
  onLogout: () => void;
}

type ControlTab = 'social' | 'research';

const channels: { id: SocialChannel; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'x', label: 'X' },
  { id: 'threads', label: 'Threads' }
];

const scopes: { id: ResearchScope; label: string }[] = [
  { id: 'google', label: 'Google search' },
  { id: 'local', label: 'Google Maps / local' },
  { id: 'ai_search', label: 'AI search' },
  { id: 'competitors', label: 'Competitors' }
];

const cadenceLabels: Record<ResearchCadence, string> = {
  manual: 'Manual',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
};

const newDraft = (): AdminSocialDraftInput => ({
  title: '',
  prompt: '',
  channels: ['linkedin'],
  copyByChannel: { linkedin: '' },
  imagePrompt: '',
  scheduledAt: null,
  timeZone: 'Europe/London',
  status: 'draft'
});

const newTrack = (): AdminResearchTrackInput => ({
  name: '',
  query: '',
  scopes: ['google'],
  cadence: 'manual',
  enabled: true
});

function toLocalDateTime(value: string): string {
  return value.replace(' ', 'T').slice(0, 16);
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({ onBackToBlog, onLogout }) => {
  const [tab, setTab] = useState<ControlTab>('social');
  const [drafts, setDrafts] = useState<AdminSocialDraft[]>([]);
  const [tracks, setTracks] = useState<AdminResearchTrack[]>([]);
  const [draft, setDraft] = useState<AdminSocialDraftInput>(newDraft());
  const [track, setTrack] = useState<AdminResearchTrackInput>(newTrack());
  const [scheduledLocal, setScheduledLocal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = async () => {
    const [draftResponse, researchResponse] = await Promise.all([
      fetch('/api/admin/control-center/drafts', { cache: 'no-store' }),
      fetch('/api/admin/control-center/research', { cache: 'no-store' })
    ]);
    const [draftResult, researchResult] = await Promise.all([draftResponse.json(), researchResponse.json()]);
    if (!draftResponse.ok) throw new Error(draftResult.error || 'Could not load social drafts.');
    if (!researchResponse.ok) throw new Error(researchResult.error || 'Could not load research monitors.');
    setDrafts(draftResult.drafts);
    setTracks(researchResult.tracks);
  };

  useEffect(() => {
    loadData()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not load the control center.'))
      .finally(() => setIsLoading(false));
  }, []);

  const startNewDraft = () => {
    setDraft(newDraft());
    setScheduledLocal('');
    setError('');
    setNotice('');
  };

  const selectDraft = (item: AdminSocialDraft) => {
    setDraft(item);
    setScheduledLocal(item.scheduledAt ? toLocalDateTime(item.scheduledAt) : '');
    setError('');
    setNotice('');
  };

  const toggleChannel = (channel: SocialChannel) => {
    setDraft((current) => {
      const selected = current.channels.includes(channel);
      const nextChannels = selected ? current.channels.filter((item) => item !== channel) : [...current.channels, channel];
      return { ...current, channels: nextChannels };
    });
  };

  const generateSocialCopy = async () => {
    if (draft.prompt.trim().length < 20 || !draft.channels.length) {
      setError('Add a project or campaign brief of at least 20 characters and choose a channel.');
      return;
    }
    setIsWorking(true);
    setError('');
    setNotice('Generating channel-specific copy and an image prompt…');
    try {
      const response = await fetch('/api/admin/control-center/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: draft.prompt, channels: draft.channels })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not generate social content.');
      setDraft((current) => ({
        ...current,
        title: current.title || result.draft.title,
        copyByChannel: result.draft.copyByChannel,
        imagePrompt: result.draft.imagePrompt,
        status: 'draft'
      }));
      setNotice('Draft generated. Review the channel copy and image prompt before saving.');
    } catch (generationError) {
      setNotice('');
      setError(generationError instanceof Error ? generationError.message : 'Could not generate social content.');
    } finally {
      setIsWorking(false);
    }
  };

  const saveDraft = async () => {
    if (!draft.channels.length) {
      setError('Choose at least one channel.');
      return;
    }
    setIsWorking(true);
    setError('');
    setNotice('');
    const payload = {
      ...draft,
      scheduledAt: scheduledLocal || null
    };
    try {
      const response = await fetch('/api/admin/control-center/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save the social draft.');
      setDraft(result.draft);
      setScheduledLocal(result.draft.scheduledAt ? toLocalDateTime(result.draft.scheduledAt) : '');
      setDrafts((current) => [result.draft, ...current.filter((item) => item.id !== result.draft.id)]);
      setNotice('Social draft saved. Publishing is not connected yet.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the social draft.');
    } finally {
      setIsWorking(false);
    }
  };

  const deleteDraft = async () => {
    if (!draft.id || !window.confirm(`Delete “${draft.title}”? This cannot be undone.`)) return;
    setIsWorking(true);
    try {
      const response = await fetch(`/api/admin/control-center/drafts?id=${encodeURIComponent(draft.id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete the draft.');
      setDrafts((current) => current.filter((item) => item.id !== draft.id));
      startNewDraft();
      setNotice('Social draft deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the draft.');
    } finally {
      setIsWorking(false);
    }
  };

  const saveTrack = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsWorking(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/control-center/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(track)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save the research monitor.');
      setTracks((current) => [result.track, ...current]);
      setTrack(newTrack());
      setNotice('Research monitor saved. A search provider is not connected yet.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the research monitor.');
    } finally {
      setIsWorking(false);
    }
  };

  const deleteTrack = async (id: string) => {
    if (!window.confirm('Delete this research monitor? This cannot be undone.')) return;
    setIsWorking(true);
    try {
      const response = await fetch(`/api/admin/control-center/research?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete the monitor.');
      setTracks((current) => current.filter((item) => item.id !== id));
      setNotice('Research monitor deleted.');
      setError('');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the monitor.');
    } finally {
      setIsWorking(false);
    }
  };

  return <main className="mx-auto min-h-[75svh] max-w-7xl px-5 py-10 md:px-8 md:py-14">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        <button onClick={onBackToBlog} className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-white/55 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" /> BLOG POSTS</button>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#00DFC9]">Private / control center</p>
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">Content & research</h1>
      </div>
      <button onClick={onLogout} className="min-h-10 border border-white/15 px-4 font-mono text-[10px] font-bold tracking-widest text-white/70 hover:text-white">SIGN OUT</button>
    </div>

    <nav className="mt-6 flex gap-5 border-b border-white/10" aria-label="Control center sections">
      {([['social', 'SOCIAL DRAFTS'], ['research', 'RESEARCH MONITORS']] as const).map(([id, label]) => <button key={id} onClick={() => { setTab(id); setError(''); setNotice(''); }} className={`min-h-11 border-b-2 px-1 font-mono text-[10px] font-bold tracking-[0.14em] ${tab === id ? 'border-[#00DFC9] text-white' : 'border-transparent text-white/45 hover:text-white/75'}`}>{label}</button>)}
    </nav>

    <p className="mt-5 text-xs leading-relaxed text-white/45">Saved schedules are planning metadata only; automatic publishing and live research runs still need provider integrations.</p>
    {error && <p role="alert" className="mt-5 text-sm text-[#FF6F91]">{error}</p>}
    {notice && <p role="status" className="mt-5 text-sm text-[#00DFC9]">{notice}</p>}

    {isLoading ? <div className="flex min-h-48 items-center gap-3 text-sm text-white/55"><LoaderCircle className="h-4 w-4 animate-spin" />Loading control center…</div> : tab === 'social' ? (
      <div className="mt-7 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/55">Saved drafts</h2>
            <button onClick={startNewDraft} aria-label="New social draft" className="flex h-9 w-9 items-center justify-center border border-white/15 text-white hover:border-[#00DFC9]"><Plus className="h-4 w-4" /></button>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {drafts.map((item) => <button key={item.id} onClick={() => selectDraft(item)} className={`block w-full py-4 text-left ${draft.id === item.id ? 'text-white' : 'text-white/60 hover:text-white'}`}>
              <span className="block text-sm font-semibold leading-snug">{item.title}</span>
              <span className="mt-2 block font-mono text-[9px] uppercase tracking-widest text-[#00DFC9]">{item.status} / {item.channels.join(', ')}</span>
            </button>)}
            {!drafts.length && <p className="py-5 text-xs text-white/45">No social drafts saved yet.</p>}
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/55">{draft.id ? 'Edit draft' : 'Create a draft'}</h2>
            <button onClick={generateSocialCopy} disabled={isWorking} className="inline-flex min-h-10 items-center gap-2 border border-[#DF80FF]/55 px-4 font-mono text-[10px] font-bold tracking-widest text-[#DF80FF] hover:bg-[#DF80FF]/10 disabled:opacity-50"><Sparkles className="h-4 w-4" /> GENERATE COPY + IMAGE PROMPT</button>
          </div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Campaign or idea<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} maxLength={160} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]" /></label>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Brief for the AI<textarea value={draft.prompt} onChange={(event) => setDraft({ ...draft, prompt: event.target.value })} rows={3} maxLength={4000} placeholder="What are you promoting, who is it for, and what should people do next?" className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-3 py-3 font-sans text-sm normal-case leading-relaxed tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#00DFC9]" /></label>
          <fieldset>
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/55">Channels</legend>
            <div className="flex flex-wrap gap-2">
              {channels.map((channel) => <label key={channel.id} className={`flex min-h-10 cursor-pointer items-center gap-2 border px-3 text-xs transition-colors ${draft.channels.includes(channel.id) ? 'border-[#00DFC9]/70 bg-[#00DFC9]/10 text-white' : 'border-white/15 text-white/55 hover:text-white'}`}>
                <input type="checkbox" checked={draft.channels.includes(channel.id)} onChange={() => toggleChannel(channel.id)} className="accent-[#00DFC9]" />{channel.label}
              </label>)}
            </div>
          </fieldset>
          {draft.channels.map((channel) => <label key={channel} className="block font-mono text-[10px] uppercase tracking-widest text-white/55">{channels.find((item) => item.id === channel)?.label} copy<textarea rows={4} value={draft.copyByChannel[channel] ?? ''} onChange={(event) => setDraft({ ...draft, copyByChannel: { ...draft.copyByChannel, [channel]: event.target.value } })} maxLength={5000} className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-3 py-3 font-sans text-sm normal-case leading-relaxed tracking-normal text-white outline-none focus:border-[#00DFC9]" /></label>)}
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Image prompt<textarea value={draft.imagePrompt} onChange={(event) => setDraft({ ...draft, imagePrompt: event.target.value })} rows={3} maxLength={2000} placeholder="Generate copy to create an image prompt, then edit it here." className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-3 py-3 font-sans text-sm normal-case leading-relaxed tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#00DFC9]" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Planned date and time<input type="datetime-local" value={scheduledLocal} onChange={(event) => setScheduledLocal(event.target.value)} className="mt-2 min-h-11 w-full border border-white/15 bg-[#0b0b0f] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]" /></label>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Time zone<input value={draft.timeZone} onChange={(event) => setDraft({ ...draft, timeZone: event.target.value })} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]" /></label>
          </div>
          <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2 font-mono text-xs text-white/70"><input type="checkbox" checked={draft.status === 'approved'} onChange={(event) => setDraft({ ...draft, status: event.target.checked ? 'approved' : 'draft' })} className="accent-[#00DFC9]" /> Approved for future scheduling</label>
          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
            <button onClick={saveDraft} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 bg-[#00DFC9] px-5 font-mono text-xs font-bold tracking-widest text-black disabled:opacity-50"><Save className="h-4 w-4" /> SAVE DRAFT</button>
            {draft.id && <button onClick={deleteDraft} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 border border-[#FF6F91]/40 px-4 font-mono text-xs font-bold tracking-widest text-[#FF6F91] disabled:opacity-50"><Trash2 className="h-4 w-4" /> DELETE</button>}
          </div>
        </section>
      </div>
    ) : (
      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_1fr]">
        <section>
          <div className="mb-4 flex items-center gap-2"><CalendarClock className="h-4 w-4 text-[#00DFC9]" /><h2 className="font-mono text-xs uppercase tracking-widest text-white/55">Research monitors</h2></div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {tracks.map((item) => <article key={item.id} className="flex items-start justify-between gap-4 py-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-white/60">{item.query}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-[#00DFC9]">{item.scopes.join(' / ')} · {cadenceLabels[item.cadence]} · {item.enabled ? 'enabled' : 'paused'}</p>
              </div>
              <button onClick={() => deleteTrack(item.id)} aria-label={`Delete ${item.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center text-white/40 hover:text-[#FF6F91]"><Trash2 className="h-4 w-4" /></button>
            </article>)}
            {!tracks.length && <p className="py-5 text-xs text-white/45">No research monitors saved yet.</p>}
          </div>
        </section>

        <form onSubmit={saveTrack} className="space-y-5 border-y border-white/10 py-5">
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/55">Track a topic or search</h2>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Monitor name<input required value={track.name} onChange={(event) => setTrack({ ...track, name: event.target.value })} maxLength={120} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]" /></label>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Search query or research question<input required value={track.query} onChange={(event) => setTrack({ ...track, query: event.target.value })} maxLength={500} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]" /></label>
          <fieldset>
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/55">Research areas</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {scopes.map((scope) => <label key={scope.id} className="flex min-h-10 cursor-pointer items-center gap-2 border border-white/10 px-3 text-xs text-white/70"><input type="checkbox" checked={track.scopes.includes(scope.id)} onChange={(event) => setTrack({ ...track, scopes: event.target.checked ? [...track.scopes, scope.id] : track.scopes.filter((item) => item !== scope.id) })} className="accent-[#00DFC9]" />{scope.label}</label>)}
            </div>
          </fieldset>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">Intended cadence<select value={track.cadence} onChange={(event) => setTrack({ ...track, cadence: event.target.value as ResearchCadence })} className="mt-2 min-h-11 w-full border border-white/15 bg-[#0b0b0f] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]">{Object.entries(cadenceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <button disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 bg-[#00DFC9] px-5 font-mono text-xs font-bold tracking-widest text-black disabled:opacity-50"><Plus className="h-4 w-4" /> SAVE MONITOR</button>
        </form>
      </div>
    )}
  </main>;
};