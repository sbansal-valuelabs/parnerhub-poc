import { apiRequest } from './client'
import type { ApiResponse, Integration, ResellerProfile } from '../types/api'
import type { ActivityItem } from '../types'

export async function fetchResellerProfile(): Promise<ResellerProfile> {
  const res = await apiRequest<ApiResponse<ResellerProfile>>('/reseller/profile')
  return res.data
}

export async function fetchIntegrations(): Promise<Integration[]> {
  const res = await apiRequest<ApiResponse<Integration[]>>('/integrations')
  return res.data
}

export async function fetchActivities(): Promise<ActivityItem[]> {
  const res = await apiRequest<ApiResponse<ActivityItem[]>>('/activities')
  return res.data
}
