# Business Card Creator — implementation notes

- Public route: `/tools/business-card-creator`
- Standalone browser-side editor; no account, API key or server persistence required.
- Editable name, professional title, services, email, phone/WhatsApp, website and brand name.
- Three themes, front/back preview, PNG and SVG downloads, and browser print/save-to-PDF.
- Default details use the site owner's public business email and domain; phone is intentionally blank rather than inventing a number.
- Print production note: confirm bleed, safe area, dimensions and colour profile with the selected printer.
- QA before merge: mobile layout, PNG export in Safari/Chrome, SVG opening, print dialog, keyboard operation, route metadata, tools directory and navigation visibility.
- No deployment or merge is part of this branch task.
