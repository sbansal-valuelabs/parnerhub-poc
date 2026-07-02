export type CustomerStatus = 'active' | 'onboarding' | 'suspended'
export type SubscriptionStatus = 'active' | 'pending' | 'suspended' | 'cancelled'
export type BillingCycle = 'monthly' | 'annual'
export type CloudVendor =
  | 'microsoft-csp'
  | 'microsoft-azure'
  | 'google-workspace'
  | 'google-cloud'
  | 'acronis'
export type ProductCategory =
  | 'productivity'
  | 'infrastructure'
  | 'security'
  | 'business-apps'
  | 'backup'

export interface Customer {
  id: string
  /** Owning reseller organisation (demo multi-tenancy) */
  resellerId: string
  name: string
  domain: string
  contactName: string
  contactEmail: string
  status: CustomerStatus
  tenantId: string
  users: number
  /** Licensed / assigned users on primary productivity SKU (see DEMO_GUIDE.md) */
  licensedUsers?: number
  mrr: number
  subscriptions: number
  createdAt: string
  industry: string
}

export interface Product {
  id: string
  name: string
  sku: string
  vendor: CloudVendor
  category: ProductCategory
  description: string
  priceMonthly: number
  priceAnnual: number
  minSeats: number
  popular?: boolean
  features: string[]
  provisioningMins?: number
  marginPercent?: number
}

export interface Subscription {
  id: string
  customerId: string
  productId: string
  productName: string
  vendor: CloudVendor
  seats: number
  status: SubscriptionStatus
  billingCycle: BillingCycle
  mrr: number
  renewalDate: string
  autoRenew: boolean
}

export interface ActivityItem {
  id: string
  resellerId?: string
  type: 'provision' | 'change' | 'suspend' | 'invoice' | 'user'
  title: string
  description: string
  customerName: string
  timestamp: string
  vendor?: CloudVendor
}

export interface CartItem {
  product: Product
  seats: number
  billingCycle: BillingCycle
}

export interface CustomerStats {
  mrr: number
  activeSubscriptions: number
  licensedUsers: number
}

export interface TenantUser {
  id: string
  customerId: string
  name: string
  email: string
  department: string
  licenses: string[]
  vendor: CloudVendor
  status: 'active' | 'inactive'
  lastSignIn: string
}

export interface LicensePool {
  customerId: string
  productName: string
  sku: string
  vendor: CloudVendor
  total: number
  assigned: number
  available: number
}

export type ResellerRole = 'admin' | 'provisioning' | 'sales' | 'finance' | 'read-only'
export type ResellerStaffStatus = 'active' | 'invited' | 'deactivated'

export interface ResellerStaff {
  id: string
  resellerId: string
  name: string
  email: string
  role: ResellerRole
  status: ResellerStaffStatus
  department: string
  lastActive: string
  invitedAt?: string
}

export const resellerRoleLabels: Record<ResellerRole, string> = {
  admin: 'Administrator',
  provisioning: 'Provisioning',
  sales: 'Sales',
  finance: 'Finance',
  'read-only': 'Read-only',
}

export const resellerRoleDescriptions: Record<ResellerRole, string> = {
  admin: 'Full access — team, customers, provisioning, billing, settings',
  provisioning: 'Manage customers, marketplace, and provision services',
  sales: 'View customers and catalog — cannot provision or change billing',
  finance: 'View subscriptions, invoices, and credit — no provisioning',
  'read-only': 'View-only access across the portal',
}

export const categoryLabels: Record<ProductCategory, string> = {
  productivity: 'Productivity',
  infrastructure: 'Infrastructure',
  security: 'Security',
  'business-apps': 'Business Apps',
  backup: 'Backup & recovery',
}

export const categoryColors: Record<ProductCategory, string> = {
  productivity: 'bg-blue-100 text-blue-700',
  infrastructure: 'bg-cyan-100 text-cyan-700',
  security: 'bg-purple-100 text-purple-700',
  'business-apps': 'bg-orange-100 text-orange-700',
  backup: 'bg-emerald-100 text-emerald-700',
}

/** @deprecated use categoryLabels — kept for gradual migration */
export type LegacyProductCategory = 'microsoft365' | 'azure' | 'security' | 'dynamics' | 'power-platform'
