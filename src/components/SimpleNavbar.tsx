'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Code, MapPin, Menu, MousePointerClick, Search, Share2, X } from 'lucide-react';
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
  { href: '/social-media-marketing', label: 'Social Media Marketing', description: 'Content, audiences and campaign planning.', icon: Share2 }
];

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ currentTab, onSelectTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

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
        setMobileServicesOpen(false);
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
    setMobileServicesOpen(false);
  };

  const linksBefore: Array<{ label: string; href?: string; action?: () => void }> = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'START', href: '/start' },
    { label: 'BUILD', href: '/build' }
  ];

  const linksAfter: Array<{ label: string; href?: string; action?: () => void }> = [
    { label: 'WORK', action: selectWork },
    { label: 'CONTACT', href: '/contact' }
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
          <button className="flex h-10 w-10 items-center justify-center border border-white/15 text-white lg:hidden" onClick={() => { setMenuOpen(!menuOpen); setMobileServicesOpen(false); }} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && <nav className="border-t border-white/10 bg-[#08080a] px-5 py-4 lg:hidden" aria-label="Mobile navigation">
        <div className="mx-auto max-w-7xl space-y-1">
          {linksBefore.map((link) => (
            link.href
              ? <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 w-full items-center justify-center border-b border-white/[0.07] text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">{link.label}</a>
              : <button key={link.label} onClick={() => { link.action?.(); setMenuOpen(false); }} className="block min-h-12 w-full border-b border-white/[0.07] text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">{link.label}</button>
          ))}

          {/* Mobile services accordion */}
          <div className="border-b border-white/[0.07]">
            <button onClick={() => setMobileServicesOpen((open) => !open)} aria-expanded={mobileServicesOpen} aria-controls="mobile-services-list" className="flex min-h-12 w-full items-center justify-center gap-2 text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">
              SERVICES <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileServicesOpen && (
              <div id="mobile-services-list" className="space-y-1.5 pb-3 pt-1">
                {SERVICE_MENU.map(({ href, label, description, icon: Icon }) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-[#FF003C]/40 hover:bg-white/5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[#FF003C]"><Icon className="h-4 w-4" /></span>
                    <span>
                      <span className="block text-xs font-bold text-white">{label}</span>
                      <span className="block text-[10px] leading-snug text-white/50">{description}</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {linksAfter.map((link) => (
            link.href
              ? <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 w-full items-center justify-center border-b border-white/[0.07] text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">{link.label}</a>
              : <button key={link.label} onClick={() => { link.action?.(); setMenuOpen(false); }} className="block min-h-12 w-full border-b border-white/[0.07] text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">{link.label}</button>
          ))}
        </div>
      </nav>}
    </header>
  );
};