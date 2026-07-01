import {
  activities as nexusActivities,
  customers as nexusCustomers,
  marketplaceStats,
  products,
  subscriptions as nexusSubscriptions,
} from '../data/mock'
import {
  getLicensesForCustomer as mockGetLicenses,
  getUsersForCustomer as mockGetUsers,
  isConsumptionSku,
  portalAccounts,
} from '../data/portalMock'
import {
  horizonActivities,
  horizonCustomers,
  horizonSubscriptions,
} from '../data/horizonMock'
import { currentResellerUser, resellerTeam as seedTeam } from '../data/teamMock'
import {
  demoResellers,
  getDemoReseller,
  RESELLER_NEXUS,
  resellerProfiles,
} from '../data/resellers'
import { roundAud } from '../lib/billing'
import type { ActivityItem, Customer, ResellerStaff } from '../types'
import type {
  CreateCustomerRequest,
  Integration,
  PortalAccountDto,
  PortalSessionDto,
  PortfolioSummary,
  ProvisionOrderRequest,
  ProvisionOrderResponse,
  ResellerProfile,
  ResellerSessionDto,
} from '../types/api'
import type { CustomerStats } from '../types'
import type { NewStaffInput } from '../context/TeamContext'
import type { DataProvider } from './dataProvider.types'

const DEMO_INTEGRATIONS: Integration[] = [
  { id: 'synnex', name: 'Synnex Marketplace API', vendor: 'synnex', status: 'connected', lastSyncedAt: '2025-06-24T08:00:00Z' },
  { id: 'ms-partner', name: 'Microsoft Partner Center', vendor: 'microsoft', status: 'connected', lastSyncedAt: '2025-06-24T07:45:00Z' },
  { id: 'aws-partner', name: 'AWS Partner Network', vendor: 'aws', status: 'connected', lastSyncedAt: '2025-06-24T07:30:00Z' },
  { id: 'google-reseller', name: 'Google Cloud Reseller', vendor: 'google', status: 'connected', lastSyncedAt: '2025-06-24T07:15:00Z' },
  { id: 'connectwise', name: 'ConnectWise PSA', vendor: 'psa', status: 'connected', lastSyncedAt: '2025-06-23T22:00:00Z' },
]

function generateId(): string {
  return `cust-${Date.now().toString(36)}`
}

