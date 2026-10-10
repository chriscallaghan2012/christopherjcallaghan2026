  const schema = {
    '@context': 'https://schema.org',
    '@id': 'https://christopherjcallaghan.com/#business',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    name: 'Christopher J. Callaghan — Web, Software & AI Development',
    alternateName: 'CJC Digital',
    description: 'Freelance professional service for full-stack web development, custom software, AI builders and SEO, PPC and digital marketing — a dedicated freelance partner building websites, apps, MVPs and AI systems.',
    url: 'https://christopherjcallaghan.com',
    logo: 'https://christopherjcallaghan.com/assets/cjc-social-preview.svg',
    image: ['https://christopherjcallaghan.com/assets/cjc-social-preview.svg'],
    telephone: '+44 161 000 0000',
    email: 'hello@christopherjcallaghan.com',
    priceRange: '££',
    areaServed: [{ '@type': 'Place', name: 'Manchester' }, { '@type': 'Place', name: 'United Kingdom' }, { '@type': 'Place', name: 'Worldwide (remote)' }],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Manchester',
      addressLocality: 'Manchester',
      addressRegion: 'England',
      postalCode: 'M1',
      addressCountry: 'GB'
    },
    geo: { '@type': 'GeoCoordinates', latitude: 53.4808, longitude: -2.2426 },
    founder: { '@type': 'Person', name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com/#person', sameAs: ['https://www.linkedin.com/in/webdevelopermanchester/'] },
    sameAs: ['https://www.linkedin.com/in/webdevelopermanchester/'],
    knowsAbout: ['Web Development', 'Custom Software', 'AI Systems', 'AI Builders', 'Search Engine Optimisation', 'Pay-Per-Click Advertising', 'Digital Marketing', 'MVP Development', 'Automation']
  };