import { customers, subscriptions, products } from './mock'
import { roundAud } from '../lib/billing'

export interface CustomerStats {
  mrr: number
  activeSubscriptions: number
  licensedUsers: number
}

/** Sum of active subscription MRR for one customer */
export function getCustomerMrr(customerId: string): number {
  return roundAud(
    subscriptions
      .filter((s) => s.customerId === customerId && s.status === 'active')
      .reduce((sum, s) => sum + s.mrr, 0)
  )
}

export function getCustomerActiveSubscriptionCount(customerId: string): number {
  return subscriptions.filter((s) => s.customerId === customerId && s.status === 'active').length
}

/**
 * Primary productivity seat count — largest active seat-based subscription.
 * Used as the "Users" figure on customer cards when not overridden.
 */
export function getCustomerLicensedUsers(customerId: string): number {
  const customer = customers.find((c) => c.id === customerId)
  if (customer?.licensedUsers != null) return customer.licensedUsers

  const seatSubs = subscriptions
    .filter(
      (s) =>
        s.customerId === customerId &&
        s.status === 'active' &&
        s.seats > 1 &&
        products.find((p) => p.id === s.productId)?.priceMonthly
    )
    .sort((a, b) => b.seats - a.seats)

  return seatSubs[0]?.seats ?? 0
}

export function getCustomerStats(customerId: string): CustomerStats {
  const customer = customers.find((c) => c.id === customerId)
  return {
    mrr: getCustomerMrr(customerId),
    activeSubscriptions: getCustomerActiveSubscriptionCount(customerId),
    licensedUsers: customer?.licensedUsers ?? getCustomerLicensedUsers(customerId),
  }
}

/** Portfolio-wide active MRR across all customers */
export function getPortfolioMrr(): number {
  return roundAud(
    subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.mrr, 0)
  )
}

/** Demo customers to feature in walkthroughs (in order) */
export const demoCustomerIds = ['cust-001', 'cust-002', 'cust-003'] as const

export function isDemoCustomer(customerId: string): boolean {
  return (demoCustomerIds as readonly string[]).includes(customerId)
}
