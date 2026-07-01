import { apiRequest } from './client'
import type { ApiResponse, CreateCustomerRequest, CustomerDto } from '../types/api'

export async function fetchCustomers(): Promise<CustomerDto[]> {
  const res = await apiRequest<ApiResponse<CustomerDto[]>>('/customers')
  return res.data
}

export async function fetchCustomer(customerId: string): Promise<CustomerDto> {
  const res = await apiRequest<ApiResponse<CustomerDto>>(`/customers/${customerId}`)
  return res.data
}

export async function createCustomer(input: CreateCustomerRequest): Promise<CustomerDto> {
  const res = await apiRequest<ApiResponse<CustomerDto>>('/customers', {
    method: 'POST',
    body: input,
  })
  return res.data
}
