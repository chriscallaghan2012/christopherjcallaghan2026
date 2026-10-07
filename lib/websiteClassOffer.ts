export const WEBSITE_CLASS_OFFERS = {
  session: {
    name: 'Flexible 60-minute Website Session',
    description: 'A live one-to-one online session. Choose any website, AI, design, prototype or build topic to work on together. No coding experience required.',
    currency: 'gbp',
    unitAmount: 14900,
    duration: '60 minutes'
  },
  bootcamp: {
    name: 'Website Design to MVP Bootcamp',
    description: 'Six live one-to-one online sessions, one hour each, covering AI-assisted design, prototyping, MVP building, Stripe, domain setup and code ownership.',
    currency: 'gbp',
    unitAmount: 79900,
    duration: '6 hours · 6 sessions'
  }
} as const;

export type WebsiteClassOfferId = keyof typeof WEBSITE_CLASS_OFFERS;

export const WEBSITE_CLASS_PRICE = new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP'
}).format(WEBSITE_CLASS_OFFERS.session.unitAmount / 100);

export const WEBSITE_BOOTCAMP_PRICE = new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP'
}).format(WEBSITE_CLASS_OFFERS.bootcamp.unitAmount / 100);