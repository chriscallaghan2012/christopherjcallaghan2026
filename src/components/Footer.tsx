import React from 'react';
import { ScreenTab } from '../types';
import { Github, Linkedin, Twitter, Shield, Terminal, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: ScreenTab) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white/[0.02] backdrop-blur-xl border-t border-white/10 pt-20 pb-12 text-left relative z-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-6 items-start">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="rounded-full p-0.5 bg-gradient-to-r from-[#FF003C] via-purple-500 to-yellow-300">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center font-black text-white text-base shadow-[0_0_20px_rgba(255,0,60,0.3)]">
                  CJC
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter text-white block">
                  C.J.C
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  Digital_Architect
                </span>
              </div>
            </button>

            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Architecting next-generation digital experiences through code, creativity, and AI.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-white/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Based in Manchester, UK</span>
            </div>
          </div>

          {/* Column 2: Expertise */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Expertise
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('expertise')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  AI Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('expertise')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  Marketing Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('expertise')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  Platform Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('expertise')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  Integrations & APIs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Network */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Network
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('package')}
                  className="text-sm font-bold text-[#FF003C] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF003C] animate-pulse" />
                  <span>The Whole Package</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  About & Track Record
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  Projects Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  Services & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-tool')}
                  className="text-sm text-[#FF003C] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>AI Architecture Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('email-sandbox')}
                  className="text-sm text-white/60 hover:text-cyan-400 transition-colors"
                >
                  Email Sandbox
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-sm text-white/60 hover:text-[#FF003C] transition-colors"
                >
                  Contact & Inquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Connect
            </h4>
            <div className="flex items-center gap-3 mb-6">
              <a
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                href="https://github.com"
                className="inline-flex items-center justify-center h-10 w-10 text-white/40 hover:text-[#FF003C] hover:bg-white/5 rounded-xl border border-white/5 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                href="https://www.linkedin.com/in/webdevelopermanchester/"
                className="inline-flex items-center justify-center h-10 w-10 text-white/40 hover:text-[#FF003C] hover:bg-white/5 rounded-xl border border-white/5 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                href="https://twitter.com"
                className="inline-flex items-center justify-center h-10 w-10 text-white/40 hover:text-[#FF003C] hover:bg-white/5 rounded-xl border border-white/5 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            <button
              onClick={onOpenConsultation}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF003C]/50 text-xs font-mono font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>Instant Consultation</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">
            © 2026 Christopher J. Callaghan. Built for the future.
          </span>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors font-mono flex items-center gap-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
            <span className="text-white/10">|</span>
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-400" />
              Secure Admin Portal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
