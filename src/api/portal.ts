import { apiRequest } from './client'
import type { ApiResponse, PortalAccountDto } from '../types/api'
import type { LicensePool, TenantUser } from '../types'

export async function fetchPortalAccounts(): Promise<PortalAccountDto[]> {
  const res = await apiRequest<ApiResponse<PortalAccountDto[]>>('/portal/accounts')
  return res.data
}

export async function fetchTenantUsers(customerId: string): Promise<TenantUser[]> {
  const res = await apiRequest<ApiResponse<TenantUser[]>>(
    `/portal/customers/${customerId}/users`
  )
  return res.data
}

export async function fetchLicensePools(customerId: string): Promise<LicensePool[]> {
  const res = await apiRequest<ApiResponse<LicensePool[]>>(
    `/portal/customers/${customerId}/licenses`
  )
  return res.data
}
