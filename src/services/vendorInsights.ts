import type { CustomerVendorInsights, VendorSignal } from '../types/vendorInsights'
import {
  getCustomerVendorInsights,
  listPortfolioVendorSignals,
  listVendorSignalsForCustomer,
} from '../data/vendorInsightsMock'

export function fetchCustomerVendorInsights(customerId: string): CustomerVendorInsights | null {
  return getCustomerVendorInsights(customerId)
}

export function fetchPortfolioVendorSignals(): VendorSignal[] {
  return listPortfolioVendorSignals()
}

export function fetchVendorSignalsForCustomer(customerId: string): VendorSignal[] {
  return listVendorSignalsForCustomer(customerId)
}
