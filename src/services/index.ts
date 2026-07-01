import { getDataMode } from '../config/env'
import { mockDataProvider } from './mockDataProvider'
import { liveDataProvider } from './liveDataProvider'
import type { DataProvider } from './dataProvider.types'

let provider: DataProvider = getDataMode() === 'live' ? liveDataProvider : mockDataProvider

export function getDataProvider(): DataProvider {
  return provider
}

/** Re-read env and swap provider (useful in tests) */
export function resetDataProvider(): void {
  provider = getDataMode() === 'live' ? liveDataProvider : mockDataProvider
}

export type { DataProvider } from './dataProvider.types'
