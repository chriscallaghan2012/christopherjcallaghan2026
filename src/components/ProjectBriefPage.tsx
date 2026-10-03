'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, LoaderCircle, Paperclip, X } from 'lucide-react';
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
const BUILD_EXTRAS: Record<string, string[]> = {
  'A website': ['Content management', 'Online shop and payments', 'Bookings or enquiries', 'Search visibility and analytics', 'Accessibility and performance'],
  'An app or platform': ['User accounts and permissions', 'Admin dashboards', 'Payments or subscriptions', 'Notifications and messaging', 'Third-party integrations', 'Reporting and analytics'],
  'Software or AI': ['AI assistant or smart search', 'Workflow automation', 'Data and reporting dashboards', 'API or systems integration', 'Internal admin tools', 'Cloud deployment and support'],
  'Automation or integration': ['Connect existing tools', 'Automate repeat workflows', 'CRM or email integration', 'Move or synchronise data', 'Custom API integration', 'Alerts and reporting'],
  'Not sure yet': ['Discovery and project scoping', 'User or customer research', 'Technical recommendations', 'MVP roadmap', 'Clickable prototype']
};
const START_EXTRAS: Record<string, string[]> = {
  'I have an idea': ['Clarify the audience and problem', 'Validate demand', 'Define a first version (MVP)', 'Explore the business model', 'Assess technical feasibility'],
  'I am getting ready to launch': ['Brand and positioning', 'Website or online shop', 'Payments or bookings', 'Launch and marketing plan', 'Analytics and tracking', 'Business automations'],
  'I have started already': ['Improve conversion', 'Find more customers', 'Streamline operations', 'Connect existing systems', 'Add new product features', 'Plan for growth and scale']
};
const BUDGETS = ['Not sure yet', 'Under £1,000', '£1,000–£5,000', '£5,000–£15,000', '£15,000+'];
const MAX_UPLOAD_FILES = 5;
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const ALLOWED_UPLOAD_EXTENSIONS = new Set(['txt', 'md', 'csv', 'pdf', 'doc', 'docx', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'psd', 'ai', 'fig', 'sketch', 'zip']);

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
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const extraOptions = (isStart ? START_EXTRAS : BUILD_EXTRAS)[goal] ?? [];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('Not sure yet');
  const [timeline, setTimeline] = useState('Flexible');
  const [details, setDetails] = useState('');
  const [uploads, setUploads] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const pageTitle = isStart ? 'Start a business' : 'Build a digital product';
  const selectGoal = (value: string) => {
    setGoal(value);
    setSelectedExtras([]);
    setStep(1);
  };

  const toggleExtra = (value: string) => {
    setSelectedExtras((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  };

  const briefScope = [
    pageTitle,
    `Goal: ${goal}`,
    `Focus: ${focus}`,
    `Options: ${selectedExtras.length ? selectedExtras.join(', ') : 'None selected'}`
  ].join(' | ');

  const addUploads = (files: FileList | null) => {
    if (!files?.length) return;
    const incoming = Array.from(files);
    const combined = [...uploads, ...incoming];
    if (combined.length > MAX_UPLOAD_FILES) {
      setError(`Choose up to ${MAX_UPLOAD_FILES} files.`);
      return;
    }
    const invalidFile = incoming.find((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      return !ALLOWED_UPLOAD_EXTENSIONS.has(extension);
    });
    if (invalidFile) {
      setError(`${invalidFile.name} is not a supported file type.`);
      return;
    }
    const totalBytes = combined.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_UPLOAD_BYTES) {
      setError('Attachments must total 3.5 MB or less.');
      return;
    }
    setUploads(combined);
    setError('');
  };

  const submitBrief = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries({
        name,
        email,
        projectType: pageTitle,
        packageScope: briefScope,
        budget,
        timeline,
        message: details,
        type: 'consultation'
      }).forEach(([key, value]) => formData.append(key, value));
      uploads.forEach((file) => formData.append('attachments', file, file.name));

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData
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
              <form onSubmit={submitBrief} className="grid gap-5 lg:grid-cols-2">
                <section aria-label="Brief summary" className="border-y border-white/10 py-4 lg:col-span-2">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#00DFC9]">Your brief so far</p>
                  <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div><dt className="text-xs text-white/45">Project</dt><dd className="mt-1 text-white/85">{goal}</dd></div>
                    <div><dt className="text-xs text-white/45">Main focus</dt><dd className="mt-1 text-white/85">{focus}</dd></div>
                    <div><dt className="text-xs text-white/45">Extra options</dt><dd className="mt-1 text-white/85">{selectedExtras.length ? selectedExtras.join(', ') : 'None selected'}</dd></div>
                    <div><dt className="text-xs text-white/45">Budget and timing</dt><dd className="mt-1 text-white/85">{budget} / {timeline}</dd></div>
                  </dl>
                </section>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Name *<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 min-h-12 w-full border border-white/15 bg-white/[0.03] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Email *<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 min-h-12 w-full border border-white/15 bg-white/[0.03] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#DF80FF]" /></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Budget<select value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-2 min-h-12 w-full border border-white/15 bg-[#111118] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#00DFC9]">{BUDGETS.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65">Timing<select value={timeline} onChange={(event) => setTimeline(event.target.value)} className="mt-2 min-h-12 w-full border border-white/15 bg-[#111118] px-4 text-sm normal-case tracking-normal text-white outline-none focus:border-[#FF3E85]"><option>Flexible</option><option>As soon as possible</option><option>Within 1–3 months</option><option>More than 3 months</option><option>Just exploring</option></select></label>
                <details className="group border-y border-white/10 py-4 lg:col-span-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white/85 marker:hidden">
                    <span>Explore useful options <span className="font-normal text-white/45">(optional)</span></span>
                    <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-[#FFB347] transition-transform group-open:rotate-180" />
                  </summary>
                  <fieldset className="mt-4">
                    <legend className="sr-only">Optional project options</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {extraOptions.map((item) => <label key={item} className="flex min-h-12 cursor-pointer items-start gap-3 border border-white/10 px-3 py-3 text-sm text-white/75 transition-colors hover:border-[#FFB347]/60 hover:text-white">
                        <input type="checkbox" checked={selectedExtras.includes(item)} onChange={() => toggleExtra(item)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#FFB347]" />
                        <span>{item}</span>
                      </label>)}
                    </div>
                  </fieldset>
                </details>
                <label className="text-xs font-mono uppercase tracking-widest text-white/65 lg:col-span-2">Anything else you want me to know<textarea rows={5} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="The idea, the problem, who it is for, or what a good outcome looks like..." className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#FFB347]" /></label>
                <div className="lg:col-span-2">
                  <label className="flex min-h-14 cursor-pointer items-center gap-3 border border-dashed border-white/20 px-4 py-3 text-sm text-white/75 transition-colors hover:border-[#FFB347]/70 hover:text-white">
                    <Paperclip className="h-4 w-4 text-[#FFB347]" />
                    <span>Attach files</span>
                    <input type="file" multiple accept=".txt,.md,.csv,.pdf,.doc,.docx,.rtf,.odt,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif,.svg,.psd,.ai,.fig,.sketch,.zip" onChange={(event) => { addUploads(event.target.files); event.target.value = ''; }} className="sr-only" />
                  </label>
                  <p className="mt-2 text-xs text-white/45">Up to 5 files, 3.5 MB total. Documents, images, PSD/AI files and ZIPs are attached to the admin notification email.</p>
                  {uploads.length > 0 && <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
                    {uploads.map((file, index) => <li key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 py-2 text-xs text-white/70">
                      <span className="min-w-0 truncate">{file.name} <span className="text-white/40">({(file.size / 1024).toFixed(0)} KB)</span></span>
                      <button type="button" onClick={() => setUploads((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="flex h-8 w-8 shrink-0 items-center justify-center text-white/45 hover:text-white" aria-label={`Remove ${file.name}`}><X className="h-4 w-4" /></button>
                    </li>)}
                  </ul>}
                </div>
                {error && <p role="alert" className="text-sm text-[#FF3E85] lg:col-span-2">{error}</p>}
                <button disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#FFB347] px-6 text-xs font-black tracking-[0.15em] text-black transition-colors hover:bg-[#ffc875] disabled:opacity-60 lg:col-span-2 lg:justify-self-start">
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{isSubmitting ? 'SENDING' : 'SEND YOUR BRIEF'}<ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl border-l-2 border-[#00DFC9] py-5 pl-5 sm:pl-6">
              <Check className="mb-5 h-8 w-8 text-[#00DFC9]" />
              <p className="font-mono text-xs uppercase tracking-widest text-[#00DFC9]">Brief received / {reference}</p>
              <h2 className="mt-3 text-3xl font-black text-white">Thanks, {name}.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">I&apos;ll review what you shared and reply to {email}.</p>
              <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-white/45">Project</dt><dd className="mt-1 text-white/85">{goal}</dd></div>
                <div><dt className="text-xs text-white/45">Main focus</dt><dd className="mt-1 text-white/85">{focus}</dd></div>
                <div><dt className="text-xs text-white/45">Options included</dt><dd className="mt-1 text-white/85">{selectedExtras.length ? selectedExtras.join(', ') : 'None selected'}</dd></div>
                <div><dt className="text-xs text-white/45">Budget and timing</dt><dd className="mt-1 text-white/85">{budget} / {timeline}</dd></div>
                {details && <div className="sm:col-span-2"><dt className="text-xs text-white/45">Your notes</dt><dd className="mt-1 whitespace-pre-wrap text-white/85">{details}</dd></div>}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};