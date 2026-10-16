# Business Card Studio — implementation notes

- Public route: `/tools/business-card-creator`
- Standalone browser-side editor; no account, API key or server persistence required.
- Six selectable premium templates: Crimson Executive, Swiss Minimal, Ember Studio, Monogram Luxe, Split Consultant and Signal Grid.
- Editable name, professional title, services, email, phone/WhatsApp, website and brand name.
- Front/back artwork preview with a selectable UK standard trim size (85 × 55 mm) and US standard trim size (3.5 × 2 in / 88.9 × 50.8 mm).
- PNG exports render at 300 DPI. SVG exports retain vector artwork and include the selected physical dimensions.
- Optional 3 mm bleed is included on every edge in PNG/SVG exports; print dialog sizing follows the selected size and bleed setting.
- Default details use the site's public business email and domain; phone is intentionally blank rather than inventing a number.
- Artwork is RGB and does not include crop marks or certified PDF/X output. Users should confirm their print shop's bleed, colour profile and PDF requirements.
- QA covers template selection, editable details, SVG dimensions, PNG/SVG download events, print styling and mobile overflow.
