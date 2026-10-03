import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, RefreshCw, Sparkles, Bot, Gauge } from 'lucide-react';
import { ServiceItem, AIStudioContext, ArchitectureBlueprint } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceItem | null;
  aiContext?: AIStudioContext | null;
}

const STANDARD_SCOPES = [
  'Build something',
  'Start a business',
  'Just a website',
  'Build a website or app',
  'Build software or AI',
  'Grow an existing business',
  'Marketing',
  'SEO',
  'Google visibility',
  'Social media',
  'Something else'
];

const BUDGET_RANGES = ['Not sure yet', '£0–£1,000', '£1,000–£5,000', '£5,000+'];

/** Renders an AI Studio blueprint as editable project notes in the form. */
function formatBlueprintNotes(bp: ArchitectureBlueprint): string {
  return [
    `[AI Architecture Studio Blueprint] ${bp.title}`,
    `Domain: ${bp.domain}`,
    `Frontend: ${bp.frontend}`,
    `Backend: ${bp.backend}`,
    `Database: ${bp.database}`,
    `AI Engine: ${bp.aiEngine}`,
    `DevOps: ${bp.devops}`,
    `Latency Target: ${bp.latencyTarget}`,
    '',
    'Recommended Execution Stages:',
    ...bp.keyWorkflows
  ].join('\n');
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  aiContext
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [packageScope, setPackageScope] = useState('Build something');
  const [budgetRange, setBudgetRange] = useState('Not sure yet');
  const [details, setDetails] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Lock page scroll + close on Escape while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // When opened from the AI Architecture Studio, carry the generated blueprint
  // into the real consultation form: pre-fill scope + project notes.
  useEffect(() => {
    if (!isOpen) return;

    if (aiContext?.blueprint) {
      setPackageScope(aiContext.blueprint.title);
      setDetails(formatBlueprintNotes(aiContext.blueprint));
    } else if (!STANDARD_SCOPES.includes(packageScope)) {
      setPackageScope('Build something');
    }
    // Intentionally keyed on (isOpen, aiContext) only - running on every
    // packageScope/details keystroke would clobber the user's edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, aiContext]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          packageScope: preselectedService ? preselectedService.title : packageScope,
          projectType: preselectedService ? preselectedService.title : packageScope,
          fundingGoal: budgetRange,
          budget: budgetRange,
          timeline: 'Flexible',
          message: details,
          type: 'consultation',
          aiContext: aiContext ?? undefined
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRefCode(data.refCode || 'CNS-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit consultation. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Start a conversation"
        className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0a0a0f] p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,60,0.2)] z-10 overscroll-contain text-left">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Message received.</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
              <span>Reference Code:</span>
              <strong className="font-bold">{refCode}</strong>
            </div>
            <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
              Thanks, {name}. I&apos;ll be in touch at <strong className="text-white">{email}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-xs font-mono uppercase tracking-wider hover:bg-white/20"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C] text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-3">
              A good place to start
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              What are you building?
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
              {preselectedService
                ? `Discussing scope for: ${preselectedService.title}`
                : "You don't need the technical plan. Start with the idea, problem or goal."}
            </p>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {aiContext?.blueprint && (
              <div className="mb-5 rounded-2xl border border-purple-500/30 bg-purple-500/[0.06] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                    AI Architecture Studio Blueprint Attached
                  </span>
                </div>
                <h4 className="text-sm font-black text-white leading-snug">
                  {aiContext.blueprint.title}
                </h4>
                <p className="text-[11px] font-mono text-white/50 mt-1">
                  {aiContext.blueprint.domain}
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60">
                    <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Scale: {aiContext.scale}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60">
                    <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    Model: {aiContext.model}
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-white/55 leading-relaxed">
                  The generated specification has been pre-filled into your project notes below —
                  review it, add your goals, and transmit.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/65 block mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00DFC9]/70"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/65 block mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00DFC9]/70"
                />
              </div>

              {!preselectedService && (
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/65 block mb-1.5">
                    What are you looking to do? *
                  </label>
                  <select
                    value={packageScope}
                    onChange={(e) => setPackageScope(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00DFC9]/70"
                  >
                    {aiContext?.blueprint && (
                      <option value={aiContext.blueprint.title}>🤖 {aiContext.blueprint.title}</option>
                    )}
                    {STANDARD_SCOPES.map((scope) => <option key={scope} value={scope}>{scope}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/65 block mb-1.5">
                  Budget range (optional)
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00DFC9]/70"
                >
                  {BUDGET_RANGES.map((range) => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/65 block mb-1.5">A little more about it</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What are you hoping to build, solve or change?"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00DFC9]/70 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#FF003C] text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.6)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
