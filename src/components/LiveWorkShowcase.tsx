'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';

type Device = 'desktop' | 'tablet' | 'mobile';

const devices: Array<{ id: Device; label: string; width: number; height: number; icon: typeof Monitor }> = [
  { id: 'desktop', label: 'iMac', width: 1440, height: 900, icon: Monitor },
  { id: 'tablet', label: 'iPad', width: 820, height: 1100, icon: Tablet },
  { id: 'mobile', label: 'iPhone', width: 390, height: 844, icon: Smartphone }
];

const projects = [
  {
    name: 'Matchday Parking', url: 'https://matchdayparking.com/', domain: 'matchdayparking.com',
    type: 'Event parking platform', summary: 'A booking experience for football and rugby supporters, connecting venue discovery with event-specific parking.',
    detail: 'Explore the customer journey from sport and venue discovery through to event information and booking.',
    annotations: ['Sport and venue discovery', 'Event-led parking journeys', 'Booking and customer account flows']
  },
  {
    name: 'Concert Parking', url: 'https://concertparking.co.uk/', domain: 'concertparking.co.uk',
    type: 'Live-event parking platform', summary: 'A dedicated parking experience for concerts and major live events across the UK.',
    detail: 'See how venue information, practical parking details and booking routes come together for live-show visitors.',
    annotations: ['Venue-first navigation', 'Concert and event information', 'Clear route into booking']
  },
  {
    name: 'MW Fitness UK', url: 'https://mwfitnessuk.com/', domain: 'mwfitnessuk.com',
    type: 'Fitness and online coaching', summary: 'A responsive fitness website presenting coaching, training packages and nutrition support.',
    detail: 'A focused service experience that helps prospective clients understand the coaching offer and take the next step.',
    annotations: ['Coaching packages', 'Nutrition and training support', 'Enquiry and booking actions']
  },
  {
    name: 'Toastylicious', url: 'https://toastylicious.com/', domain: 'toastylicious.com',
    type: 'Food e-commerce', summary: 'An online storefront for made-to-order toasted sandwiches, with menu discovery and custom ordering.',
    detail: 'Browse the menu, explore customisation and follow the customer journey towards the basket.',
    annotations: ['Menu and product discovery', 'Build-your-own ordering', 'Basket-led checkout journey']
  },
  {
    name: 'Dapper Man', url: 'https://dapperman.co.uk/', domain: 'dapperman.co.uk',
    type: 'E-commerce storefront', summary: 'A retail website designed to present products and guide customers through an online shopping journey.',
    detail: 'Explore the storefront and how product presentation supports browsing and purchase decisions.',
    annotations: ['Retail product presentation', 'Responsive shopping experience', 'Customer path to purchase']
  }
] as const;

interface LiveWorkShowcaseProps { showViewAllLink?: boolean; }

