'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bot, BookOpen, BriefcaseBusiness, ChevronDown, Code, Home, Mail, MapPin, Menu, MousePointerClick, Rocket, Search, Share2, Smartphone, Users, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScreenTab } from '../types';

interface SimpleNavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

const SERVICE_MENU = [
  { href: '/web-design-development', label: 'Web Design & Development', description: 'Websites designed, built, fixed and maintained.', icon: Code },
  { href: '/seo-services', label: 'SEO Services', description: 'Technical SEO and search-focused websites.', icon: Search },
  { href: '/local-seo', label: 'Local SEO', description: 'Google Business Profile and local search.', icon: MapPin },
  { href: '/google-ads-management', label: 'Google Ads Management', description: 'Paid search campaigns that reach the right people.', icon: MousePointerClick },
  { href: '/social-media-marketing', label: 'Social Media Marketing', description: 'Content, audiences and campaign planning.', icon: Share2 },
  { href: '/agency-development-partner', label: 'Agency Development Partner', description: 'White-label delivery and dependable overflow capacity.', icon: Users },
  { href: '/app-development', label: 'iPhone & Android Apps', description: 'Mobile products from focused MVP to release.', icon: Smartphone },
  { href: '/ai-automation', label: 'AI & Business Automation', description: 'Useful AI integrations and connected workflows.', icon: Bot }
];

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ currentTab, onSelectTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('mobile-navigation-open');
    requestAnimationFrame(() => mobileCloseRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove('mobile-navigation-open');
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setServicesOpen(true);
  };

  const closeServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMenuOpen(false);
      }
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onDocumentClick);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const selectWork = () => {
    onSelectTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  const linksBefore: Array<{ label: string; href?: string; action?: () => void; description: string; icon: LucideIcon }> = [
    { label: 'HOME', href: '/', description: 'The work, ideas and services.', icon: Home },
    { label: 'ABOUT', href: '/about', description: 'Meet the person behind the work.', icon: Users },
    { label: 'START', href: '/start', description: 'Build the foundations for a business.', icon: Rocket },
    { label: 'BUILD', href: '/build', description: 'Turn a project idea into a brief.', icon: Code },
    { label: 'CLASSES', href: '/classes', description: 'Practical one-to-one learning.', icon: BookOpen }
  ];

  const linksAfter: Array<{ label: string; href?: string; action?: () => void; description: string; icon: LucideIcon }> = [
    { label: 'WORK', action: selectWork, description: 'Selected projects and case studies.', icon: BriefcaseBusiness },
    { label: 'CONTACT', href: '/contact', description: 'Talk through a problem or idea.', icon: Mail }
  ];

  const isOnServicePage = SERVICE_MENU.some((item) => currentTab === item.href.slice(1));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060608]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-3 text-left" aria-label="Christopher J. Callaghan home">
          <span className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/60 bg-[#FF003C]/10 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(255,0,60,0.16)]">CJC</span>
          <span className="hidden text-sm font-bold tracking-tight text-white sm:block">Christopher J. Callaghan</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {linksBefore.map((link) => (
            link.href
              ? <a key={link.label} href={link.href} className="whitespace-nowrap rounded px-2.5 py-2 font-mono text-[9px] font-bold tracking-[0.12em] text-white/60 transition-colors hover:bg-white/5 hover:text-[#FF003C]">{link.label}</a>
              : <button key={link.label} onClick={link.action} className={`whitespace-nowrap rounded px-2.5 py-2 font-mono text-[9px] font-bold tracking-[0.12em] transition-colors hover:bg-white/5 hover:text-[#FF003C] ${currentTab === 'projects' ? 'text-[#FF003C]' : 'text-white/60'}`}>{link.label}</button>
          ))}

          <div ref={servicesRef} className="relative" onMouseEnter={openServices} onMouseLeave={closeServices}>
            <button onClick={() => setServicesOpen((open) => !open)} aria-expanded={servicesOpen} aria-haspopup="true" aria-controls="services-mega-menu" className={`flex items-center gap-1 whitespace-nowrap rounded px-2.5 py-2 font-mono text-[9px] font-bold tracking-[0.12em] transition-colors hover:bg-white/5 hover:text-[#FF003C] ${isOnServicePage ? 'text-[#FF003C]' : 'text-white/60'}`}>
              SERVICES <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>

            {servicesOpen && (
              <div id="services-mega-menu" aria-label="Services menu" className="menu-panel fixed inset-x-0 top-[68px] z-[60] hidden border-b border-white/10 bg-[#08080a]/95 backdrop-blur-2xl lg:block" onMouseEnter={openServices} onMouseLeave={closeServices}>
                <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:px-8 lg:grid-cols-[1fr_280px]">
                  <div>
                    <div className="mb-5">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">Growth services</p>
                      <h2 className="mt-1 text-xl font-black text-white">Services &amp; growth</h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {SERVICE_MENU.map(({ href, label, description, icon: Icon }) => (
                        <a key={href} href={href} className="group relative flex min-h-[104px] flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-[#FF003C]/50 hover:bg-[#FF003C]/[0.05]">
                          <div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#FF003C] group-hover:border-[#FF003C]/40 group-hover:bg-[#FF003C]/10">
                              <Icon className="h-4 w-4" />
                            </div>
                            <p className="mt-3 text-sm font-bold text-white group-hover:text-[#FF003C]">{label}</p>
                            <p className="mt-1 text-xs leading-relaxed text-white/55">{description}</p>
                          </div>
                          <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-white/30 group-hover:text-[#FF003C]" />
                        </a>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-4 font-mono text-[10px] font-bold tracking-[0.14em]">
                      <a href="/build" className="text-white/70 hover:text-[#FF003C]">LET&apos;S BUILD</a>
                      <a href="/start" className="text-white/70 hover:text-[#FF003C]">START A BUSINESS</a>
                      <a href="/services" className="text-white/70 hover:text-[#FF003C]">ALL SERVICES</a>
                      <a href="/projects" className="text-white/70 hover:text-[#FF003C]">RECENT WORK</a>
                    </div>
                  </div>

                  <aside className="relative hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#FF003C]/20 via-black to-purple-600/10 p-6 lg:flex lg:flex-col">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FF003C]/20 blur-3xl" />
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">MOST ASKED</p>
                    <h3 className="mt-3 text-2xl font-black leading-tight text-white">Not sure what you need?</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">Tell me the problem or goal — no technical plan needed.</p>
                    <a href="/contact" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF003C] px-4 text-[10px] font-black tracking-[0.14em] text-white shadow-[0_0_20px_rgba(255,0,60,0.25)]">SEND AN ENQUIRY <ArrowRight className="h-3.5 w-3.5" /></a>
                    <a href="/build" className="mt-2.5 inline-flex min-h-11 items-center justify-center border border-white/20 px-4 text-[10px] font-bold tracking-[0.14em] text-white/80 hover:border-white/50 hover:text-white">SEND A PROJECT BRIEF</a>
                  </aside>
                </div>
              </div>
            )}
          </div>

          {linksAfter.map((link) => (
            link.href
              ? <a key={link.label} href={link.href} className="whitespace-nowrap rounded px-2.5 py-2 font-mono text-[9px] font-bold tracking-[0.12em] text-white/60 transition-colors hover:bg-white/5 hover:text-[#FF003C]">{link.label}</a>
              : <button key={link.label} onClick={link.action} className={`whitespace-nowrap rounded px-2.5 py-2 font-mono text-[9px] font-bold tracking-[0.12em] transition-colors hover:bg-white/5 hover:text-[#FF003C] ${currentTab === 'projects' ? 'text-[#FF003C]' : 'text-white/60'}`}>{link.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => { onSelectTab('build'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); }} className="group flex min-h-10 items-center gap-2 bg-[#FF003C] px-4 text-[10px] font-black tracking-[0.12em] text-white shadow-[0_0_22px_rgba(255,0,60,0.25)] transition-all hover:shadow-[0_0_32px_rgba(255,0,60,0.45)]">
            LET&apos;S BUILD <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
          <button ref={menuButtonRef} className="flex h-10 w-10 items-center justify-center border border-white/15 text-white lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && <motion.div
          id="mobile-navigation"
          role="dialog"
          aria-label="Mobile navigation"
          aria-modal="true"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 390, damping: 38 }}
          className="fixed inset-0 z-[70] flex min-h-dvh flex-col overflow-y-auto bg-[#070709] text-white shadow-2xl lg:hidden"
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return;
            const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
        >
          <div className="sticky top-0 z-10 flex min-h-[72px] items-center justify-between border-b border-white/10 bg-[#070709]/95 px-5 backdrop-blur-xl sm:px-8">
            <a href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3" aria-label="Christopher J. Callaghan home">
              <span className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/60 bg-[#FF003C]/10 font-mono text-xs font-bold text-white">CJC</span>
              <span>
                <span className="block text-sm font-bold text-white">Christopher J. Callaghan</span>
                <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">Navigation / Manchester, UK</span>
              </span>
            </a>
            <button ref={mobileCloseRef} onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-[#FF003C]/60 hover:text-[#FF5575]" aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-7 sm:px-8">
            <section aria-labelledby="mobile-main-links-title">
              <h2 id="mobile-main-links-title" className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Explore</h2>
              <div className="grid gap-x-5 sm:grid-cols-2">
                {linksBefore.map(({ label, href, action, description, icon: Icon }) => (
                  href ? (
                    <a key={label} href={href} onClick={() => setMenuOpen(false)} aria-current={currentTab === (href === '/' ? 'home' : href.slice(1)) ? 'page' : undefined} className="group flex min-h-[76px] items-center gap-3 border-b border-white/10 text-left transition-colors hover:text-[#FF5575]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#FF5575] transition-colors group-hover:border-[#FF003C]/45"><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[11px] font-bold tracking-[0.12em] text-white">{label}</span>
                        <span className="mt-1 block text-xs leading-snug text-white/50">{description}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-[#FF5575]" />
                    </a>
                  ) : <button key={label} onClick={() => { action?.(); setMenuOpen(false); }} className="flex min-h-[76px] items-center gap-3 border-b border-white/10 text-left transition-colors hover:text-[#FF5575]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#FF5575]"><Icon className="h-4 w-4" /></span>
                    <span><span className="block font-mono text-[11px] font-bold tracking-[0.12em] text-white">{label}</span><span className="mt-1 block text-xs leading-snug text-white/50">{description}</span></span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-white/25" />
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-8" aria-labelledby="mobile-services-title">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id="mobile-services-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">Services</h2>
                <a href="/services" onClick={() => setMenuOpen(false)} className="font-mono text-[9px] font-bold tracking-[0.12em] text-white/45 transition-colors hover:text-white">ALL SERVICES <ArrowRight className="ml-1 inline h-3 w-3" /></a>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVICE_MENU.map(({ href, label, description, icon: Icon }) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={currentTab === href.slice(1) ? 'page' : undefined} className="group flex min-h-[100px] items-start gap-3 border border-white/10 bg-white/[0.025] p-3 text-left transition-colors hover:border-[#FF003C]/45 hover:bg-[#FF003C]/[0.045]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/30 text-[#FF5575] group-hover:border-[#FF003C]/45"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className="block break-words text-xs font-bold leading-snug text-white group-hover:text-[#FF5575]">{label}</span>
                      <span className="mt-1.5 block text-[11px] leading-relaxed text-white/50">{description}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-8" aria-labelledby="mobile-more-title">
              <h2 id="mobile-more-title" className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">More</h2>
              <div className="grid gap-x-5 sm:grid-cols-2">
                {linksAfter.map(({ label, href, action, description, icon: Icon }) => (
                  href ? (
                    <a key={label} href={href} onClick={() => setMenuOpen(false)} aria-current={currentTab === href.slice(1) ? 'page' : undefined} className="group flex min-h-[76px] items-center gap-3 border-b border-white/10 text-left transition-colors hover:text-[#FF5575]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#FF5575]"><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1"><span className="block font-mono text-[11px] font-bold tracking-[0.12em] text-white">{label}</span><span className="mt-1 block text-xs leading-snug text-white/50">{description}</span></span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : <button key={label} onClick={() => { action?.(); setMenuOpen(false); }} className="flex min-h-[76px] items-center gap-3 border-b border-white/10 text-left transition-colors hover:text-[#FF5575]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#FF5575]"><Icon className="h-4 w-4" /></span>
                    <span><span className="block font-mono text-[11px] font-bold tracking-[0.12em] text-white">{label}</span><span className="mt-1 block text-xs leading-snug text-white/50">{description}</span></span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-white/25" />
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="border-t border-white/10 bg-black/30 px-5 py-5 sm:px-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">Have something in mind?</p>
                <p className="mt-1 text-xs text-white/50">Start with the goal. The technical plan can come later.</p>
              </div>
              <a href="/build" onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF003C] px-5 font-mono text-[10px] font-bold tracking-[0.12em] text-white transition-colors hover:bg-[#df0035]">START A PROJECT <ArrowRight className="h-3.5 w-3.5" /></a>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
};