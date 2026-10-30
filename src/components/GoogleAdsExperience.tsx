import React from 'react';
import { ArrowRight, BarChart3, CheckCircle2, MousePointer2, Search, Target, Wallet, MousePointerClick } from 'lucide-react';

const adResults = [
  {
    label: 'Sponsored · Example business',
    title: 'Local Electrician | Fast, Reliable Call-Outs',
    url: 'www.example-business.co.uk/electrician',
    description: 'Need an electrician? Clear service information, trusted local support and an easy way to request a quote.',
    sitelinks: ['Emergency call-outs', 'Domestic services', 'Get a quote'],
    accent: 'border-l-[#4285F4]'
  },
  {
    label: 'Sponsored · Example business',
    title: 'Website Design for Small Businesses | Get a Clear Quote',
    url: 'www.example-studio.co.uk/web-design',
    description: 'Websites built around your business goals. Explore services, recent work and the next step for your project.',
    sitelinks: ['Web design', 'Recent projects', 'Book a consultation'],
    accent: 'border-l-[#34A853]'
  }
];

const campaignSteps = [
  { number: '01', title: 'Understand the search', text: 'Find out what people are looking for, where they are and what action matters to your business.', icon: Search },
  { number: '02', title: 'Build the campaign', text: 'Group related keywords, write relevant ads, set locations and shape a sensible budget.', icon: Target },
  { number: '03', title: 'Send clicks to the right page', text: 'Match the promise in the advert to a focused landing page with a clear next step.', icon: MousePointerClick },
  { number: '04', title: 'Measure and improve', text: 'Track meaningful enquiries, review search terms and move spend towards what is working.', icon: BarChart3 }
];

const managementAreas = [
  ['Campaign strategy', 'Goals, audience, locations, campaign structure and priorities.'],
  ['Keyword and search-term work', 'Relevant intent, negative keywords and regular waste checks.'],
  ['Ad copy and assets', 'Clear messaging, useful extensions and a stronger reason to choose you.'],
  ['Landing-page alignment', 'A consistent journey from the search to the page and enquiry.'],
  ['Budget and bidding checks', 'Spend controls, bidding approach and decisions based on enough evidence.'],
  ['Conversion measurement', 'Forms, calls and agreed actions checked so reporting reflects real outcomes.']
];

