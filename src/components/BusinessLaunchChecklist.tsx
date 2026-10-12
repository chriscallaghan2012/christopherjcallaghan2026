'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Download, Loader2, Printer, RefreshCw, Send } from 'lucide-react';
import {
  createLaunchPlan,
  formatLaunchHelpMessage,
  formatLaunchPlan,
  type BusinessStage,
  type LaunchAnswers,
  type LaunchTask,
  type LaunchTiming,
  type OfferType,
  type SalesMode
} from '../../lib/businessLaunchChecklist';

const STORAGE_KEY = 'cjc-business-launch-checklist-v1';
const fieldClass = 'min-h-11 w-full border border-white/20 bg-black/50 px-3.5 text-sm text-white placeholder:text-white/35 focus:border-[#FF5575] focus:outline-none';
const labelClass = 'mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-white/60';

const initialAnswers: LaunchAnswers = {
  stage: 'idea',
  offer: 'undecided',
  salesMode: 'undecided',
  timing: 'exploring',
  businessName: ''
};

const stageChoices: Array<{ value: BusinessStage; label: string; detail: string }> = [
  { value: 'idea', label: 'I have an idea', detail: 'I am deciding what to offer' },
  { value: 'preparing', label: 'Getting ready to launch', detail: 'I want to start selling soon' },
  { value: 'trading', label: 'Already selling', detail: 'I want to improve or grow' },
  { value: 'relaunch', label: 'Starting again', detail: 'I want to relaunch or change direction' }
];

const offerChoices: Array<{ value: OfferType; label: string }> = [
  { value: 'service', label: 'A service' },
  { value: 'physical', label: 'A physical product' },
  { value: 'digital', label: 'A digital product' },
  { value: 'undecided', label: 'Not sure yet' }
];

const salesChoices: Array<{ value: SalesMode; label: string }> = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In person' },
  { value: 'both', label: 'Both' },
  { value: 'undecided', label: 'Not sure yet' }
];

const timingChoices: Array<{ value: LaunchTiming; label: string }> = [
  { value: 'soon', label: 'Within a month' },
  { value: 'few-months', label: 'In 1–3 months' },
  { value: 'exploring', label: 'Just exploring' }
];

