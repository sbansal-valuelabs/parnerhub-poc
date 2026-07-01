import { apiRequest } from './client'
import type { ApiResponse, CatalogProduct, MarketplaceStats } from '../types/api'

export async function fetchProducts(): Promise<CatalogProduct[]> {
  const res = await apiRequest<ApiResponse<CatalogProduct[]>>('/catalog/products')
  return res.data
}

export async function fetchProduct(productId: string): Promise<CatalogProduct> {
  const res = await apiRequest<ApiResponse<CatalogProduct>>(`/catalog/products/${productId}`)
  return res.data
}

export async function fetchMarketplaceStats(): Promise<MarketplaceStats> {
  const res = await apiRequest<ApiResponse<MarketplaceStats>>('/catalog/stats')
  return res.data
}
