'use client';

import { useState } from 'react';
import { ArrowUpRight, MessageCircle, X } from 'lucide-react';

const whatsappUrl = new URL('https://wa.me/447516391265');
whatsappUrl.searchParams.set('text', 'Hi Christopher, I would like to talk about a project.');

export function WhatsAppContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[70] sm:bottom-6 sm:right-6">
      <div className={`flex h-14 items-center justify-end overflow-hidden rounded-full border border-[#FF5575]/45 bg-[#100a0c]/95 shadow-[0_14px_45px_rgba(0,0,0,0.38)] backdrop-blur transition-[width] duration-300 motion-reduce:transition-none ${isOpen ? 'w-[min(20rem,calc(100vw-1.5rem))]' : 'w-14'}`}>
        {isOpen ? (
          <>
            <a
              href={whatsappUrl.toString()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 flex-1 items-center gap-2 pl-2 pr-1 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#FF5575]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#FF5575]/45 bg-[#FF5575]/10 text-[#FF9BAC]">
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="grid min-w-0 flex-1 gap-0.5 text-left">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#FF9BAC]">WHATSAPP</span>
                <span className="whitespace-nowrap text-sm font-semibold leading-tight">Send me a message</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-white/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp contact"
              title="Close"
              className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#FF5575]"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open WhatsApp contact"
            aria-expanded={false}
            title="Message on WhatsApp"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[#FF9BAC] transition-colors hover:bg-[#FF5575]/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#FF5575]"
          >
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
