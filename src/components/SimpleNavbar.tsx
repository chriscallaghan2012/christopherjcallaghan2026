'use client';

import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { ScreenTab } from '../types';

interface SimpleNavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ currentTab, onSelectTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const selectWork = () => {
    onSelectTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  const links = [
    { label: 'HOME', href: '/' },
    { label: 'BUILD', href: '/build' },
    { label: 'START', href: '/start' },
    { label: 'WORK', action: selectWork },
    { label: 'BLOG', href: '/blog' },
    { label: 'ABOUT', href: '/about' },
    { label: 'SEO', href: '/seo' },
    { label: 'GOOGLE MAPS', href: '/google-maps' },
    { label: 'PPC', href: '/ppc' },
    { label: 'SOCIAL', href: '/social-media' },
    { label: 'CONTACT', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060608]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-3 text-left" aria-label="Christopher J. Callaghan home">
          <span className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/60 bg-[#FF003C]/10 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(255,0,60,0.16)]">CJC</span>
          <span className="hidden text-sm font-bold tracking-tight text-white sm:block">Christopher J. Callaghan</span>
        </a>

        <nav className="hidden items-center gap-3 2xl:flex" aria-label="Main navigation">
          {links.map((link) => (
            link.href
              ? <a key={link.label} href={link.href} className="whitespace-nowrap font-mono text-[9px] font-bold tracking-[0.12em] text-white/60 transition-colors hover:text-[#FF003C]">{link.label}</a>
              : <button key={link.label} onClick={link.action} className={`whitespace-nowrap font-mono text-[9px] font-bold tracking-[0.12em] transition-colors hover:text-[#FF003C] ${link.label === 'WORK' && currentTab === 'projects' ? 'text-[#FF003C]' : 'text-white/60'}`}>{link.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => { onSelectTab('build'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex min-h-10 items-center gap-2 bg-[#FF003C] px-4 text-[10px] font-black tracking-[0.12em] text-white shadow-[0_0_22px_rgba(255,0,60,0.25)] transition-all hover:shadow-[0_0_32px_rgba(255,0,60,0.45)]">
            LET&apos;S BUILD <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center border border-white/15 text-white 2xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && <nav className="border-t border-white/10 bg-[#08080a] px-5 py-3 2xl:hidden" aria-label="Mobile navigation">
        {links.map((link) => link.href
              ? <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 w-full items-center justify-center border-b border-white/[0.07] text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">{link.label}</a>
              : <button key={link.label} onClick={() => { link.action?.(); setMenuOpen(false); }} className="block min-h-12 w-full border-b border-white/[0.07] text-center font-mono text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:text-[#FF003C]">{link.label}</button>
        )}
      </nav>}
    </header>
  );
};