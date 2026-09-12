import React, { useState } from 'react';
import { Mail, Send, Eye, RefreshCw, CheckCircle2, AlertCircle, Copy, Check, Sparkles, Code } from 'lucide-react';
import { generateAdminNotificationEmail, generateClientConfirmationEmail, EmailPayload } from '../../lib/emailTemplates';

export const EmailTemplateSandbox: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<'admin' | 'client'>('admin');
  const [testEmail, setTestEmail] = useState('hello@christopherjcallaghan.com');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [sampleData, setSampleData] = useState<EmailPayload>({
    name: 'Alex Morgan',
    email: 'alex.morgan@vanguard-tech.io',
    projectType: 'The Whole Package (Setup + Advertising + Funding)',
    packageScope: 'The Whole Package: Complete Venture Ecosystem',
    budget: '£15k - £30k (Comprehensive Platform)',
    fundingGoal: 'Up to £25k (SME Micro-Grant / Early Startup)',
    timeline: 'Within 30 days',
    message: 'We are scaling an AI-assisted programmatic SaaS platform. We need Next.js architecture, Stripe multi-tier billing, Meta/Google CAPI funnels, and a live working investor demo sandbox for our upcoming Innovate UK grant and angel syndicate pitch.',
    submittedAt: new Date().toISOString()
  });

  const currentHtml = activeTemplate === 'admin' 
    ? generateAdminNotificationEmail(sampleData)
    : generateClientConfirmationEmail(sampleData);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sampleData,
          testRecipient: testEmail,
          templateType: activeTemplate,
          isSandboxTest: true
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSendResult({
          success: true,
          message: data.message || `Test email sent to ${testEmail} via Resend!`
        });
      } else {
        setSendResult({
          success: false,
          message: data.error || data.message || 'Failed to dispatch test email.'
        });
      }
    } catch (err: any) {
      setSendResult({
        success: false,
        message: err.message || 'Network error attempting to send test email.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(currentHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-black/80 min-h-screen text-left">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Resend Email Engine & Sandbox
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">Transactional Email Previewer</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Preview, customize, and test live Resend HTML email templates for Admin Lead Alerts and Client Confirmation Receipts.
          </p>
        </div>

        {/* Top Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Template Selector & Test Data Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Template Selector Tabs */}
            <div className="rounded-3xl border border-white/10 bg-black/60 p-6 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block">
                Select Active Template
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTemplate('admin')}
                  className={`p-4 rounded-2xl border text-left font-mono transition-all ${
                    activeTemplate === 'admin'
                      ? 'border-[#FF003C] bg-[#FF003C]/10 text-white shadow-[0_0_20px_rgba(255,0,60,0.2)]'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-[#FF003C] mb-1">Template 01</div>
                  <div className="text-xs font-bold">Admin Alert</div>
                  <div className="text-[10px] text-white/40 mt-1">Sent to Chris on new lead</div>
                </button>

                <button
                  onClick={() => setActiveTemplate('client')}
                  className={`p-4 rounded-2xl border text-left font-mono transition-all ${
                    activeTemplate === 'client'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Template 02</div>
                  <div className="text-xs font-bold">Client Receipt</div>
                  <div className="text-[10px] text-white/40 mt-1">Sent to applicant SLA confirmation</div>
                </button>
              </div>
            </div>

            {/* Test Data Inputs */}
            <div className="rounded-3xl border border-white/10 bg-black/60 p-6 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block">
                Edit Sample Payload
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Sample Client Name</label>
                  <input
                    type="text"
                    value={sampleData.name}
                    onChange={(e) => setSampleData({ ...sampleData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Sample Client Email</label>
                  <input
                    type="email"
                    value={sampleData.email}
                    onChange={(e) => setSampleData({ ...sampleData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Project Archetype / Package</label>
                  <input
                    type="text"
                    value={sampleData.packageScope}
                    onChange={(e) => setSampleData({ ...sampleData, packageScope: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Budget / Funding Goal</label>
                  <input
                    type="text"
                    value={sampleData.budget}
                    onChange={(e) => setSampleData({ ...sampleData, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Specification Brief</label>
                  <textarea
                    rows={3}
                    value={sampleData.message}
                    onChange={(e) => setSampleData({ ...sampleData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF003C] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Dispatch Form */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/80 to-purple-950/20 p-6 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 block font-bold flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Dispatch Real Email via Resend
              </span>

              <form onSubmit={handleSendTestEmail} className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Target Test Recipient</label>
                  <input
                    type="email"
                    required
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-cyan-500 text-black font-mono font-black text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending via Resend...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Test Email Now</span>
                    </>
                  )}
                </button>
              </form>

              {sendResult && (
                <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                  sendResult.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {sendResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{sendResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Rendered Iframe Preview */}
          <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-[#060608] p-4 sm:p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                <Eye className="w-4 h-4 text-[#FF003C]" />
                <span>Live Rendered HTML View ({activeTemplate.toUpperCase()})</span>
              </div>

              <button
                onClick={copyHtmlCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied HTML' : 'Copy HTML Code'}</span>
              </button>
            </div>

            {/* Preview Frame */}
            <div className="w-full flex-grow rounded-2xl overflow-hidden border border-white/10 bg-[#060608] min-h-[400px] sm:min-h-[600px] relative">
              <iframe
                title="Email Preview"
                srcDoc={currentHtml}
                className="w-full h-full min-h-[400px] sm:min-h-[600px] border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
