import { getApiBaseUrl } from '../config/env'
import type { ApiErrorBody } from '../types/api'
import { ApiError } from '../types/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  const resellerSession = sessionStorage.getItem('reseller-session')
  const portalSession = sessionStorage.getItem('portal-session')

  if (resellerSession) {
    headers['X-Reseller-Session'] = btoa(resellerSession)
  }
  if (portalSession) {
    headers['X-Portal-Session'] = btoa(portalSession)
  }

  return headers
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal } = options
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...getAuthHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  if (!response.ok) {
    let errorBody: ApiErrorBody | undefined
    try {
      errorBody = await response.json()
    } catch {
      /* non-JSON error */
    }
    throw new ApiError(
      errorBody?.message ?? `Request failed (${response.status})`,
      response.status,
      errorBody
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
