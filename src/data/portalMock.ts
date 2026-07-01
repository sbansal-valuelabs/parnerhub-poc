import type { LicensePool, TenantUser } from '../types'

/**
 * License pools: total = subscribed seats, assigned = allocated to users,
 * available = total − assigned (always).
 *
 * User table shows a representative sample (not every employee).
 */

export const tenantUsers: TenantUser[] = [
  // Acme — sample of 118 M365-assigned users
  { id: 'u-001', customerId: 'cust-001', name: 'Sarah Chen', email: 's.chen@acmemfg.com.au', department: 'Executive', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-24T08:30:00' },
  { id: 'u-002', customerId: 'cust-001', name: 'Mike Torres', email: 'm.torres@acmemfg.com.au', department: 'Operations', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-23T17:45:00' },
  { id: 'u-003', customerId: 'cust-001', name: 'Emma Wilson', email: 'e.wilson@acmemfg.com.au', department: 'Finance', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-24T07:12:00' },
  { id: 'u-004', customerId: 'cust-001', name: 'David Park', email: 'd.park@acmemfg.com.au', department: 'IT', licenses: ['Microsoft 365 Business Premium', 'CrowdStrike Falcon Pro'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-24T09:00:00' },
  { id: 'u-005', customerId: 'cust-001', name: 'Lisa Nguyen', email: 'l.nguyen@acmemfg.com.au', department: 'HR', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft', status: 'inactive', lastSignIn: '2025-05-10T14:20:00' },
  { id: 'u-006', customerId: 'cust-001', name: 'Raj Patel', email: 'r.patel@acmemfg.com.au', department: 'DevOps', licenses: ['AWS EC2 & Core Services'], vendor: 'aws', status: 'active', lastSignIn: '2025-06-24T06:00:00' },
  // Bright Legal — sample of 63 M365-assigned users
  { id: 'u-010', customerId: 'cust-002', name: 'James Morrison', email: 'j.morrison@brightlegal.com.au', department: 'Partners', licenses: ['Microsoft 365 E3'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-24T09:15:00' },
  { id: 'u-011', customerId: 'cust-002', name: 'Kate Sullivan', email: 'k.sullivan@brightlegal.com.au', department: 'Legal', licenses: ['Microsoft 365 E3', 'Adobe Acrobat Sign Solutions'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-23T16:30:00' },
  { id: 'u-012', customerId: 'cust-002', name: 'Ryan O\'Brien', email: 'r.obrien@brightlegal.com.au', department: 'Legal', licenses: ['Microsoft 365 E3'], vendor: 'microsoft', status: 'active', lastSignIn: '2025-06-22T11:00:00' },
  { id: 'u-013', customerId: 'cust-002', name: 'Nina Gupta', email: 'n.gupta@brightlegal.com.au', department: 'Marketing', licenses: ['Google Workspace Business Plus'], vendor: 'google', status: 'active', lastSignIn: '2025-06-22T14:00:00' },
  { id: 'u-014', customerId: 'cust-002', name: 'Olivia Hart', email: 'o.hart@brightlegal.com.au', department: 'Legal', licenses: ['Adobe Acrobat Sign Solutions'], vendor: 'adobe', status: 'active', lastSignIn: '2025-06-21T09:30:00' },
]

export const licensePools: LicensePool[] = [
  // Acme — pools match subscription seats
  { customerId: 'cust-001', productName: 'Microsoft 365 Business Premium', sku: 'O365_BUSINESS_PREMIUM', vendor: 'microsoft', total: 120, assigned: 118, available: 2 },
  { customerId: 'cust-001', productName: 'CrowdStrike Falcon Pro', sku: 'CS_FALCON_PRO', vendor: 'crowdstrike', total: 120, assigned: 115, available: 5 },
  { customerId: 'cust-001', productName: 'Azure Subscription', sku: 'AZURE_PAYG', vendor: 'microsoft', total: 0, assigned: 0, available: 0 },
  { customerId: 'cust-001', productName: 'AWS EC2 & Core Services', sku: 'AWS_CORE_PAYG', vendor: 'aws', total: 0, assigned: 0, available: 0 },
  // Bright Legal
  { customerId: 'cust-002', productName: 'Microsoft 365 E3', sku: 'O365_E3', vendor: 'microsoft', total: 65, assigned: 63, available: 2 },
  { customerId: 'cust-002', productName: 'Adobe Acrobat Sign Solutions', sku: 'ADOBE_ACROBAT_SIGN', vendor: 'adobe', total: 40, assigned: 38, available: 2 },
  { customerId: 'cust-002', productName: 'Google Workspace Business Plus', sku: 'GWS_BUSINESS_PLUS', vendor: 'google', total: 10, assigned: 10, available: 0 },
]

export const portalAccounts = [
  { customerId: 'cust-001', email: 's.chen@acmemfg.com.au', name: 'Sarah Chen', role: 'IT Admin' },
  { customerId: 'cust-002', email: 'j.morrison@brightlegal.com.au', name: 'James Morrison', role: 'Office Admin' },
]

/** Consumption SKUs have no seat pool — spend is on subscription MRR */
export function isConsumptionSku(sku: string): boolean {
  return sku.includes('PAYG') || sku.includes('CORE_PAYG')
}

export function getUsersForCustomer(customerId: string): TenantUser[] {
  return tenantUsers.filter((u) => u.customerId === customerId)
}

export function getLicensesForCustomer(customerId: string): LicensePool[] {
  return licensePools.filter((l) => l.customerId === customerId)
}
