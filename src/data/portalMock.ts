import type { LicensePool, TenantUser } from '../types'

/**
 * License pools: total = subscribed seats, assigned = allocated to users,
 * available = total − assigned (always).
 *
 * User table shows a representative sample (not every employee).
 */

export const tenantUsers: TenantUser[] = [
  // Acme — sample of 118 M365-assigned users
  { id: 'u-001', customerId: 'cust-001', name: 'Sarah Chen', email: 's.chen@acmemfg.com.au', department: 'Executive', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-24T08:30:00' },
  { id: 'u-002', customerId: 'cust-001', name: 'Mike Torres', email: 'm.torres@acmemfg.com.au', department: 'Operations', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-23T17:45:00' },
  { id: 'u-003', customerId: 'cust-001', name: 'Emma Wilson', email: 'e.wilson@acmemfg.com.au', department: 'Finance', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-24T07:12:00' },
  { id: 'u-004', customerId: 'cust-001', name: 'David Park', email: 'd.park@acmemfg.com.au', department: 'IT', licenses: ['Microsoft 365 Business Premium', 'Acronis Cyber Protect Cloud — Complete'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-24T09:00:00' },
  { id: 'u-005', customerId: 'cust-001', name: 'Lisa Nguyen', email: 'l.nguyen@acmemfg.com.au', department: 'HR', licenses: ['Microsoft 365 Business Premium'], vendor: 'microsoft-csp', status: 'inactive', lastSignIn: '2025-05-10T14:20:00' },
  { id: 'u-006', customerId: 'cust-001', name: 'Raj Patel', email: 'r.patel@acmemfg.com.au', department: 'DevOps', licenses: ['Azure Pay-As-You-Go Subscription'], vendor: 'microsoft-azure', status: 'active', lastSignIn: '2025-06-24T06:00:00' },
  // Bright Legal — sample of 63 M365-assigned users
  { id: 'u-010', customerId: 'cust-002', name: 'James Morrison', email: 'j.morrison@brightlegal.com.au', department: 'Partners', licenses: ['Microsoft 365 E3'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-24T09:15:00' },
  { id: 'u-011', customerId: 'cust-002', name: 'Kate Sullivan', email: 'k.sullivan@brightlegal.com.au', department: 'Legal', licenses: ['Microsoft 365 E3', 'Acronis Cyber Protect Cloud — Advanced Security'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-23T16:30:00' },
  { id: 'u-012', customerId: 'cust-002', name: 'Ryan O\'Brien', email: 'r.obrien@brightlegal.com.au', department: 'Legal', licenses: ['Microsoft 365 E3'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-22T11:00:00' },
  { id: 'u-013', customerId: 'cust-002', name: 'Nina Gupta', email: 'n.gupta@brightlegal.com.au', department: 'Marketing', licenses: ['Google Workspace Business Plus'], vendor: 'google-workspace', status: 'active', lastSignIn: '2025-06-22T14:00:00' },
  { id: 'u-014', customerId: 'cust-002', name: 'Olivia Hart', email: 'o.hart@brightlegal.com.au', department: 'Legal', licenses: ['Acronis Cyber Protect Cloud — Advanced Security'], vendor: 'acronis', status: 'active', lastSignIn: '2025-06-21T09:30:00' },
  // Metro Finance — sample users
  { id: 'u-h001', customerId: 'cust-h001', name: 'Tom Bradley', email: 't.bradley@metrofinance.com.au', department: 'IT', licenses: ['Microsoft 365 Business Standard', 'Microsoft Defender for Endpoint P2'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-24T08:00:00' },
  { id: 'u-h002', customerId: 'cust-h001', name: 'Nina Kowalski', email: 'n.kowalski@metrofinance.com.au', department: 'Sales', licenses: ['Google Cloud Platform Pay-As-You-Go'], vendor: 'google-cloud', status: 'active', lastSignIn: '2025-06-23T15:30:00' },
  { id: 'u-h003', customerId: 'cust-h001', name: 'Grant Ellis', email: 'g.ellis@metrofinance.com.au', department: 'Finance', licenses: ['Microsoft 365 Business Standard'], vendor: 'microsoft-csp', status: 'active', lastSignIn: '2025-06-24T07:45:00' },
]

export const licensePools: LicensePool[] = [
  // Acme — pools match subscription seats
  { customerId: 'cust-001', productName: 'Microsoft 365 Business Premium', sku: 'CFQ7TTC0LH18', vendor: 'microsoft-csp', total: 120, assigned: 118, available: 2 },
  { customerId: 'cust-001', productName: 'Acronis Cyber Protect Cloud — Complete', sku: 'ACR_CP_COMPLETE', vendor: 'acronis', total: 120, assigned: 115, available: 5 },
  { customerId: 'cust-001', productName: 'Azure Pay-As-You-Go Subscription', sku: 'AZURE_PAYG', vendor: 'microsoft-azure', total: 0, assigned: 0, available: 0 },
  // Bright Legal
  { customerId: 'cust-002', productName: 'Microsoft 365 E3', sku: 'CFQ7TTC0LCHC', vendor: 'microsoft-csp', total: 65, assigned: 63, available: 2 },
  { customerId: 'cust-002', productName: 'Acronis Cyber Protect Cloud — Advanced Security', sku: 'ACR_CP_SECURITY', vendor: 'acronis', total: 40, assigned: 38, available: 2 },
  { customerId: 'cust-002', productName: 'Google Workspace Business Plus', sku: '1010020020', vendor: 'google-workspace', total: 10, assigned: 10, available: 0 },
  // Metro Finance
  { customerId: 'cust-h001', productName: 'Microsoft 365 Business Standard', sku: 'CFQ7TTC0LDPB', vendor: 'microsoft-csp', total: 55, assigned: 52, available: 3 },
  { customerId: 'cust-h001', productName: 'Microsoft Defender for Endpoint P2', sku: 'DEFENDER_ENDPOINT_P2', vendor: 'microsoft-csp', total: 55, assigned: 50, available: 5 },
  { customerId: 'cust-h001', productName: 'Google Cloud Platform Pay-As-You-Go', sku: 'GCP_PAYG', vendor: 'google-cloud', total: 0, assigned: 0, available: 0 },
  { customerId: 'cust-h001', productName: 'Azure Pay-As-You-Go Subscription', sku: 'AZURE_PAYG', vendor: 'microsoft-azure', total: 0, assigned: 0, available: 0 },
  // Summit Retail
  { customerId: 'cust-h002', productName: 'Google Workspace Business Plus', sku: '1010020020', vendor: 'google-workspace', total: 35, assigned: 32, available: 3 },
  { customerId: 'cust-h002', productName: 'Microsoft 365 Business Standard', sku: 'CFQ7TTC0LDPB', vendor: 'microsoft-csp', total: 25, assigned: 22, available: 3 },
  { customerId: 'cust-h002', productName: 'Google Cloud Platform Pay-As-You-Go', sku: 'GCP_PAYG', vendor: 'google-cloud', total: 0, assigned: 0, available: 0 },
]

export const portalAccounts = [
  { customerId: 'cust-001', email: 's.chen@acmemfg.com.au', name: 'Sarah Chen', role: 'IT Admin' },
  { customerId: 'cust-002', email: 'j.morrison@brightlegal.com.au', name: 'James Morrison', role: 'Office Admin' },
  { customerId: 'cust-h001', email: 't.bradley@metrofinance.com.au', name: 'Tom Bradley', role: 'IT Manager' },
]

/** Consumption SKUs have no seat pool — spend is on subscription MRR */
export function isConsumptionSku(sku: string): boolean {
  return sku.includes('PAYG')
}

export function getUsersForCustomer(customerId: string): TenantUser[] {
  return tenantUsers.filter((u) => u.customerId === customerId)
}

export function getLicensesForCustomer(customerId: string): LicensePool[] {
  return licensePools.filter((l) => l.customerId === customerId)
}
