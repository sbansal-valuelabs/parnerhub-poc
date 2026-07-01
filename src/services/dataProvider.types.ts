import type {
  ActivityItem,
  Customer,
  LicensePool,
  Product,
  ResellerStaff,
  Subscription,
  TenantUser,
} from '../types'
import type {
  CreateCustomerRequest,
  Integration,
  MarketplaceStats,
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

export interface DataProvider {
  readonly mode: 'mock' | 'live'

  // Catalog (Synnex marketplace + vendor SKUs)
  listProducts(): Product[]
  getMarketplaceStats(): MarketplaceStats

  // Customers
  listCustomers(): Customer[]
  getCustomer(id: string): Customer | undefined
  createCustomer(input: CreateCustomerRequest): Customer

  // Subscriptions (vendor sync)
  listSubscriptions(): Subscription[]
  listSubscriptionsForCustomer(customerId: string): Subscription[]
  getPortfolioSummary(): PortfolioSummary

  // Stats (derived from subscriptions — same logic as DEMO_GUIDE)
  getCustomerStats(customerId: string): CustomerStats
  getCustomerMrr(customerId: string): number
  getPortfolioMrr(): number

  // Reseller
  getResellerProfile(): ResellerProfile
  listActivities(): ActivityItem[]
  listIntegrations(): Integration[]

  // Team
  listResellerTeam(): ResellerStaff[]
  getCurrentResellerUser(): ResellerSessionDto
  addStaff(input: NewStaffInput): ResellerStaff
  deactivateStaff(id: string): void
  resendInvite(id: string): void

  // Portal (tenant-scoped — Microsoft Graph, Google Admin, etc. in production)
  listPortalAccounts(): PortalAccountDto[]
  getUsersForCustomer(customerId: string): TenantUser[]
  getLicensesForCustomer(customerId: string): LicensePool[]
  isConsumptionSku(sku: string): boolean

  // Auth
  authenticateReseller(email: string): ResellerSessionDto | null
  authenticatePortal(customerId: string, email: string): PortalSessionDto | null
  getPortalDemoAccount(customerId: string): PortalAccountDto | undefined

  // Provision (orchestrates Synnex order + vendor APIs)
  submitProvisionOrder(order: ProvisionOrderRequest): ProvisionOrderResponse
}
