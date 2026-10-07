import React from 'react';
import { ArrowUp, Github, Linkedin } from 'lucide-react';
import { ScreenTab } from '../types';

interface SimpleFooterProps {
  onNavigate: (tab: ScreenTab) => void;
}

export const SimpleFooter: React.FC<SimpleFooterProps> = ({ onNavigate }) => (
  <footer className="relative z-10 border-t border-white/10 bg-black/40">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <p className="text-sm font-bold text-white">Christopher J. Callaghan</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65">I build things on the internet.</p>
      </div>
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Footer navigation">
        <button onClick={() => onNavigate('home')} className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/55 transition-colors hover:text-[#FF003C]">HOME</button>
        <a href="/about" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">ABOUT</a>
        <a href="/classes" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">1:1 CLASSES</a>
        <button onClick={() => onNavigate('projects')} className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/55 transition-colors hover:text-[#FF003C]">WORK</button>
        <a href="/seo-services" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">SEO</a>
        <a href="/local-seo" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">LOCAL SEO</a>
        <a href="/google-ads-management" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">GOOGLE ADS</a>
        <a href="/social-media-marketing" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">SOCIAL</a>
        <a href="/web-design-development" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">WEB DESIGN</a>
        <a href="/contact" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">CONTACT</a>
        <a href="/blog" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-[#FF003C]">BLOG</a>
        <a href="https://www.linkedin.com/in/webdevelopermanchester/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-white/65 transition-colors hover:text-[#FF003C]"><Linkedin className="h-4 w-4" /></a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/65 transition-colors hover:text-[#FF003C]"><Github className="h-4 w-4" /></a>
      </nav>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 self-start font-mono text-[10px] font-bold tracking-[0.14em] text-white/65 transition-colors hover:text-white md:self-auto">BACK TO TOP <ArrowUp className="h-3.5 w-3.5" /></button>
    </div>
    <div className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <span>© {new Date().getFullYear()} Christopher J. Callaghan. All rights reserved.</span>
        <span>Manchester, United Kingdom</span>
      </div>
    </div>
  </footer>
);