export const LiveWorkShowcase: React.FC<LiveWorkShowcaseProps> = ({ showViewAllLink = true }) => {
  const [activeProject, setActiveProject] = useState(0);
  const [device, setDevice] = useState<Device>('desktop');
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameUnavailable, setFrameUnavailable] = useState(false);
  const [isPhoneLayout, setIsPhoneLayout] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const selected = projects[activeProject];
  const deviceConfig = devices.find((item) => item.id === device) ?? devices[0];
  const scale = frameWidth > 0 ? Math.min(frameWidth / deviceConfig.width, 1) : 1;
  const effectiveWidth = isPhoneLayout ? Math.max(frameWidth, 320) : deviceConfig.width * scale;
  const effectiveHeight = isPhoneLayout ? 680 : deviceConfig.height * scale;
  const effectiveScale = isPhoneLayout ? 1 : scale;
  const projectNumber = String(activeProject + 1).padStart(2, '0');

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setIsPhoneLayout(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setFrameUnavailable(false);
  }, [activeProject]);

  const iframeTitle = useMemo(() => `${selected.name} live website preview`, [selected.name]);

  const changeProject = (index: number) => {
    setActiveProject((index + projects.length) % projects.length);
    setFrameUnavailable(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" aria-labelledby="live-work-title" className="relative overflow-hidden border-y border-white/10 bg-[#08080c]/95 py-20 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#FF003C]/[0.07] blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-9 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#00DFC9]">Selected work / real websites</p>
              <h2 id="live-work-title" className="text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl md:text-7xl">Built to work.<br /><span className="text-[#FF5575]">Made for people.</span></h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 md:text-base">Explore selected live projects in a responsive device preview. Switch between desktop, tablet and mobile to see how each experience adapts.</p>
            </div>
            {showViewAllLink && <a href="/projects" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b border-white/20 pb-1 text-xs font-bold tracking-[0.12em] text-white/75 transition-colors hover:border-[#FF5575] hover:text-white md:self-auto">VIEW ALL PROJECTS <ArrowRight className="h-4 w-4" /></a>}
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-7">
            <div className="min-w-0">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Choose a featured project">
                  {projects.map((project, index) => (
                    <button key={project.name} type="button" aria-pressed={activeProject === index} onClick={() => changeProject(index)} className={`min-h-10 shrink-0 border px-3.5 text-left text-xs font-semibold transition-colors ${activeProject === index ? 'border-[#FF5575]/60 bg-[#FF003C]/10 text-white' : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white'}`}>
                      <span className="mr-2 font-mono text-[9px] text-[#00DFC9]">{String(index + 1).padStart(2, '0')}</span>{project.name}
                    </button>
                  ))}
                </div>
                <div className="hidden shrink-0 items-center gap-1 self-start border border-white/10 bg-black/30 p-1 md:flex md:self-auto" aria-label="Preview device size">
                  {devices.map((item) => {
                    const Icon = item.icon;
                    return <button key={item.id} type="button" onClick={() => setDevice(item.id)} aria-pressed={device === item.id} aria-label={`Preview at ${item.label} size`} className={`inline-flex h-9 items-center gap-1.5 px-2.5 text-[10px] font-bold transition-colors md:px-3 ${device === item.id ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}><Icon className="h-3.5 w-3.5" /><span>{item.label}</span></button>;
                  })}
                </div>
              </div>

              <div id="live-work-panel" aria-live="polite" className="overflow-hidden border border-white/10 bg-[#111218] shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
                <div className="flex min-h-12 items-center gap-3 border-b border-white/10 bg-[#171820] px-3 sm:px-4">
                  <div className="flex shrink-0 items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></div>
                  <div className="flex min-w-0 flex-1 items-center justify-center">
                    <span className="max-w-full truncate border border-white/[0.07] bg-black/25 px-4 py-1.5 font-mono text-[10px] text-white/45">{selected.domain}</span>
                  </div>
                  <a href={selected.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-white/55 transition-colors hover:text-[#00DFC9]"><span className="hidden sm:inline">OPEN</span><ExternalLink className="h-3.5 w-3.5" /></a>
                </div>

                <div ref={viewportRef} className="relative w-full overflow-hidden bg-[#0b0c10] p-0 sm:p-4">
                  <div className="relative mx-auto overflow-hidden border border-white/15 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.45)]" style={{ width: effectiveWidth, height: effectiveHeight, borderRadius: isPhoneLayout ? 0 : device === 'mobile' ? 26 : device === 'tablet' ? 18 : 8 }}>
                    <div style={{ width: effectiveWidth, height: effectiveHeight, transform: `scale(${effectiveScale})`, transformOrigin: 'top left' }}>
                      <iframe key={selected.url} title={iframeTitle} src={selected.url} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" onError={() => setFrameUnavailable(true)} className="block border-0 bg-white" style={{ width: effectiveWidth, height: effectiveHeight }} />
                    </div>
                    {frameUnavailable && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111218]/95 p-6 text-center"><Monitor className="h-8 w-8 text-[#FF5575]" /><p className="max-w-sm text-sm font-semibold text-white">This website does not allow an embedded preview.</p><a href={selected.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#FF003C] px-4 py-2.5 text-xs font-bold text-white">OPEN LIVE WEBSITE <ExternalLink className="h-3.5 w-3.5" /></a></div>}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">{isPhoneLayout ? 'Your phone' : deviceConfig.label} viewport / {Math.round(effectiveWidth)}px</span>
                    <span className="font-mono text-[9px] text-white/35">{isPhoneLayout ? 'MOBILE LAYOUT' : 'LIVE SITE / EXTERNAL CONTENT'}</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.aside key={selected.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-w-0 flex-col border border-white/10 bg-white/[0.025] p-5 sm:p-6 xl:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#00DFC9]">PROJECT / {projectNumber}</span>
                <span className="border border-white/10 px-2 py-1 font-mono text-[9px] text-white/45">{selected.type}</span>
              </div>
              <h3 className="mt-7 text-2xl font-black leading-tight text-white sm:text-3xl">{selected.name}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{selected.summary}</p>
              <p className="mt-4 border-l-2 border-[#FF5575] pl-3 text-xs leading-6 text-white/45">{selected.detail}</p>
              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">Inside the experience</p>
                <ul className="space-y-3">
                  {selected.annotations.map((annotation) => <li key={annotation} className="flex items-start gap-2.5 text-xs leading-5 text-white/65"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5575]" />{annotation}</li>)}
                </ul>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                <button type="button" onClick={() => changeProject(activeProject - 1)} aria-label="Previous project" className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-white/65 transition-colors hover:border-white/40 hover:text-white"><ArrowLeft className="h-4 w-4" /></button>
                <span className="font-mono text-[10px] text-white/35">{projectNumber} / 05</span>
                <button type="button" onClick={() => changeProject(activeProject + 1)} aria-label="Next project" className="inline-flex h-10 w-10 items-center justify-center border border-[#FF5575]/50 bg-[#FF003C]/10 text-white transition-colors hover:bg-[#FF003C]/20"><ArrowRight className="h-4 w-4" /></button>
              </div>
              <a href={selected.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF003C] px-4 text-xs font-black tracking-[0.12em] text-white transition-colors hover:bg-[#ffb347] hover:text-black">VISIT LIVE WEBSITE <ExternalLink className="h-4 w-4" /></a>
            </motion.aside>
          </div>
          <p className="mt-5 text-[10px] leading-relaxed text-white/30">Live previews depend on each website allowing iframe embedding. If a site blocks embedded viewing, use its direct live-site link above.</p>
        </div>
      </section>
    </MotionConfig>
  );
};
