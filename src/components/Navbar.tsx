'use client';

import React, { useState } from 'react';
import { ScreenTab } from '../types';
import { Menu, X, ArrowUpRight, Cpu, Sparkles, Terminal } from 'lucide-react';

interface NavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenConsultation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: ScreenTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060608]/90 backdrop-blur-2xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Brand */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNav('home')}
          className="group flex items-center gap-2.5 sm:gap-3 text-left transition-transform duration-300 hover:scale-[1.02] shrink-0"
        >
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full p-[2px] bg-gradient-to-tr from-[#FF003C] via-purple-600 to-amber-400 shadow-[0_0_20px_rgba(255,0,60,0.35)] shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-black font-black text-white text-xs sm:text-sm tracking-tighter">
              CJC
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base lg:text-sm xl:text-base tracking-tight text-white group-hover:text-[#FF003C] transition-colors whitespace-nowrap">
              <span className="hidden xl:inline">Christopher J. Callaghan</span>
              <span className="inline xl:hidden">Christopher Callaghan</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                Digital_Architect
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation (Optimized for 1024px+ with zero squeezing) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mx-2">
          <button
            id="nav-overview-btn"
            onClick={() => handleNav('home')}
            className={`shrink-0 whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === 'home'
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>

          <button
            id="nav-whole-package-btn"
            onClick={() => handleNav('package')}
            className={`shrink-0 flex items-center gap-1.5 px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              currentTab === 'package'
                ? 'bg-gradient-to-r from-[#FF003C] to-purple-600 text-white shadow-[0_0_20px_rgba(255,0,60,0.4)]'
                : 'text-white/85 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF003C] animate-pulse" />
            <span>The Whole Package</span>
          </button>

          <button
            id="nav-projects-btn"
            onClick={() => handleNav('projects')}
            className={`shrink-0 whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === 'projects'
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Projects
          </button>

          <button
            id="nav-services-btn"
            onClick={() => handleNav('services')}
            className={`shrink-0 whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === 'services'
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Services
          </button>

          <button
            id="nav-expertise-btn"
            onClick={() => handleNav('expertise')}
            className={`hidden shrink-0 whitespace-nowrap xl:block px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === 'expertise'
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Expertise
          </button>

          <button
            id="nav-tool-btn"
            onClick={() => handleNav('ai-tool')}
            className={`shrink-0 flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              currentTab === 'ai-tool'
                ? 'bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]/40 shadow-[0_0_15px_rgba(255,0,60,0.2)]'
                : 'text-white/60 hover:text-[#FF003C] hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF003C]" />
            <span>AI Studio</span>
          </button>

          <button
            id="nav-email-sandbox-btn"
            onClick={() => handleNav('email-sandbox')}
            className={`hidden shrink-0 whitespace-nowrap xl:flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === 'email-sandbox'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'text-white/60 hover:text-cyan-400 hover:bg-white/5'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Email Sandbox</span>
          </button>
        </nav>

        {/* Action Button & Contact */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <button
            id="nav-contact-btn"
            onClick={() => handleNav('contact')}
            className="hidden shrink-0 whitespace-nowrap xl:block px-4 xl:px-5 py-2 xl:py-2.5 rounded-full border border-white/15 text-[10px] xl:text-[11px] uppercase tracking-[0.2em] font-bold text-white/80 hover:border-[#FF003C] hover:text-[#FF003C] transition-all hover:bg-[#FF003C]/5"
          >
            Contact
          </button>
          <button
            id="nav-consultation-btn"
            onClick={onOpenConsultation}
            className="group shrink-0 relative flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2 xl:py-2.5 rounded-full bg-[#FF003C] text-white text-[10px] xl:text-[11px] uppercase tracking-[0.2em] font-black shadow-[0_0_25px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.6)] transition-all hover:scale-105 active:scale-95 whitespace-nowrap min-h-[38px] xl:min-h-[42px]"
          >
            <span>Start Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile & iPad Tablet Header Controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            id="mobile-consultation-quick-btn"
            onClick={onOpenConsultation}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF003C] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm"
          >
            <span>Consultation</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
          <button
            id="mobile-tool-quick-btn"
            onClick={() => handleNav('ai-tool')}
            className="p-2.5 text-[#FF003C] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="AI Studio"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & iPad Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="border-b border-white/10 bg-[#08080c]/98 backdrop-blur-2xl px-5 sm:px-8 py-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#FF003C]" />
                Navigation Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available Q1
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleNav('home')}
                className={`text-left px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] flex items-center ${
                  currentTab === 'home' ? 'bg-[#FF003C]/20 text-white border border-[#FF003C]/40' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => handleNav('package')}
                className={`flex items-center justify-between text-left px-4 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] ${
                  currentTab === 'package' ? 'bg-[#FF003C] text-white shadow-lg' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF003C] animate-pulse" />
                  The Whole Package
                </span>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-[#FF003C]/20 border border-[#FF003C]/30 text-white font-mono">
                  Setup • Ads • Funding (Up to £25k+)
                </span>
              </button>

              <button
                onClick={() => handleNav('projects')}
                className={`text-left px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] flex items-center ${
                  currentTab === 'projects' ? 'bg-[#FF003C]/20 text-white border border-[#FF003C]/40' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Projects Archive (11+ Systems)
              </button>

              <button
                onClick={() => handleNav('services')}
                className={`text-left px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] flex items-center ${
                  currentTab === 'services' ? 'bg-[#FF003C]/20 text-white border border-[#FF003C]/40' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Services & Systems
              </button>

              <button
                onClick={() => handleNav('expertise')}
                className={`text-left px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] flex items-center ${
                  currentTab === 'expertise' ? 'bg-[#FF003C]/20 text-white border border-[#FF003C]/40' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Core Architecture Pillars
              </button>

              <button
                onClick={() => handleNav('ai-tool')}
                className={`flex items-center justify-between text-left px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] ${
                  currentTab === 'ai-tool' ? 'bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]/40' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF003C]" />
                  AI Architecture Studio
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]/30 font-mono">Interactive</span>
              </button>

              <button
                onClick={() => handleNav('contact')}
                className={`text-left px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all min-h-[48px] flex items-center ${
                  currentTab === 'contact' ? 'bg-[#FF003C]/20 text-white border border-[#FF003C]/40' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Direct Contact & Inquiry
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-4 rounded-xl bg-[#FF003C] text-white font-black uppercase tracking-widest text-xs shadow-[0_0_25px_rgba(255,0,60,0.4)] flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
              >
                <span>Schedule Project Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