export const GoogleAdsExperience: React.FC = () => (
  <div className="google-ads-experience mt-14 md:mt-20">
    <section aria-labelledby="google-ads-search-demo" className="relative overflow-hidden border-y border-white/10 bg-[#080b12] py-12 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-0 h-96 w-96 bg-[#4285F4]/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#8ab4f8]">PAID SEARCH / SEE THE PLACEMENT</p>
            <h2 id="google-ads-search-demo" className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">Your advert. In the moment someone is searching.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 md:text-base">A search ad can put your business in front of people actively looking for a service. Here is an illustrative search-results view showing how sponsored placements can appear.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 border border-[#8ab4f8]/25 bg-[#4285F4]/[.08] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[.12em] text-[#a8c7fa]"><span className="h-2 w-2 animate-pulse bg-[#8ab4f8]" /> Sponsored placement preview</span>
        </div>

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <div className="overflow-hidden border border-white/10 bg-[#f8fafd] text-[#202124] shadow-[0_24px_80px_rgba(0,0,0,.35)]">
            <div className="flex items-center gap-3 border-b border-[#dadce0] px-4 py-4 sm:px-7">
              <span className="text-xl font-medium tracking-tight text-[#4285F4]">Search</span>
              <div className="flex min-w-0 flex-1 items-center gap-3 border border-[#dadce0] bg-white px-4 py-3 shadow-sm">
                <Search className="h-4 w-4 shrink-0 text-[#5f6368]" />
                <span className="truncate text-sm text-[#3c4043]">best service near me</span>
                <span className="ml-auto hidden text-xs text-[#5f6368] sm:block">⌕</span>
              </div>
            </div>
            <div className="mx-auto max-w-3xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mb-5 flex items-center justify-between border-b border-[#e8eaed] pb-3 text-[10px] text-[#70757a]">
                <span>Search results · Example preview</span><span>Illustrative only</span>
              </div>
              <div className="space-y-4">
                {adResults.map((ad, index) => (
                  <article key={ad.title} className={`google-ad-result border-l-[3px] ${ad.accent} border-y border-r border-[#e8eaed] bg-white p-4 sm:p-5`} style={{ animationDelay: `${index * 420}ms` }}>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5f6368]"><span className="border border-[#dadce0] px-1.5 py-0.5 font-semibold text-[#3c4043]">Ad</span><span>{ad.label}</span></div>
                    <p className="mt-2 break-all text-[11px] text-[#188038]">{ad.url}</p>
                    <h3 className="mt-1 text-lg font-medium leading-snug text-[#1a0dab] sm:text-xl">{ad.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4d5156]">{ad.description}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#f1f3f4] pt-3">
                      {ad.sitelinks.map((link) => <span key={link} className="text-xs font-medium text-[#1a0dab]">{link}</span>)}
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 border-t border-[#e8eaed] pt-5 opacity-65">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#70757a]">Organic result · Not an advert</p>
                <p className="mt-2 text-sm text-[#188038]">www.example-directory.co.uk</p>
                <p className="mt-1 text-base text-[#1a0dab]">Helpful local information and service pages</p>
                <p className="mt-1 text-xs leading-5 text-[#5f6368]">Organic listings are earned through search visibility rather than purchased ad placements.</p>
              </div>
            </div>
          </div>

          <aside className="border border-white/10 bg-white/[.035] p-5 sm:p-7">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#8ab4f8]">WHAT HAPPENS IN THE AUCTION?</p>
            <h3 className="mt-3 text-2xl font-black text-white">Relevant ads compete for the placement.</h3>
            <p className="mt-4 text-sm leading-7 text-white/60">When someone searches, Google runs an auction. Eligibility, bid, ad quality, expected impact of assets and context all influence whether an ad can show and where it appears.</p>
            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
              {[
                ['Search intent', 'Does the keyword and advert match what the person needs?'],
                ['Ad quality', 'Is the message useful and does the landing page deliver on it?'],
                ['Budget and bid', 'What are you prepared to pay for a relevant opportunity?']
              ].map(([title, body]) => <div key={title}><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-white/50">{body}</p></div>)}
            </div>
            <p className="mt-6 border-l-2 border-[#8ab4f8] bg-[#4285F4]/[.08] px-4 py-3 text-xs leading-5 text-white/65">This is a designed demonstration, not a live Google results page or a promise of a specific ad position.</p>
          </aside>
        </div>
      </div>
    </section>

    <section aria-labelledby="ads-process-title" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24 xl:px-12">
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#00DFC9]">HOW IT WORKS</p>
          <h2 id="ads-process-title" className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">From search to a real business enquiry.</h2>
          <p className="mt-5 text-sm leading-7 text-white/60 md:text-base">Good Google Ads management is more than switching campaigns on. The targeting, advert, landing page and measurement all need to work together.</p>
        </div>
        <ol className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {campaignSteps.map((step) => {
            const Icon = step.icon;
            return <li key={step.number} className="bg-[#0b0b10] p-5 sm:p-7">
              <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-[#00DFC9]">{step.number} / STEP</span><Icon className="h-5 w-5 text-[#8ab4f8]" aria-hidden="true" /></div>
              <h3 className="mt-5 text-xl font-black text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{step.text}</p>
            </li>;
          })}
        </ol>
      </div>
    </section>

    <section aria-labelledby="ads-management-title" className="border-y border-white/10 bg-[#0a0b11] py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#DF80FF]">WHAT I CAN MANAGE</p><h2 id="ads-management-title" className="mt-3 max-w-3xl text-3xl font-black text-white sm:text-4xl md:text-5xl">A joined-up approach to paid search.</h2></div>
          <p className="max-w-md text-sm leading-6 text-white/55">Campaign decisions should support the commercial goal, not just produce a dashboard full of clicks.</p>
        </div>
        <div className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
          {managementAreas.map(([title, description], index) => <article key={title} className="border-t border-white/10 py-6">
            <span className="font-mono text-[10px] font-bold text-[#DF80FF]">0{index + 1} / AREA</span>
            <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section aria-labelledby="ads-fit-title" className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24 xl:px-12">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">BUILT AROUND YOUR BUSINESS</p>
        <h2 id="ads-fit-title" className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">The right campaign depends on what you sell.</h2>
        <p className="mt-5 text-sm leading-7 text-white/60">A local service business, an online shop and a specialist B2B company should not all run the same campaign. The structure starts with the customer, the offer, the location and the action you want them to take.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Local services', 'Calls, quote requests and service-area enquiries.'],
          ['E-commerce', 'Product discovery, purchase intent and measured sales.'],
          ['Professional services', 'Qualified leads, consultation requests and clear trust signals.'],
          ['B2B and specialist offers', 'Narrower intent, considered journeys and lead quality feedback.']
        ].map(([title, body]) => <article key={title} className="border border-white/10 bg-white/[.025] p-5"><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{body}</p></article>)}
      </div>
    </section>

    <section aria-labelledby="ads-principles-title" className="border-y border-white/10 bg-white/[.02] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:grid-cols-[.8fr_1.2fr] md:px-8 xl:px-12">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#00DFC9]">NO VANITY METRICS</p><h2 id="ads-principles-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">Spend should be accountable.</h2><p className="mt-5 text-sm leading-7 text-white/60">Clicks and impressions help explain activity. They do not, on their own, tell you whether the campaign is generating useful business.</p></div>
        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {[
            ['Cost per lead', 'What does it cost to generate an enquiry that meets the agreed criteria?'],
            ['Lead quality', 'Are the calls and forms relevant, reachable and commercially useful?'],
            ['Conversion rate', 'Which searches and landing pages lead people to take action?'],
            ['Return and value', 'Where reliable revenue data exists, what value comes back against ad spend?']
          ].map(([title, body]) => <div key={title} className="bg-[#09090d] p-5"><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{body}</p></div>)}
        </div>
      </div>
    </section>

    <section aria-label="Google Ads management principles" className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-20 xl:px-12">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [Wallet, 'Your budget stays visible', 'Agree a spend limit and keep media spend separate from management fees.'],
          [CheckCircle2, 'Tracking gets checked', 'Do not optimise around conversions until the events are tested and meaningful.'],
          [MousePointer2, 'You keep control', 'Clear reporting, account access and decisions explained in plain English.']
        ].map(([Icon, title, body]) => {
          const ItemIcon = Icon as React.ComponentType<{ className?: string }>;
          return <article key={String(title)} className="border-t border-white/10 py-5"><ItemIcon className="h-5 w-5 text-[#8ab4f8]" aria-hidden="true" /><h3 className="mt-4 text-lg font-black text-white">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-white/55">{String(body)}</p></article>;
        })}
      </div>
    </section>
  </div>
);
