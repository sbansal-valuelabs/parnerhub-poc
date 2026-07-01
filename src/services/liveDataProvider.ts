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

  private async ensureProducts() {
    if (!this.cache.products) this.cache.products = await catalogApi.fetchProducts()
    return this.cache.products
  }

  private async ensureCustomers() {
    if (!this.cache.customers) this.cache.customers = await customersApi.fetchCustomers()
    return this.cache.customers
  }

  private async ensureSubscriptions() {
    if (!this.cache.subscriptions) {
      this.cache.subscriptions = await subscriptionsApi.fetchSubscriptions()
    }
    return this.cache.subscriptions
  }

  private async ensureTeam() {
    if (!this.cache.team) this.cache.team = await teamApi.fetchResellerTeam()
    return this.cache.team
  }

  private notReady(): never {
    throw new Error(
      'Live data mode requires async loading. Use hooks from src/hooks/ or set VITE_DATA_MODE=mock for the demo.'
    )
  }

  listProducts(): Product[] {
    if (this.cache.products) return this.cache.products
    this.notReady()
  }

  getMarketplaceStats() {
    void catalogApi.fetchMarketplaceStats()
    this.notReady()
  }

  listCustomers(): Customer[] {
    if (this.cache.customers) return this.cache.customers
    this.notReady()
  }

  getCustomer(id: string) {
    return this.listCustomers().find((c) => c.id === id)
  }

  createCustomer(input: CreateCustomerRequest): Customer {
    void customersApi.createCustomer(input)
    this.notReady()
  }

  listSubscriptions(): Subscription[] {
    if (this.cache.subscriptions) return this.cache.subscriptions
    this.notReady()
  }

  listSubscriptionsForCustomer(customerId: string) {
    return this.listSubscriptions().filter((s) => s.customerId === customerId)
  }

  getPortfolioSummary() {
    void subscriptionsApi.fetchPortfolioSummary()
    this.notReady()
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
    this.notReady()
  }

  listActivities() {
    void integrationsApi.fetchActivities()
    this.notReady()
  }

  listIntegrations() {
    void integrationsApi.fetchIntegrations()
    this.notReady()
  }

  listResellerTeam(): ResellerStaff[] {
    if (this.cache.team) return this.cache.team
    this.notReady()
  }

  getCurrentResellerUser(): ResellerSessionDto {
    void teamApi.fetchResellerTeam()
    this.notReady()
  }

  addStaff(input: NewStaffInput): ResellerStaff {
    void teamApi.createStaffMember(input)
    this.notReady()
  }

  deactivateStaff(id: string) {
    void teamApi.deactivateStaffMember(id)
    this.notReady()
  }

  resendInvite(id: string) {
    void teamApi.resendStaffInvite(id)
    this.notReady()
  }

  listPortalAccounts() {
    void portalApi.fetchPortalAccounts()
    this.notReady()
  }

  getUsersForCustomer(customerId: string) {
    void portalApi.fetchTenantUsers(customerId)
    this.notReady()
  }

  getLicensesForCustomer(customerId: string) {
    void portalApi.fetchLicensePools(customerId)
    this.notReady()
  }

  isConsumptionSku(sku: string) {
    return isConsumptionSku(sku)
  }

  authenticateReseller(email: string): ResellerSessionDto | null {
    void authApi.loginReseller(email)
    this.notReady()
  }

  authenticatePortal(customerId: string, email: string): PortalSessionDto | null {
    void authApi.loginPortal(customerId, email)
    this.notReady()
  }

  getPortalDemoAccount(customerId: string) {
    return this.listPortalAccounts().find((a) => a.customerId === customerId)
  }

  submitProvisionOrder(order: ProvisionOrderRequest): ProvisionOrderResponse {
    void provisionApi.submitProvisionOrder(order)
    this.notReady()
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
