// Stripe Payment Links for featured listings.
// Created in the Stripe dashboard — replace each placeholder with the real
// https://buy.stripe.com/... URL. Each payment link should have metadata set
// in the dashboard: tier=basic, billing=monthly|annual, variant=founder|standard
// (the webhook reads this metadata to decrement founder slots and set the tier).
// Success URL for every link: https://floridaautismservices.com/featured/thank-you

export type StripeLinkKey =
  | 'basic_monthly_founder'
  | 'basic_annual_founder'
  | 'basic_monthly_standard'
  | 'basic_annual_standard';

export const STRIPE_PAYMENT_LINKS: Record<StripeLinkKey, string> = {
  basic_monthly_founder: 'https://buy.stripe.com/7sYeVdbXC2gg4XH7C36Vq0j',
  basic_annual_founder: 'https://buy.stripe.com/fZufZh2n2bQQbm54pR6Vq0k',
  basic_monthly_standard: 'https://buy.stripe.com/14AbJ11iY9II0HrcWn6Vq0l',
  basic_annual_standard: 'https://buy.stripe.com/00w5kD1iY7AAai1aOf6Vq0m',
};

export function isStripeLinkConfigured(key: StripeLinkKey): boolean {
  return STRIPE_PAYMENT_LINKS[key].startsWith('https://');
}

// resourceId (when known, e.g. upgrade links for existing providers) is passed
// as client_reference_id so the webhook can mark that listing featured.
export function getStripeLink(key: StripeLinkKey, resourceId?: string | number): string {
  const base = STRIPE_PAYMENT_LINKS[key];
  if (!isStripeLinkConfigured(key)) return base;
  return resourceId ? `${base}?client_reference_id=${resourceId}` : base;
}
