import { BlogSiteHeader } from './BlogSiteHeader';

const FOOTER_LINKS = [
  {
    title: 'Site',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/projects', label: 'Work' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' }
    ]
  },
  {
    title: 'Build',
    links: [
      { href: '/start', label: 'Start a business' },
      { href: '/build', label: 'Project brief' },
      { href: '/classes', label: '1:1 classes' }
    ]
  },
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'All services' },
      { href: '/web-design-development', label: 'Web design' },
      { href: '/seo-services', label: 'SEO' },
      { href: '/app-development', label: 'App development' },
      { href: '/ai-automation', label: 'AI & automation' }
    ]
  }
];

export function BlogHeader() {
  return <BlogSiteHeader />;
}

export function BlogFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-10 md:px-8 lg:grid-cols-[minmax(220px,1fr)_2fr] lg:gap-14">
        <div>
          <a href="/" className="flex items-center gap-3" aria-label="Christopher J. Callaghan home">
            <img src="/icon.svg" alt="" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-sm font-bold text-white">Christopher J. Callaghan</span>
          </a>
          <p className="mt-3 max-w-xs font-mono text-[11px] leading-relaxed text-white/65">I build things on the internet. Based in Manchester, UK.</p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
          {FOOTER_LINKS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">{title}</h2>
              <ul className="mt-3 space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="font-mono text-[11px] text-white/70 transition-colors hover:text-[#FFB347]">{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>© {new Date().getFullYear()} Christopher J. Callaghan. All rights reserved.</span>
          <span>Manchester, United Kingdom</span>
        </div>
      </div>
    </footer>
  );
}