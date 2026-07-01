import { getDataProvider } from '../services'
import type { CustomerStats } from '../types'

export type { CustomerStats }

/** @deprecated import from `src/types` — kept for existing imports */
export function getCustomerMrr(customerId: string): number {
  return getDataProvider().getCustomerMrr(customerId)
}

export function getCustomerActiveSubscriptionCount(customerId: string): number {
  return getDataProvider()
    .listSubscriptions()
    .filter((s) => s.customerId === customerId && s.status === 'active').length
}

export function getCustomerLicensedUsers(customerId: string): number {
  return getDataProvider().getCustomerStats(customerId).licensedUsers
}

export function getCustomerStats(customerId: string): CustomerStats {
  return getDataProvider().getCustomerStats(customerId)
}

export function getPortfolioMrr(): number {
  return getDataProvider().getPortfolioMrr()
}

export { demoCustomerIds, isDemoCustomer } from '../services/repository'