function generateTenantId(): string {
  const segment = () => Math.random().toString(16).slice(2, 6)
  return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`
}

function summarisePortfolio(customers: Customer[], subscriptions: typeof nexusSubscriptions): PortfolioSummary {
  const activeCustomers = customers.filter((c) => c.status === 'active').length
  const onboardingCustomers = customers.filter((c) => c.status === 'onboarding').length
  const customerIds = new Set(customers.map((c) => c.id))
  const activeSubs = subscriptions.filter((s) => s.status === 'active' && customerIds.has(s.customerId))
  const totalMrr = roundAud(activeSubs.reduce((sum, s) => sum + s.mrr, 0))
  return {
    totalMrr,
    activeCustomers,
    activeSubscriptions: activeSubs.length,
    onboardingCustomers,
  }
}

class MockDataProvider implements DataProvider {
  readonly mode = 'mock' as const

  private activeResellerId: string | null = null
  private allCustomers = [...nexusCustomers, ...horizonCustomers]
  private allSubscriptions = [...nexusSubscriptions, ...horizonSubscriptions]
  private allActivities = [...nexusActivities, ...horizonActivities]
  private customers = [...this.allCustomers]
  private team = [...seedTeam]

  setActiveReseller(resellerId: string | null) {
    this.activeResellerId = resellerId
    this.customers = resellerId
      ? this.allCustomers.filter((c) => c.resellerId === resellerId)
      : [...this.allCustomers]
  }

  getActiveResellerId() {
    return this.activeResellerId
  }

  listDemoResellers() {
    return demoResellers
  }

  private customerIdsInScope(): Set<string> {
    return new Set(this.customers.map((c) => c.id))
  }

  private subscriptionsInScope() {
    const ids = this.customerIdsInScope()
    return this.allSubscriptions.filter((s) => ids.has(s.customerId))
  }

  private activitiesInScope() {
    if (!this.activeResellerId) return this.allActivities
    return this.allActivities.filter((a) => a.resellerId === this.activeResellerId)
  }

  listProducts() {
    return products
  }

  getMarketplaceStats() {
    return marketplaceStats
  }

  listCustomers() {
    return this.customers
  }

  getCustomer(id: string) {
    return this.allCustomers.find((c) => c.id === id)
  }

  createCustomer(input: CreateCustomerRequest): Customer {
    const customer: Customer = {
      id: generateId(),
      resellerId: this.activeResellerId ?? RESELLER_NEXUS,
      name: input.name.trim(),
      domain: input.domain.trim().toLowerCase(),
      contactName: input.contactName.trim(),
      contactEmail: input.contactEmail.trim().toLowerCase(),
      industry: input.industry,
      users: input.users,
      status: input.linkExistingTenant ? 'active' : 'onboarding',
      tenantId: generateTenantId(),
      mrr: 0,
      subscriptions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    this.allCustomers = [customer, ...this.allCustomers]
    if (!this.activeResellerId || customer.resellerId === this.activeResellerId) {
      this.customers = [customer, ...this.customers]
    }
    return customer
  }

  listSubscriptions() {
    return this.subscriptionsInScope()
  }

  listSubscriptionsForCustomer(customerId: string) {
    return this.allSubscriptions.filter((s) => s.customerId === customerId)
  }

  getPortfolioSummary(): PortfolioSummary {
    if (this.activeResellerId) {
      return summarisePortfolio(this.customers, this.allSubscriptions)
    }
    return summarisePortfolio(this.allCustomers, this.allSubscriptions)
  }

  getCustomerMrr(customerId: string): number {
    return roundAud(
      this.allSubscriptions
        .filter((s) => s.customerId === customerId && s.status === 'active')
        .reduce((sum, s) => sum + s.mrr, 0)
    )
  }

  getCustomerLicensedUsers(customerId: string): number {
    const customer = this.allCustomers.find((c) => c.id === customerId)
    if (customer?.licensedUsers != null) return customer.licensedUsers

    const seatSubs = this.allSubscriptions
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

  getCustomerStats(customerId: string): CustomerStats {
    const customer = this.allCustomers.find((c) => c.id === customerId)
    return {
      mrr: this.getCustomerMrr(customerId),
      activeSubscriptions: this.allSubscriptions.filter(
        (s) => s.customerId === customerId && s.status === 'active'
      ).length,
      licensedUsers: customer?.licensedUsers ?? this.getCustomerLicensedUsers(customerId),
    }
  }

  getPortfolioMrr(): number {
    const subs = this.activeResellerId ? this.subscriptionsInScope() : this.allSubscriptions
    return roundAud(subs.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.mrr, 0))
  }

  getResellerProfile(): ResellerProfile {
    const id = this.activeResellerId ?? RESELLER_NEXUS
    return resellerProfiles[id] ?? resellerProfiles[RESELLER_NEXUS]
  }

  getResellerProfileById(resellerId: string): ResellerProfile {
    return resellerProfiles[resellerId] ?? resellerProfiles[RESELLER_NEXUS]
  }

  listActivities(): ActivityItem[] {
    return this.activitiesInScope()
  }

  listIntegrations() {
    return DEMO_INTEGRATIONS
  }

  listResellerTeam() {
    if (!this.activeResellerId) return this.team
    return this.team.filter((m) => m.resellerId === this.activeResellerId)
  }

  getCurrentResellerUser(): ResellerSessionDto {
    const profile = this.getResellerProfile()
    return {
      staffId: currentResellerUser.staffId,
      name: currentResellerUser.name,
      email: currentResellerUser.email,
      role: currentResellerUser.role,
      organisation: profile.name,
      resellerId: currentResellerUser.resellerId,
    }
  }

  getDefaultResellerUser(resellerId: string): ResellerSessionDto | null {
    const demo = getDemoReseller(resellerId)
    if (!demo) return null
    const member = this.team.find(
      (m) => m.email === demo.demoAdminEmail && m.status === 'active'
    )
    if (!member) return null
    return this.toSession(member)
  }

  private toSession(member: ResellerStaff): ResellerSessionDto {
    const profile = resellerProfiles[member.resellerId]
    return {
      staffId: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      organisation: profile?.name ?? member.resellerId,
      resellerId: member.resellerId,
    }
  }

  addStaff(input: NewStaffInput): ResellerStaff {
    const member: ResellerStaff = {
      id: `staff-${Date.now().toString(36)}`,
      resellerId: this.activeResellerId ?? RESELLER_NEXUS,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      department: input.department.trim(),
      status: 'invited',
      lastActive: '',
      invitedAt: new Date().toISOString(),
    }
    this.team = [...this.team, member]
    return member
  }

  deactivateStaff(id: string) {
    this.team = this.team.map((m) =>
      m.id === id ? { ...m, status: 'deactivated' as const } : m
    )
  }

  resendInvite(id: string) {
    this.team = this.team.map((m) =>
      m.id === id && m.status === 'invited'
        ? { ...m, invitedAt: new Date().toISOString() }
        : m
    )
  }

  listPortalAccounts(): PortalAccountDto[] {
    return portalAccounts
  }

  getUsersForCustomer(customerId: string) {
    return mockGetUsers(customerId)
  }

  getLicensesForCustomer(customerId: string) {
    return mockGetLicenses(customerId)
  }

  isConsumptionSku(sku: string) {
    return isConsumptionSku(sku)
  }

  authenticateReseller(email: string): ResellerSessionDto | null {
    const member = this.team.find(
      (m) => m.email.toLowerCase() === email.toLowerCase() && m.status === 'active'
    )
    if (!member) return null
    return this.toSession(member)
  }

  authenticatePortal(customerId: string, email: string): PortalSessionDto | null {
    const customer = this.getCustomer(customerId)
    if (!customer || customer.status === 'suspended') return null

    const account = portalAccounts.find(
      (a) => a.customerId === customerId && a.email.toLowerCase() === email.toLowerCase()
    )
    if (!account) return null

    return {
      customerId,
      userName: account.name,
      userEmail: account.email,
      role: account.role,
    }
  }

  getPortalDemoAccount(customerId: string) {
    return portalAccounts.find((a) => a.customerId === customerId)
  }

  submitProvisionOrder(order: ProvisionOrderRequest): ProvisionOrderResponse {
    const lineCount = order.lineItems.length
    const maxMins = order.lineItems.reduce((max, item) => {
      const product = products.find((p) => p.id === item.productId)
      return Math.max(max, product?.provisioningMins ?? 5)
    }, 5)

    return {
      orderId: `ord-${Date.now().toString(36)}`,
      status: 'processing',
      estimatedMinutes: maxMins,
      message: `${lineCount} service${lineCount > 1 ? 's' : ''} queued for provisioning via Synnex.`,
    }
  }
}

export const mockDataProvider = new MockDataProvider()
