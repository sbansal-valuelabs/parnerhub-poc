import type { BillingCycle, CloudVendor, Customer, Product, ResellerStaff, Subscription } from '../index'

/** Standard API envelope — matches expected BFF responses in live mode */
export interface ApiResponse<T> {
  data: T
  meta?: { requestId?: string; syncedAt?: string }
}

export interface ApiErrorBody {
  code: string
  message: string
  details?: Record<string, string[]>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: ApiErrorBody
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface CreateCustomerRequest {
  name: string
  domain: string
  contactName: string
  contactEmail: string
  industry: string
  users: number
  linkExistingTenant: boolean
}

export interface ProvisionLineItem {
  productId: string
  seats: number
  billingCycle: BillingCycle
}

export interface ProvisionOrderRequest {
  customerId: string
  lineItems: ProvisionLineItem[]
  acceptedAgreementIds: string[]
  resellerStaffId?: string
}

export interface ProvisionOrderResponse {
  orderId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  estimatedMinutes: number
  message: string
}

export interface ResellerProfile {
  name: string
  tier: string
  distributor: string
  margin: number
  creditAvailable: number
  creditLimit: number
}

export interface MarketplaceStats {
  totalProducts: number
  vendors: number
  avgProvisioningMins: number
}

export interface PortfolioSummary {
  totalMrr: number
  activeCustomers: number
  activeSubscriptions: number
  onboardingCustomers: number
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending'

export interface Integration {
  id: string
  name: string
  vendor?: CloudVendor | 'synnex' | 'psa'
  status: IntegrationStatus
  lastSyncedAt?: string
}

export interface ResellerSessionDto {
  staffId: string
  name: string
  email: string
  role: ResellerStaff['role']
  organisation: string
  resellerId: string
}

export interface PortalSessionDto {
  customerId: string
  userName: string
  userEmail: string
  role: string
}

export interface PortalAccountDto {
  customerId: string
  email: string
  name: string
  role: string
}

/** Vendor-synced catalog item (Synnex + vendor SKU metadata) */
export type CatalogProduct = Product

/** Vendor-synced subscription row */
export type SubscriptionDto = Subscription

/** Customer row from CRM / distributor */
export type CustomerDto = Customer
