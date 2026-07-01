export type DataMode = 'mock' | 'live'

export function getDataMode(): DataMode {
  const mode = import.meta.env.VITE_DATA_MODE
  return mode === 'live' ? 'live' : 'mock'
}

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
}

export function isLiveData(): boolean {
  return getDataMode() === 'live'
}
