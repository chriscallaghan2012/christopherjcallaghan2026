import React, { useEffect, useState } from 'react';
import { Activity, Check, CircleAlert, GitBranch, Pause, Play, RotateCcw, ShieldCheck, Sparkles, Workflow, Zap } from 'lucide-react';

type RunState = 'running' | 'paused' | 'complete';

const nodes = [
  { id: '01', label: 'New enquiry', type: 'TRIGGER', detail: 'Form · inbox · webhook', icon: Zap, tone: 'violet' },
  { id: '02', label: 'Prepare data', type: 'TRANSFORM', detail: 'Extract · clean · validate', icon: Workflow, tone: 'purple' },
  { id: '03', label: 'Route decision', type: 'LOGIC + AI', detail: 'Rules · confidence · intent', icon: Sparkles, tone: 'lavender' },
  { id: '04', label: 'Update CRM', type: 'ACTION', detail: 'Create record · assign owner', icon: Check, tone: 'mint' },
];

const steps = [
  'Listening for a new enquiry',
  'Normalising fields and validating input',
  'Checking rules and classifying intent',
  'Writing the CRM record and audit event',
];

export const AutomationWorkflowCanvas: React.FC = () => {
  const [runState, setRunState] = useState<RunState>('running');
  const [activeStep, setActiveStep] = useState(0);
  const [runCount, setRunCount] = useState(1);

  useEffect(() => {
    if (runState !== 'running') return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= nodes.length - 1) {
          setRunState('complete');
          return nodes.length - 1;
        }
        return current + 1;
      });
    }, 1350);
    return () => window.clearInterval(timer);
  }, [runState, runCount]);

  const replay = () => {
    setActiveStep(0);
    setRunCount((count) => count + 1);
    setRunState('running');
  };

  const isComplete = runState === 'complete';
  const currentStatus = isComplete ? 'RUN COMPLETE' : runState === 'paused' ? 'PAUSED BY USER' : 'EXECUTING DEMO';

  return (
    <section aria-labelledby="automation-pipeline-title" className="relative overflow-hidden border border-[#DF80FF]/30 bg-[#09070F] shadow-[0_24px_90px_rgba(84,35,130,.12)]">
      <style>{`
        @keyframes automation-flow-dash { to { stroke-dashoffset: -44; } }
        @keyframes automation-pulse { 0%, 100% { opacity: .45; filter: drop-shadow(0 0 0 rgba(223,128,255,0)); } 50% { opacity: 1; filter: drop-shadow(0 0 5px rgba(223,128,255,.9)); } }
        @keyframes automation-node-glow { 0%, 100% { box-shadow: 0 0 0 rgba(168,85,247,0); } 50% { box-shadow: 0 0 26px rgba(168,85,247,.14); } }
        .automation-flow-line { stroke-dasharray: 5 9; animation: automation-flow-dash 1.4s linear infinite; }
        .automation-flow-pulse { animation: automation-pulse 1.8s ease-in-out infinite; }
        .automation-node-active { animation: automation-node-glow 2.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .automation-flow-line, .automation-flow-pulse, .automation-node-active { animation: none !important; } }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(223,128,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(223,128,255,.055) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative border-b border-white/10 p-5 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#DF80FF]"><span className="h-1.5 w-1.5 bg-[#DF80FF] shadow-[0_0_10px_#DF80FF]" /> WORKFLOW CANVAS / INTERACTIVE PREVIEW</p>
            <h2 id="automation-pipeline-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">See the workflow in motion.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">Follow a sample enquiry from trigger to verified action. Run, pause or replay the sequence, and see how exceptions are routed safely.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setRunState((state) => state === 'running' ? 'paused' : state === 'complete' ? 'complete' : 'running')} disabled={isComplete} className="inline-flex min-h-10 items-center gap-2 border border-white/15 bg-white/[.04] px-4 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-white transition hover:border-[#DF80FF]/60 hover:bg-[#DF80FF]/10 disabled:cursor-not-allowed disabled:opacity-40">
              {runState === 'running' ? <Pause size={13} /> : <Play size={13} />} {runState === 'running' ? 'Pause' : 'Resume'}
            </button>
            <button type="button" onClick={replay} className="inline-flex min-h-10 items-center gap-2 border border-[#DF80FF]/40 bg-[#DF80FF]/10 px-4 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[#E9C8FF] transition hover:bg-[#DF80FF]/20"><RotateCcw size={13} /> Replay</button>
          </div>
        </div>
      </div>

      <div className="relative p-4 sm:p-7 lg:p-9">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/25 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-8 w-8 items-center justify-center border ${isComplete ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200' : 'border-[#DF80FF]/30 bg-[#DF80FF]/10 text-[#DF80FF]'}`}><Activity size={15} /></span>
            <div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-white/40">DEMO EXECUTION</p><p className="mt-1 text-xs font-bold text-white">{currentStatus}</p></div>
          </div>
          <p aria-live="polite" className="font-mono text-[10px] text-white/50">{String(Math.min(activeStep + 1, 4)).padStart(2, '0')} <span className="text-white/25">/</span> 04 STEPS <span className="mx-2 text-white/20">·</span> RUN #{String(runCount).padStart(2, '0')}</p>
        </div>

        <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_30px_minmax(0,1fr)_30px_minmax(0,1fr)_30px_minmax(0,1fr)] lg:gap-0">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const active = index === activeStep && !isComplete && runState === 'running';
            const passed = index < activeStep || isComplete;
            const tone = node.tone === 'mint' ? 'text-emerald-200 border-emerald-300/35' : 'text-[#DF80FF] border-[#DF80FF]/35';
            return (
              <React.Fragment key={node.id}>
                <article className={`relative flex min-h-[146px] flex-col border bg-[#100B18]/95 p-4 transition-all duration-500 ${active ? 'automation-node-active border-[#DF80FF]/90 shadow-[0_0_28px_rgba(168,85,247,.15)]' : passed ? 'border-emerald-300/35' : 'border-white/10 hover:border-[#DF80FF]/45'}`}>
                  <span className={`absolute -left-px top-4 h-8 w-[2px] ${active ? 'bg-[#DF80FF]' : passed ? 'bg-emerald-300/70' : 'bg-white/15'}`} />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] tracking-[.14em] text-white/40">NODE {node.id}</span>
                    <span className={`flex h-7 w-7 items-center justify-center border ${tone} ${active ? 'automation-flow-pulse' : ''}`}><Icon size={14} /></span>
                  </div>
                  <p className={`mt-4 font-mono text-[9px] font-bold tracking-[.15em] ${node.tone === 'mint' ? 'text-emerald-200' : 'text-[#DF80FF]'}`}>{node.type}</p>
                  <h3 className="mt-1 text-sm font-black text-white">{node.label}</h3>
                  <p className="mt-2 text-[10px] leading-4 text-white/50">{node.detail}</p>
                  <div className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[8px] uppercase tracking-[.1em]">
                    {active ? <><span className="h-1.5 w-1.5 animate-pulse bg-[#DF80FF]" /><span className="text-[#E9C8FF]">Running now</span></> : passed ? <><Check size={10} className="text-emerald-200" /><span className="text-emerald-200/80">Verified</span></> : <><span className="h-1.5 w-1.5 bg-white/20" /><span className="text-white/35">Waiting</span></>}
                  </div>
                </article>
                {index < nodes.length - 1 && <div aria-hidden="true" className="flex h-5 items-center justify-center lg:h-auto"><svg viewBox="0 0 30 20" className="h-5 w-8 overflow-visible text-[#DF80FF] lg:w-[30px]" fill="none"><path d="M1 10 H25 M19 4 L25 10 L19 16" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.3" /><path d="M1 10 H25" className={`automation-flow-line ${index < activeStep && runState !== 'paused' ? 'text-emerald-300' : 'text-[#DF80FF]'}`} stroke="currentColor" strokeWidth="1.5" /></svg></div>}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
          <div className="border border-white/10 bg-black/25 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.15em] text-white/55"><Activity size={12} className="text-[#DF80FF]" /> Execution log</p><span className="font-mono text-[8px] text-white/30">SIMULATED EVENTS</span></div>
            <ol className="mt-3 space-y-2">
              {steps.slice(0, activeStep + 1).map((step, index) => <li key={step} className="flex items-start gap-2 text-xs leading-5"><span className="mt-1 font-mono text-[9px] text-[#DF80FF]">{new Date(0, 0, 0, 0, index * 0, index).toLocaleTimeString('en-GB', { hour12: false, minute: '2-digit', second: '2-digit' })}</span><span className={index === activeStep && runState === 'running' ? 'text-white' : 'text-white/50'}>{step}{index === activeStep && runState === 'running' ? '…' : ''}</span>{(index < activeStep || isComplete) && <Check size={12} className="ml-auto mt-1 shrink-0 text-emerald-200" />}</li>)}
              {runState === 'paused' && <li className="text-[10px] text-amber-200">Execution paused. Resume to continue.</li>}
              {isComplete && <li className="text-[10px] text-emerald-200">All demo steps completed. No external systems were contacted.</li>}
            </ol>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className={`border p-4 transition-colors ${isComplete ? 'border-emerald-300/35 bg-emerald-950/20' : 'border-emerald-300/20 bg-[#071510]/70'}`}>
              <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-emerald-200"><ShieldCheck size={12} /> Success path</p>
              <h3 className="mt-2 text-sm font-bold text-white">Verified and recorded</h3>
              <p className="mt-1 text-xs leading-5 text-white/50">Confirm the action, write an audit event and update the workflow status.</p>
            </div>
            <div className="border border-amber-300/25 bg-[#191208]/75 p-4">
              <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-amber-200"><GitBranch size={12} /> Exception path</p>
              <h3 className="mt-2 text-sm font-bold text-white">Pause for human review</h3>
              <p className="mt-1 text-xs leading-5 text-white/50">Invalid data or low confidence goes to a review queue instead of silently continuing.</p>
              <p className="mt-2 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[.1em] text-amber-200/70"><CircleAlert size={11} /> Safe fallback route</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[.14em] text-white/35">Guardrails</span>
          {['Scoped permissions', 'Validation', 'Retries', 'Audit trail', 'Monitoring'].map((item) => <span key={item} className="border border-white/10 bg-black/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-white/55">{item}</span>)}
        </div>
        <p className="mt-4 text-[10px] leading-5 text-white/35">Interactive visual demonstration only — this preview does not connect to a CRM, send messages or execute real business actions.</p>
      </div>
    </section>
  );
};
