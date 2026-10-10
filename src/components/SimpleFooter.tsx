import React from 'react';
import { ArrowUp, Github, Linkedin } from 'lucide-react';
import { ScreenTab } from '../types';
import { ACADEMY_URL } from '../../lib/academy';

interface SimpleFooterProps {
  onNavigate: (tab: ScreenTab) => void;
}

export const SimpleFooter: React.FC<SimpleFooterProps> = ({ onNavigate }) => (
  <footer className="relative z-10 border-t border-white/10 bg-black/40">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:px-8 lg:grid-cols-[190px_minmax(0,1fr)_auto] lg:items-start">
      <div>
        <p className="text-sm font-bold text-white">Christopher J. Callaghan</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65">I build things on the internet.</p>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3">
        <nav aria-label="Site links">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Site</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start lg:gap-y-2.5">
            <button onClick={() => onNavigate('home')} className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">HOME</button>
            <a href="/about" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">ABOUT</a>
            <button onClick={() => onNavigate('projects')} className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">WORK</button>
            <a href="/contact" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">CONTACT</a>
            <a href="/blog" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">BLOG</a>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <a href="https://www.linkedin.com/in/webdevelopermanchester/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-white/65 transition-colors hover:text-[#FF003C]"><Linkedin className="h-4 w-4" /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/65 transition-colors hover:text-[#FF003C]"><Github className="h-4 w-4" /></a>
          </div>
        </nav>
        <nav aria-label="Learning links">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Learn</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start lg:gap-y-2.5">
            <a href="/classes" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">1:1 CLASSES</a>
            <a href={ACADEMY_URL} target="_blank" rel="noreferrer" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">ACADEMY</a>
          </div>
        </nav>
        <nav aria-label="Services">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Services</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start lg:gap-y-2.5">
            <a href="/seo-services" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">SEO</a>
            <a href="/local-seo" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">LOCAL SEO</a>
            <a href="/google-ads-management" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">GOOGLE ADS</a>
            <a href="/social-media-marketing" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">SOCIAL</a>
            <a href="/web-design-development" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">WEB DESIGN</a>
            <a href="/agency-development-partner" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">AGENCY PARTNER</a>
            <a href="/app-development" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">APP DEVELOPMENT</a>
            <a href="/ai-automation" className="font-mono text-[10px] font-bold tracking-[0.12em] text-white/65 transition-colors hover:text-[#FF003C]">AI & AUTOMATION</a>
          </div>
        </nav>
      </div>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 self-start font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-white lg:self-auto">BACK TO TOP <ArrowUp className="h-3.5 w-3.5" /></button>
    </div>
    <div className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <span>© {new Date().getFullYear()} Christopher J. Callaghan. All rights reserved.</span>
        <span>Manchester, United Kingdom</span>
      </div>
    </div>
  </footer>
);