import { apiRequest } from './client'
import type { ApiResponse, PortfolioSummary, SubscriptionDto } from '../types/api'

export async function fetchSubscriptions(customerId?: string): Promise<SubscriptionDto[]> {
  const query = customerId ? `?customerId=${encodeURIComponent(customerId)}` : ''
  const res = await apiRequest<ApiResponse<SubscriptionDto[]>>(`/subscriptions${query}`)
  return res.data
}

export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  const res = await apiRequest<ApiResponse<PortfolioSummary>>('/subscriptions/portfolio-summary')
  return res.data
}
