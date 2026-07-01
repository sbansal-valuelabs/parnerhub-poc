import { apiRequest } from './client'
import type { ApiResponse, ProvisionOrderRequest, ProvisionOrderResponse } from '../types/api'

export async function submitProvisionOrder(
  order: ProvisionOrderRequest
): Promise<ProvisionOrderResponse> {
  const res = await apiRequest<ApiResponse<ProvisionOrderResponse>>('/provision/orders', {
    method: 'POST',
    body: order,
  })
  return res.data
}

export async function fetchProvisionOrder(orderId: string): Promise<ProvisionOrderResponse> {
  const res = await apiRequest<ApiResponse<ProvisionOrderResponse>>(`/provision/orders/${orderId}`)
  return res.data
}
