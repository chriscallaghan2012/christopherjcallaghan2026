import { ArrowUpRight, MessageCircle } from 'lucide-react';

const whatsappUrl = new URL('https://wa.me/447516391265');
whatsappUrl.searchParams.set('text', 'Hi Christopher, I would like to talk about a project.');

export function WhatsAppContact() {
  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6 max-sm:static max-sm:mx-auto max-sm:mb-5 max-sm:mt-5 max-sm:flex max-sm:w-full max-sm:max-w-6xl max-sm:justify-end max-sm:px-5 max-sm:pb-[env(safe-area-inset-bottom)]">
      <a
        href={whatsappUrl.toString()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Christopher on WhatsApp, opens in a new tab"
        className="group inline-flex min-h-14 items-center gap-3 border border-[#FF5575]/45 bg-[#100a0c]/95 px-4 text-white shadow-[0_14px_45px_rgba(0,0,0,0.38)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-[#FF5575] hover:bg-[#1b0b10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5575]"
      >
        <span className="flex h-9 w-9 items-center justify-center border border-[#FF5575]/35 bg-[#FF5575]/10 text-[#FF9BAC]">
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="grid gap-0.5 text-left">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#FF9BAC]">LET&apos;S TALK</span>
          <span className="text-sm font-semibold">Message on WhatsApp</span>
        </span>
        <ArrowUpRight aria-hidden="true" className="ml-1 h-4 w-4 text-white/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
