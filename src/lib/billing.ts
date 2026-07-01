import type { BillingCycle, Product } from '../types'

/** Round to 2 decimal places (AUD) */
export function roundAud(amount: number): number {
  return Math.round(amount * 100) / 100
}

/**
 * Monthly Recurring Revenue for a seat-based subscription.
 * MRR always uses the monthly list price × seats, regardless of billing cycle.
 * (Annual billing affects cash flow, not the normalized MRR figure.)
 */
export function calcSeatMrr(seats: number, priceMonthly: number): number {
  return roundAud(seats * priceMonthly)
}

/**
 * For annual prepay display: total annual charge = seats × priceAnnual
 */
export function calcAnnualTotal(seats: number, priceAnnual: number): number {
  return roundAud(seats * priceAnnual)
}

/**
 * Reseller margin on a monthly amount (what the partner earns per month).
 */
export function calcResellerMargin(mrr: number, marginPercent: number): number {
  return roundAud(mrr * (marginPercent / 100))
}

export function calcSubscriptionMrr(
  product: Product,
  seats: number,
  billingCycle: BillingCycle,
  consumptionMrr?: number
): number {
  if (product.priceMonthly === 0) {
    return consumptionMrr ?? 0
  }
  // billing cycle doesn't change MRR normalisation in this demo
  void billingCycle
  return calcSeatMrr(seats, product.priceMonthly)
}

export function licenseUtilization(assigned: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((assigned / total) * 100)
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
