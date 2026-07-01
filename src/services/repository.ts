/**
 * Synchronous repository facade over the active data provider.
 * Demo mode (default) behaves identically to direct mock imports.
 */
import { getDataProvider } from './index'
import type { CustomerStats } from '../types'

export function listProducts() {
  return getDataProvider().listProducts()
}

export function getMarketplaceStats() {
  return getDataProvider().getMarketplaceStats()
}

export function listSubscriptions() {
  return getDataProvider().listSubscriptions()
}

export function listSubscriptionsForCustomer(customerId: string) {
  return getDataProvider().listSubscriptionsForCustomer(customerId)
}

export function listActivities() {
  return getDataProvider().listActivities()
}

export function getResellerProfile() {
  return getDataProvider().getResellerProfile()
}

export function getPortfolioSummary() {
  return getDataProvider().getPortfolioSummary()
}

export function listIntegrations() {
  return getDataProvider().listIntegrations()
}

export function listResellerTeam() {
  return getDataProvider().listResellerTeam()
}

export function listPortalAccounts() {
  return getDataProvider().listPortalAccounts()
}

export function getUsersForCustomer(customerId: string) {
  return getDataProvider().getUsersForCustomer(customerId)
}

export function getLicensesForCustomer(customerId: string) {
  return getDataProvider().getLicensesForCustomer(customerId)
}

export function isConsumptionSku(sku: string) {
  return getDataProvider().isConsumptionSku(sku)
}

export function getCustomerStats(customerId: string): CustomerStats {
  return getDataProvider().getCustomerStats(customerId)
}

export function getCustomerMrr(customerId: string) {
  return getDataProvider().getCustomerMrr(customerId)
}

export function getPortfolioMrr() {
  return getDataProvider().getPortfolioMrr()
}

export const demoCustomerIds = ['cust-001', 'cust-002', 'cust-003'] as const

export function isDemoCustomer(customerId: string): boolean {
  return (demoCustomerIds as readonly string[]).includes(customerId)
}
