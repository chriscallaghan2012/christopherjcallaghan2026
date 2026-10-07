export const WEBSITE_CLASS_OFFER = {
  name: '60-minute Website Build Session',
  description: 'A 60-minute live online class using AI and design tools to plan a website, prototype an idea and learn the path to an MVP. No coding experience required.',
  currency: 'gbp',
  unitAmount: 14900,
  duration: '60 minutes'
} as const;

export const WEBSITE_CLASS_PRICE = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: WEBSITE_CLASS_OFFER.currency.toUpperCase()
}).format(WEBSITE_CLASS_OFFER.unitAmount / 100);