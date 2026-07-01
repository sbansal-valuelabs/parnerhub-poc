import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getDataProvider } from '../services'
import type { ResellerRole } from '../types'
import { RESELLER_NEXUS } from '../data/resellers'

export interface ResellerSession {
  staffId: string
  name: string
  email: string
  role: ResellerRole
  organisation: string
  resellerId: string
}

interface ResellerAuthContextValue {
  session: ResellerSession | null
  login: (email: string) => boolean
  loginAsDemo: (resellerId?: string) => boolean
  logout: () => void
}

const ResellerAuthContext = createContext<ResellerAuthContextValue | null>(null)

function parseStoredSession(): ResellerSession | null {
  const stored = sessionStorage.getItem('reseller-session')
  if (!stored) return null
  const parsed = JSON.parse(stored) as ResellerSession
  if (!parsed.resellerId) {
    parsed.resellerId = RESELLER_NEXUS
  }
  return parsed
}

export function ResellerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ResellerSession | null>(() => {
    const parsed = parseStoredSession()
    if (parsed) getDataProvider().setActiveReseller(parsed.resellerId)
    return parsed
  })

  const persist = (s: ResellerSession | null) => {
    getDataProvider().setActiveReseller(s?.resellerId ?? null)
    if (s) sessionStorage.setItem('reseller-session', JSON.stringify(s))
    else sessionStorage.removeItem('reseller-session')
    setSession(s)
  }

  const login = useCallback((email: string): boolean => {
    const result = getDataProvider().authenticateReseller(email)
    if (!result) return false
    persist(result)
    return true
  }, [])

  const loginAsDemo = useCallback((resellerId: string = RESELLER_NEXUS): boolean => {
    const result = getDataProvider().getDefaultResellerUser(resellerId)
    if (!result) return false
    persist(result)
    return true
  }, [])

  const logout = useCallback(() => persist(null), [])

  return (
    <ResellerAuthContext.Provider value={{ session, login, loginAsDemo, logout }}>
      {children}
    </ResellerAuthContext.Provider>
  )
}

export function useResellerAuth() {
  const ctx = useContext(ResellerAuthContext)
  if (!ctx) throw new Error('useResellerAuth must be used within ResellerAuthProvider')
  return ctx
}
