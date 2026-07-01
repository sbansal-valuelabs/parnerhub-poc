import { apiRequest } from './client'
import type { ApiResponse } from '../types/api'
import type { ResellerRole, ResellerStaff } from '../types'

export interface CreateStaffRequest {
  name: string
  email: string
  role: ResellerRole
  department: string
}

export async function fetchResellerTeam(): Promise<ResellerStaff[]> {
  const res = await apiRequest<ApiResponse<ResellerStaff[]>>('/team')
  return res.data
}

export async function createStaffMember(input: CreateStaffRequest): Promise<ResellerStaff> {
  const res = await apiRequest<ApiResponse<ResellerStaff>>('/team', {
    method: 'POST',
    body: input,
  })
  return res.data
}

export async function deactivateStaffMember(staffId: string): Promise<void> {
  await apiRequest<void>(`/team/${staffId}`, { method: 'DELETE' })
}

export async function resendStaffInvite(staffId: string): Promise<ResellerStaff> {
  const res = await apiRequest<ApiResponse<ResellerStaff>>(`/team/${staffId}/resend-invite`, {
    method: 'POST',
  })
  return res.data
}
