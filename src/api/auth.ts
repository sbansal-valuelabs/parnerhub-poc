import { apiRequest } from './client'
import type { ApiResponse, PortalSessionDto, ResellerSessionDto } from '../types/api'

export async function loginReseller(email: string): Promise<ResellerSessionDto> {
  const res = await apiRequest<ApiResponse<ResellerSessionDto>>('/auth/reseller/login', {
    method: 'POST',
    body: { email },
  })
  return res.data
}

export async function loginPortal(
  customerId: string,
  email: string
): Promise<PortalSessionDto> {
  const res = await apiRequest<ApiResponse<PortalSessionDto>>('/auth/portal/login', {
    method: 'POST',
    body: { customerId, email },
  })
  return res.data
}
