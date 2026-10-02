'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { ScrollWritingTitle } from './ScrollWritingTitle';

type BriefMode = 'build' | 'start';

interface ProjectBriefPageProps {
  mode: BriefMode;
}

const BUILD_GOALS = [
  { title: 'A website', detail: 'A new site, redesign or online shop', color: 'orange' },
  { title: 'An app or platform', detail: 'A digital product people can use', color: 'purple' },
  { title: 'Software or AI', detail: 'A custom tool, workflow or AI feature', color: 'teal' },
  { title: 'Automation or integration', detail: 'Connect systems and remove repeat work', color: 'pink' },
  { title: 'Not sure yet', detail: 'I know the problem, not the solution', color: 'orange' }
];

const START_GOALS = [
  { title: 'I have an idea', detail: 'Shape it into a clear plan', color: 'purple' },
  { title: 'I am getting ready to launch', detail: 'Create the foundations to start trading', color: 'orange' },
  { title: 'I have started already', detail: 'Build the next stage of the business', color: 'teal' }
];

const BUILD_FOCUS = ['Plan and scope the idea', 'Design and build the first version', 'Improve something that already exists', 'Connect tools or automate a process', 'Explore the right approach together'];
const START_FOCUS = ['Business plan and setup', 'Brand, website or online shop', 'Marketing and customer growth', 'Funding options and launch planning', 'A joined-up plan from idea to launch'];
const BUDGETS = ['Not sure yet', 'Under £1,000', '£1,000–£5,000', '£5,000–£15,000', '£15,000+'];

const colorClasses: Record<string, string> = {
  orange: 'border-[#FFB347]/35 hover:border-[#FFB347] hover:bg-[#FFB347]/[0.07] text-[#FFB347]',
  purple: 'border-[#DF80FF]/35 hover:border-[#DF80FF] hover:bg-[#DF80FF]/[0.07] text-[#DF80FF]',
  teal: 'border-[#00DFC9]/35 hover:border-[#00DFC9] hover:bg-[#00DFC9]/[0.07] text-[#00DFC9]',
  pink: 'border-[#FF3E85]/35 hover:border-[#FF3E85] hover:bg-[#FF3E85]/[0.07] text-[#FF3E85]'
};

