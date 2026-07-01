import {
  activities,
  customers as seedCustomers,
  marketplaceStats,
  portfolioSummary,
  products,
  resellerProfile,
  subscriptions,
} from '../data/mock'
import {
  getLicensesForCustomer as mockGetLicenses,
  getUsersForCustomer as mockGetUsers,
  isConsumptionSku,
  portalAccounts,
} from '../data/portalMock'
import { currentResellerUser, resellerTeam as seedTeam } from '../data/teamMock'
import { roundAud } from '../lib/billing'
import type { Customer, ResellerStaff } from '../types'
import type {
  CreateCustomerRequest,
  Integration,
  PortalAccountDto,
  PortalSessionDto,
  ProvisionOrderRequest,
  ProvisionOrderResponse,
  ResellerSessionDto,
} from '../types/api'
import type { CustomerStats } from '../types'
import type { NewStaffInput } from '../context/TeamContext'
import type { DataProvider } from './dataProvider.types'

const organisation = 'Nexus IT Solutions'

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

class MockDataProvider implements DataProvider {
  readonly mode = 'mock' as const

  private customers = [...seedCustomers]
  private team = [...seedTeam]

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
    return this.customers.find((c) => c.id === id)
  }

  createCustomer(input: CreateCustomerRequest): Customer {
    const customer: Customer = {
      id: generateId(),
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
    this.customers = [customer, ...this.customers]
    return customer
  }

  listSubscriptions() {
    return subscriptions
  }

  listSubscriptionsForCustomer(customerId: string) {
    return subscriptions.filter((s) => s.customerId === customerId)
  }

  getPortfolioSummary() {
    return portfolioSummary
  }

  getCustomerMrr(customerId: string): number {
    return roundAud(
      subscriptions
        .filter((s) => s.customerId === customerId && s.status === 'active')
        .reduce((sum, s) => sum + s.mrr, 0)
    )
  }

  getCustomerLicensedUsers(customerId: string): number {
    const customer = this.customers.find((c) => c.id === customerId)
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

  getCustomerStats(customerId: string): CustomerStats {
    const customer = this.customers.find((c) => c.id === customerId)
    return {
      mrr: this.getCustomerMrr(customerId),
      activeSubscriptions: subscriptions.filter(
        (s) => s.customerId === customerId && s.status === 'active'
      ).length,
      licensedUsers: customer?.licensedUsers ?? this.getCustomerLicensedUsers(customerId),
    }
  }

  getPortfolioMrr(): number {
    return roundAud(
      subscriptions
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => sum + s.mrr, 0)
    )
  }

  getResellerProfile() {
    return resellerProfile
  }

  listActivities() {
    return activities
  }

  listIntegrations() {
    return DEMO_INTEGRATIONS
  }

  listResellerTeam() {
    return this.team
  }

  getCurrentResellerUser(): ResellerSessionDto {
    return {
      staffId: currentResellerUser.staffId,
      name: currentResellerUser.name,
      email: currentResellerUser.email,
      role: currentResellerUser.role,
      organisation,
    }
  }

  addStaff(input: NewStaffInput): ResellerStaff {
    const member: ResellerStaff = {
      id: `staff-${Date.now().toString(36)}`,
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
    if (id === currentResellerUser.staffId) return
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
    return {
      staffId: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      organisation,
    }
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
