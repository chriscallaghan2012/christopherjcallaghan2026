import React, { useState } from 'react';
import { Send, MapPin, Mail, Linkedin, Github, CheckCircle2, Clock, Calculator, RefreshCw, Sparkles } from 'lucide-react';
import { ScrollWritingTitle } from './ScrollWritingTitle';

interface ContactSectionProps {
  initialService?: string;
}

const PROJECT_TYPES = [
  'Build something',
  'Start a business',
  'Just a website',
  'Website or app',
  'Software or AI',
  'SEO or Google Maps',
  'PPC or advertising',
  'Social media',
  'Something else'
];

const BUDGET_RANGES = ['Not sure yet', '£0–£1,000', '£1,000–£5,000', '£5,000+'];

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: initialService || 'Build something',
    budget: 'Not sure yet',
    timeline: 'Flexible',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          packageScope: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
          type: 'contact'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRefCode(data.refCode || 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to transmit specification. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error transmitting specification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/80 text-left">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Contact / Project Enquiry
          </div>

          <ScrollWritingTitle text="LET'S TALK." accentWords={[{ word: 'TALK.', color: 'purple' }]} className="text-4xl md:text-7xl font-black tracking-tighter text-white" />

          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Have an idea, existing site or growth challenge? Tell me what you want to build, improve or grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Scope Estimator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-7 space-y-6">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF003C]" />
                Based in Manchester
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Working with people building digital products and businesses.
              </p>

              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#FF003C]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/65 block uppercase">Based in</span>
                    <span className="font-bold text-xs">Manchester, UK</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/65 block uppercase">Email</span>
                    <span className="font-mono text-xs text-white/90">christopher@christopherjcallaghan.com</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/65 block mb-3">
                  Find me online
                </span>
                <div className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/in/webdevelopermanchester/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:text-white hover:border-[#FF003C]/50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#FF003C]" />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:text-white hover:border-[#FF003C]/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Scope Estimator Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/80 to-purple-950/20 backdrop-blur-2xl p-6">
              <div className="flex items-center gap-2 mb-2 text-[#FF003C] text-xs font-mono font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                Start with the idea
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                A short note is enough. You do not need to know the technology before getting in touch.
              </p>
            </div>
          </div>

          {/* Right: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-7 sm:p-10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Enquiry sent.
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
                    <span>Reference Code:</span>
                    <strong className="font-bold">{refCode}</strong>
                  </div>
                  <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                    Thanks, {formData.name}. I&apos;ll be in touch at <strong className="text-white">{formData.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ ...formData, message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-xs font-mono uppercase tracking-wider hover:bg-white/20 transition-colors"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00DFC9]/70 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00DFC9]/70 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-2">
                        What are you looking to do?
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0e0e14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00DFC9]/70 transition-colors"
                      >
                        {PROJECT_TYPES.map((projectType) => <option key={projectType} value={projectType}>{projectType}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-2">
                        Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0e0e14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00DFC9]/70 transition-colors"
                      >
                        {BUDGET_RANGES.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-2">
                      Tell me about it *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="What are you hoping to build, solve or change?"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00DFC9]/70 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#FF003C] text-white font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(255,0,60,0.45)] hover:shadow-[0_0_45px_rgba(255,0,60,0.7)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