export const ProjectBriefPage: React.FC<ProjectBriefPageProps> = ({ mode }) => {
  const isStart = mode === 'start';
  const goals = isStart ? START_GOALS : BUILD_GOALS;
  const focusOptions = isStart ? START_FOCUS : BUILD_FOCUS;
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [focus, setFocus] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('Not sure yet');
  const [timeline, setTimeline] = useState('Flexible');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const pageTitle = isStart ? 'Start a business' : 'Build a digital product';
  const selectGoal = (value: string) => {
    setGoal(value);
    setStep(1);
  };

  const submitBrief = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          projectType: pageTitle,
          packageScope: `${pageTitle} / ${goal} / ${focus}`,
          budget,
          timeline,
          message: details,
          type: 'consultation'
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || 'Your brief could not be sent. Please try again.');
        return;
      }
      setReference(result.refCode || 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setStep(3);
    } catch {
      setError('A network error stopped the brief from sending. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100svh-68px)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 border-b border-white/10 pb-8 md:mb-14">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#45D6C8]">{isStart ? 'New venture / guided brief' : 'Digital project / guided brief'}</p>
          <ScrollWritingTitle as="h1" text={isStart ? "LET'S START SOMETHING." : "LET'S BUILD IT."} accentWords={isStart ? [{ word: 'START', color: 'orange' }, { word: 'SOMETHING.', color: 'purple' }] : [{ word: 'BUILD', color: 'purple' }, { word: 'IT.', color: 'orange' }]} className="text-4xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            {isStart ? 'Tell me where you are with your idea. We will work out the business, launch and digital foundations together.' : 'Choose what you are trying to make, then add a little context. You do not need to arrive with a technical plan.'}
          </p>
        </div>

        <div className="mb-8 flex items-center gap-2" aria-label={`Step ${Math.min(step + 1, 3)} of 3`}>
          {[0, 1, 2].map((item) => <span key={item} className={`h-1 flex-1 ${step >= item ? 'bg-[#FFB347]' : 'bg-white/10'}`} />)}
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-white/45">{step < 3 ? `0${step + 1} / 03` : 'SENT'}</span>
        </div>

        <div key={step} className="brief-step">
          {step === 0 && (
            <div>
              <ScrollWritingTitle text="What are you trying to do?" accentWords={[{ word: 'trying', color: 'orange' }, { word: 'do?', color: 'purple' }]} className="mb-6 text-2xl font-black text-white md:text-3xl" />
              <div className="grid gap-3 sm:grid-cols-2">
                {goals.map((item) => <button key={item.title} onClick={() => selectGoal(item.title)} className={`group flex min-h-28 flex-col items-start justify-center border bg-white/[0.02] p-5 text-left transition-colors ${colorClasses[item.color]}`}>
                  <span className={`text-lg font-black ${colorClasses[item.color].split(' ')[3]}`}>{item.title}</span>
                  <span className="mt-2 text-sm text-white/55">{item.detail}</span>
                  <ArrowRight className="mt-3 h-4 w-4 opacity-65 transition-transform group-hover:translate-x-1" />
                </button>)}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <button onClick={() => setStep(0)} className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#DF80FF]">{goal}</p>
              <ScrollWritingTitle text="What would help most?" accentWords={[{ word: 'help', color: 'orange' }, { word: 'most?', color: 'purple' }]} className="mb-6 text-2xl font-black text-white md:text-3xl" />
              <div className="divide-y divide-white/10 border-y border-white/10">
                {focusOptions.map((item, index) => <button key={item} onClick={() => { setFocus(item); setStep(2); }} className="group flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-white/75 transition-colors hover:text-[#00DFC9] md:text-base">
                  <span><span className="mr-4 font-mono text-xs text-[#00DFC9]">0{index + 1}</span>{item}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>)}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#00DFC9]">{goal} / {focus}</p>
              <ScrollWritingTitle text="A few details." accentWords={[{ word: 'details.', color: 'orange' }]} className="mb-8 text-2xl font-black text-white md:text-3xl" />
              <form onSubmit={submitBrief} className="grid gap-5 md:grid-cols-2">
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Name *<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 min-h-12 w-full border border-white/15 bg-white/[0.03] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Email *<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 min-h-12 w-full border border-white/15 bg-white/[0.03] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#DF80FF]" /></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Budget<select value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-2 min-h-12 w-full border border-white/15 bg-[#111118] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]">{BUDGETS.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Timing<select value={timeline} onChange={(event) => setTimeline(event.target.value)} className="mt-2 min-h-12 w-full border border-white/15 bg-[#111118] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#FF3E85]"><option>Flexible</option><option>As soon as possible</option><option>Within 1–3 months</option><option>More than 3 months</option><option>Just exploring</option></select></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65 md:col-span-2">Anything else you want me to know<textarea rows={5} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="The idea, the problem, who it is for, or what a good outcome looks like..." className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#FFB347]" /></label>
                {error && <p role="alert" className="text-sm text-[#FF3E85] md:col-span-2">{error}</p>}
                <button disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#FFB347] px-6 text-xs font-black tracking-[0.15em] text-black transition-colors hover:bg-[#ffc875] disabled:opacity-60 md:col-span-2 md:justify-self-start">
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{isSubmitting ? 'SENDING' : 'SEND YOUR BRIEF'}<ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl border-l-2 border-[#00DFC9] py-5 pl-6">
              <Check className="mb-5 h-8 w-8 text-[#00DFC9]" />
              <p className="font-mono text-xs uppercase tracking-widest text-[#00DFC9]">Brief received / {reference}</p>
              <h2 className="mt-3 text-3xl font-black text-white">Thanks, {name}.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">I&apos;ll review what you shared and reply to {email}.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};