function ChoiceGroup<T extends string>({
  name,
  legend,
  value,
  choices,
  onChange
}: {
  name: string;
  legend: string;
  value: T;
  choices: Array<{ value: T; label: string; detail?: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {choices.map((choice) => (
          <label key={choice.value} className={`flex min-h-12 cursor-pointer items-start gap-3 border p-3 transition-colors ${value === choice.value ? 'border-[#FF5575]/70 bg-[#FF003C]/10' : 'border-white/15 bg-white/[0.02] hover:border-white/35'}`}>
            <input type="radio" name={name} value={choice.value} checked={value === choice.value} onChange={() => onChange(choice.value)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF003C]" />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white">{choice.label}</span>
              {choice.detail && <span className="mt-0.5 block text-xs leading-relaxed text-white/50">{choice.detail}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function isAnswers(value: unknown): value is LaunchAnswers {
  if (!value || typeof value !== 'object') return false;
  const answers = value as Partial<LaunchAnswers>;
  return ['idea', 'preparing', 'trading', 'relaunch'].includes(answers.stage ?? '')
    && ['service', 'physical', 'digital', 'undecided'].includes(answers.offer ?? '')
    && ['online', 'in-person', 'both', 'undecided'].includes(answers.salesMode ?? '')
    && ['soon', 'few-months', 'exploring'].includes(answers.timing ?? '')
    && typeof answers.businessName === 'string';
}

export const BusinessLaunchChecklist: React.FC = () => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [hasPlan, setHasPlan] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpSubmitted, setHelpSubmitted] = useState(false);
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpName, setHelpName] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpNote, setHelpNote] = useState('');
  const [helpTaskIds, setHelpTaskIds] = useState<string[]>([]);
  const [helpError, setHelpError] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const value = parsed as { answers?: unknown; checkedIds?: unknown; hasPlan?: unknown };
          if (isAnswers(value.answers)) {
            setAnswers(value.answers);
            setCheckedIds(Array.isArray(value.checkedIds) ? value.checkedIds.filter((id): id is string => typeof id === 'string') : []);
            setHasPlan(value.hasPlan === true);
          }
        }
      }
    } catch {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage may be unavailable in restricted browser contexts.
      }
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, checkedIds, hasPlan }));
    } catch {
      // The checklist remains usable when browser storage is disabled.
    }
  }, [answers, checkedIds, hasPlan, storageReady]);

  const plan = useMemo(() => createLaunchPlan(answers), [answers]);
  const completedCount = plan.tasks.filter((task) => checkedIds.includes(task.id)).length;
  const progress = plan.tasks.length ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  const updateAnswer = <K extends keyof LaunchAnswers>(key: K, value: LaunchAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const toggleTask = (taskId: string) => {
    setCheckedIds((current) => current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId]);
  };

  const startOver = () => {
    setAnswers(initialAnswers);
    setCheckedIds([]);
    setHasPlan(false);
    setHelpOpen(false);
    setHelpSubmitted(false);
    setHelpName('');
    setHelpEmail('');
    setHelpNote('');
    setHelpTaskIds([]);
    setHelpError('');
  };

  const downloadPlan = () => {
    const file = new Blob([formatLaunchPlan(answers, plan.tasks, checkedIds)], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'business-launch-checklist.txt';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const toggleHelpTask = (taskId: string) => {
    setHelpTaskIds((current) => current.includes(taskId)
      ? current.filter((id) => id !== taskId)
      : [...current, taskId]);
  };

  const submitHelpRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setHelpSubmitting(true);
    setHelpError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: helpName.trim(),
          email: helpEmail.trim(),
          projectType: 'Business launch checklist help',
          packageScope: helpTaskIds.length ? 'Help with selected launch steps' : 'Help with the full launch plan',
          timeline: answers.timing === 'soon' ? 'Within a month' : answers.timing === 'few-months' ? '1–3 months' : 'Exploring',
          message: formatLaunchHelpMessage(answers, plan.tasks, helpTaskIds, checkedIds, helpNote),
          type: 'consultation'
        })
      });
      const result = await response.json() as { success?: boolean; warning?: string; error?: string };
      if (response.ok && result.success) {
        setHelpSubmitted(true);
      } else {
        setHelpError(result.error || 'Your request could not be sent. Please try again.');
      }
    } catch {
      setHelpError('Connection problem. Please check your internet and try again.');
    } finally {
      setHelpSubmitting(false);
    }
  };

  const groupedTasks = (['Get clear', 'Get ready', 'Open the doors', 'Learn and improve'] as const)
    .map((group) => ({ group, tasks: plan.tasks.filter((task) => task.group === group) }))
    .filter((item) => item.tasks.length > 0);

  return (
    <div className="business-launch-checklist px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5575]">Free business planning tool</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">Your business launch checklist</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">A clear next-step plan for starting, launching or improving a small business. No jargon, account or personal details needed.</p>
        </header>

        {!hasPlan ? (
          <form className="mt-8 max-w-3xl space-y-6" onSubmit={(event) => { event.preventDefault(); setHasPlan(true); }}>
            <div>
              <label htmlFor="launch-business-name" className={labelClass}>Business name <span className="font-normal text-white/40">(optional)</span></label>
              <input id="launch-business-name" className={fieldClass} maxLength={100} value={answers.businessName} onChange={(event) => updateAnswer('businessName', event.target.value)} placeholder="Add a name to your plan" />
            </div>
            <ChoiceGroup name="launch-stage" legend="Where are you now?" value={answers.stage} choices={stageChoices} onChange={(value) => updateAnswer('stage', value)} />
            <ChoiceGroup name="launch-offer" legend="What do you plan to sell?" value={answers.offer} choices={offerChoices} onChange={(value) => updateAnswer('offer', value)} />
            <ChoiceGroup name="launch-sales" legend="How will customers usually buy?" value={answers.salesMode} choices={salesChoices} onChange={(value) => updateAnswer('salesMode', value)} />
            <ChoiceGroup name="launch-timing" legend="When are you hoping to start?" value={answers.timing} choices={timingChoices} onChange={(value) => updateAnswer('timing', value)} />
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#FF003C] px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ffb347] hover:text-black">
              Build my checklist <Check className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="text-xs text-white/45">Your answers stay in this browser and are used only to shape the checklist.</p>
          </form>
        ) : (
          <div className="mt-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5575]">{answers.businessName.trim() || 'Your plan'}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{plan.summary}</p>
              </div>
              <div className="launch-print-hide flex flex-wrap gap-2">
                <button type="button" onClick={downloadPlan} className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-xs font-bold text-white hover:border-white/50">
                  <Download className="h-4 w-4" aria-hidden="true" /> Download
                </button>
                <button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-xs font-bold text-white hover:border-white/50">
                  <Printer className="h-4 w-4" aria-hidden="true" /> Print
                </button>
                <button type="button" onClick={startOver} className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-xs font-bold text-white hover:border-white/50">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" /> Start over
                </button>
              </div>
            </div>

            <section className="mt-6 border border-white/10 bg-white/[0.02] p-4 sm:p-5" aria-label="Checklist progress">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">Your progress</p>
                <p className="text-sm font-bold text-white"><span data-testid="launch-completed">{completedCount}</span> of {plan.tasks.length} steps complete</p>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden bg-white/10" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <div className="h-full bg-[#FF003C] transition-[width] duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/45">Your progress saves on this device.</p>
            </section>

            <div className="mt-8 space-y-8">
              {groupedTasks.map(({ group, tasks }) => (
                <section key={group} aria-labelledby={`launch-group-${group.replaceAll(' ', '-')}`}>
                  <h2 id={`launch-group-${group.replaceAll(' ', '-')}`} className="mb-3 text-lg font-black text-white">{group}</h2>
                  <div className="space-y-2">
                    {tasks.map((task: LaunchTask) => {
                      const isChecked = checkedIds.includes(task.id);
                      return (
                        <article key={task.id} className={`launch-task border p-4 transition-colors sm:p-5 ${isChecked ? 'border-emerald-400/25 bg-emerald-400/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                          <label className="flex cursor-pointer items-start gap-3">
                            <input type="checkbox" checked={isChecked} onChange={() => toggleTask(task.id)} className="mt-1 h-4 w-4 shrink-0 accent-[#FF003C]" />
                            <span className="min-w-0 flex-1">
                              <span className={`block text-sm font-bold ${isChecked ? 'text-white/60 line-through' : 'text-white'}`}>{task.title}</span>
                              <span className="mt-1 block text-sm leading-relaxed text-white/60">{task.detail}</span>
                            </span>
                            {isChecked && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />}
                          </label>
                          <p className="ml-7 mt-3 border-l-2 border-[#FF5575]/50 pl-3 text-sm leading-relaxed text-white/75"><span className="font-bold text-white">Try this:</span> {task.action}</p>
                          {task.link && <a href={task.link.href} target="_blank" rel="noreferrer" className="ml-7 mt-3 inline-flex text-xs font-bold text-[#FF5575] underline decoration-[#FF5575]/40 underline-offset-4 hover:text-white">{task.link.label}</a>}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/45">
              This is a general planning checklist, not legal, tax or financial advice. Requirements vary by business and location; confirm important decisions with official sources or a qualified adviser.
            </p>

            <section className="launch-print-hide mt-8 border border-white/15 bg-white/[0.025] p-5 sm:p-6" aria-labelledby="launch-help-title">
              {!helpOpen ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 id="launch-help-title" className="text-lg font-black text-white">Would you like help with any of this?</h2>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">Tell me which steps you want help with, or ask to talk through the whole plan.</p>
                  </div>
                  <button type="button" onClick={() => setHelpOpen(true)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#ffb347] hover:text-black">
                    Ask for help <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : helpSubmitted ? (
                <div role="status" className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                  <div>
                    <h2 id="launch-help-title" className="font-bold text-white">Your request has been sent.</h2>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">I&apos;ll review your checklist and reply to {helpEmail.trim()}.</p>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={submitHelpRequest}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 id="launch-help-title" className="text-lg font-black text-white">Tell me what you&apos;d like help with</h2>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">Your checklist and selected steps will be included with your request.</p>
                    </div>
                    <button type="button" onClick={() => { setHelpOpen(false); setHelpError(''); }} className="min-h-9 border border-white/20 px-3 text-xs font-bold text-white/70 hover:border-white/50">Close</button>
                  </div>

                  <fieldset>
                    <legend className={labelClass}>Which steps should we talk about? <span className="font-normal text-white/40">(optional)</span></legend>
                    <p className="mb-2 text-xs text-white/50">Leave these clear to discuss the whole plan.</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {plan.tasks.map((task) => (
                        <label key={task.id} className="flex cursor-pointer items-start gap-2.5 border border-white/10 bg-black/20 p-3 text-sm text-white/75 hover:border-white/30">
                          <input type="checkbox" checked={helpTaskIds.includes(task.id)} onChange={() => toggleHelpTask(task.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF003C]" />
                          <span>{task.title}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {helpError && <p role="alert" className="border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{helpError}</p>}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="launch-help-name" className={labelClass}>Your name *</label>
                      <input id="launch-help-name" name="name" autoComplete="name" required maxLength={120} value={helpName} onChange={(event) => setHelpName(event.target.value)} className={fieldClass} placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="launch-help-email" className={labelClass}>Email address *</label>
                      <input id="launch-help-email" name="email" type="email" autoComplete="email" required maxLength={320} value={helpEmail} onChange={(event) => setHelpEmail(event.target.value)} className={fieldClass} placeholder="you@example.com" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="launch-help-note" className={labelClass}>Anything else I should know? <span className="font-normal text-white/40">(optional)</span></label>
                    <textarea id="launch-help-note" maxLength={1500} rows={3} value={helpNote} onChange={(event) => setHelpNote(event.target.value)} className={`${fieldClass} resize-y py-3`} placeholder="Your question, concern or where you'd like to begin." />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/45">Your contact details are used only to reply to this request.</p>
                    <button type="submit" disabled={helpSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF003C] px-5 text-xs font-black uppercase tracking-[0.08em] text-white hover:bg-[#ffb347] hover:text-black disabled:cursor-wait disabled:opacity-60">
                      {helpSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</> : <>Send my request <Send className="h-4 w-4" aria-hidden="true" /></>}
                    </button>
                  </div>
                </form>
              )}
            </section>

            <a href="/start" className="launch-print-hide mt-6 inline-flex min-h-11 items-center border border-white/25 px-5 text-xs font-bold text-white transition-colors hover:border-white/60">Prefer a full project brief? Go to Start a Business</a>
          </div>
        )}
      </div>
    </div>
  );
};