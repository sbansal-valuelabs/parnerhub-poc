import {
  authApi,
  catalogApi,
  customersApi,
  integrationsApi,
  portalApi,
  provisionApi,
  subscriptionsApi,
  teamApi,
} from '../api'
import { isConsumptionSku } from '../data/portalMock'
import { roundAud } from '../lib/billing'
import type { Customer, Product, ResellerStaff, Subscription } from '../types'
import type {
  CreateCustomerRequest,
  PortalSessionDto,
  ProvisionOrderRequest,
  ProvisionOrderResponse,
  ResellerSessionDto,
} from '../types/api'
import type { CustomerStats } from '../types'
import type { NewStaffInput } from '../context/TeamContext'
import type { DataProvider } from './dataProvider.types'

/** Live BFF client — async under the hood, sync wrappers throw if called synchronously */
class LiveDataProvider implements DataProvider {
  readonly mode = 'live' as const

  private cache = {
    products: null as Product[] | null,
    customers: null as Customer[] | null,
    subscriptions: null as Subscription[] | null,
    team: null as ResellerStaff[] | null,
  }

  private notReady(): never {
    throw new Error(
      'Live data mode requires async loading. Call liveDataProvider.hydrate() first or set VITE_DATA_MODE=mock for the demo.'
    )
  }

  listProducts(): Product[] {
    if (this.cache.products) return this.cache.products
    return this.notReady()
  }

  getMarketplaceStats() {
    void catalogApi.fetchMarketplaceStats()
    return this.notReady()
  }

  listCustomers(): Customer[] {
    if (this.cache.customers) return this.cache.customers
    return this.notReady()
  }

  getCustomer(id: string) {
    return this.listCustomers().find((c) => c.id === id)
  }

  createCustomer(input: CreateCustomerRequest): Customer {
    void customersApi.createCustomer(input)
    return this.notReady()
  }

  listSubscriptions(): Subscription[] {
    if (this.cache.subscriptions) return this.cache.subscriptions
    return this.notReady()
  }

  listSubscriptionsForCustomer(customerId: string) {
    return this.listSubscriptions().filter((s) => s.customerId === customerId)
  }

  getPortfolioSummary() {
    void subscriptionsApi.fetchPortfolioSummary()
    return this.notReady()
  }

  getCustomerMrr(customerId: string): number {
    return roundAud(
      this.listSubscriptions()
        .filter((s) => s.customerId === customerId && s.status === 'active')
        .reduce((sum, s) => sum + s.mrr, 0)
    )
  }

  getCustomerStats(customerId: string): CustomerStats {
    const customer = this.getCustomer(customerId)
    return {
      mrr: this.getCustomerMrr(customerId),
      activeSubscriptions: this.listSubscriptions().filter(
        (s) => s.customerId === customerId && s.status === 'active'
      ).length,
      licensedUsers: customer?.licensedUsers ?? 0,
    }
  }

  getPortfolioMrr(): number {
    return roundAud(
      this.listSubscriptions()
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => sum + s.mrr, 0)
    )
  }

  getResellerProfile() {
    void integrationsApi.fetchResellerProfile()
    return this.notReady()
  }

  listActivities() {
    void integrationsApi.fetchActivities()
    return this.notReady()
  }

  listIntegrations() {
    void integrationsApi.fetchIntegrations()
    return this.notReady()
  }

  listResellerTeam(): ResellerStaff[] {
    if (this.cache.team) return this.cache.team
    return this.notReady()
  }

  getCurrentResellerUser(): ResellerSessionDto {
    void teamApi.fetchResellerTeam()
    return this.notReady()
  }

  addStaff(input: NewStaffInput): ResellerStaff {
    void teamApi.createStaffMember(input)
    return this.notReady()
  }

  deactivateStaff(id: string) {
    void teamApi.deactivateStaffMember(id)
    return this.notReady()
  }

  resendInvite(id: string) {
    void teamApi.resendStaffInvite(id)
    return this.notReady()
  }

  listPortalAccounts() {
    void portalApi.fetchPortalAccounts()
    return this.notReady()
  }

  getUsersForCustomer(customerId: string) {
    void portalApi.fetchTenantUsers(customerId)
    return this.notReady()
  }

  getLicensesForCustomer(customerId: string) {
    void portalApi.fetchLicensePools(customerId)
    return this.notReady()
  }

  isConsumptionSku(sku: string) {
    return isConsumptionSku(sku)
  }

  authenticateReseller(email: string): ResellerSessionDto | null {
    void authApi.loginReseller(email)
    return this.notReady()
  }

  authenticatePortal(customerId: string, email: string): PortalSessionDto | null {
    void authApi.loginPortal(customerId, email)
    return this.notReady()
  }

  getPortalDemoAccount(_customerId: string) {
    return undefined
  }

  submitProvisionOrder(order: ProvisionOrderRequest): ProvisionOrderResponse {
    void provisionApi.submitProvisionOrder(order)
    return this.notReady()
  }

  /** Pre-warm caches — call from App bootstrap when VITE_DATA_MODE=live */
  async hydrate(): Promise<void> {
    const [products, customers, subscriptions, team] = await Promise.all([
      catalogApi.fetchProducts(),
      customersApi.fetchCustomers(),
      subscriptionsApi.fetchSubscriptions(),
      teamApi.fetchResellerTeam(),
    ])
    this.cache = { products, customers, subscriptions, team }
  }
}

export const liveDataProvider = new LiveDataProvider()
