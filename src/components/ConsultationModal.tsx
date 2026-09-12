import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { ServiceItem } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceItem | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [packageScope, setPackageScope] = useState('The Whole Package (Setup + Advertising + Funding)');
  const [fundingGoal, setFundingGoal] = useState('Up to £25k (SME Micro-Grant / Early Startup)');
  const [timeline, setTimeline] = useState('Within 30 days');
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
          fundingGoal,
          budget: fundingGoal,
          timeline,
          message: details,
          type: 'consultation'
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
        aria-label="Schedule a project consultation"
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
            <h3 className="text-2xl font-black text-white">Consultation Transmitted</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
              <span>Reference Code:</span>
              <strong className="font-bold">{refCode}</strong>
            </div>
            <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
              Thank you, {name}! Your specification was saved to Supabase and dispatched to Christopher. An SLA confirmation receipt was sent to <strong className="text-white">{email}</strong>.
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
              Direct Architectural Access
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Start a Project
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
              {preselectedService
                ? `Discussing scope for: ${preselectedService.title}`
                : "Transmit your technical specs to schedule a 1-on-1 architecture consultation with Christopher."}
            </p>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF003C]/70"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF003C]/70"
                />
              </div>

              {!preselectedService && (
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                    Package Scope *
                  </label>
                  <select
                    value={packageScope}
                    onChange={(e) => setPackageScope(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]/70"
                  >
                    <option value="The Whole Package (Setup + Advertising + Funding)">★ The Whole Package (Setup + Ads + Funding)</option>
                    <option value="SME & Startup Kickstart (Up to £25k Grants & MVP)">SME & Startup Kickstart (Up to £25k Grants & MVP)</option>
                    <option value="The Setup (Product Architecture, AI Engine & Build)">01. The Setup (Product Architecture & MVP)</option>
                    <option value="The Advertising (Programmatic SEO, CAPI & Growth)">02. The Advertising (SEO, Funnels & Growth)</option>
                    <option value="Getting Funded (Investor Demo, Pitch Moat & Data Room)">03. Getting Funded (Live Demo & Pitch Tech)</option>
                    <option value="Advisory / Bespoke Architecture">Bespoke Technical Architecture</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                  Funding Stage / Target Capital
                </label>
                <select
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]/70"
                >
                  <option value="Up to £25k (SME Micro-Grant / Early Startup)">Up to £25k (SME Micro-Grant / Early Angel)</option>
                  <option value="£25k - £150k (Pre-Seed / Innovate UK)">£25k - £150k (Pre-Seed / Innovate UK Grant)</option>
                  <option value="£150k - £500k (Angel / Pre-Seed Round)">£150k - £500k (Angel / Seed Round)</option>
                  <option value="£500k - £2.5M+ (Series A / Scale)">£500k - £2.5M+ (Series A / Scale)</option>
                  <option value="Bootstrapped / Self-Funded (Day 1 Profit)">Bootstrapped / Self-Funded (Day 1 Profit)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                  Expected Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]/70"
                >
                  <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                  <option value="Within 30 days">Within 30 days</option>
                  <option value="1 - 3 Months">1 - 3 Months</option>
                  <option value="Exploratory / Advisory">Exploratory / Advisory</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                  Project Notes & Stack Requirements
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell Christopher what you are building or the problem to be solved..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF003C]/70 resize-none"
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
                    <span>Transmitting Consultation...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Specification</span>
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
