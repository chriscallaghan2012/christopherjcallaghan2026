export const WEBSITE_CLASS_OFFER = {
  name: '60-minute Website Build Session',
  description: 'A live one-to-one online session to plan and build a website together. No coding experience required.',
  currency: 'gbp',
  unitAmount: 9900,
  duration: '60 minutes'
} as const;

export const WEBSITE_CLASS_PRICE = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: WEBSITE_CLASS_OFFER.currency.toUpperCase()
}).format(WEBSITE_CLASS_OFFER.unitAmount / 100);