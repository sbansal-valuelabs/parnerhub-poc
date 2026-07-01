import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getDataProvider } from '../services'
import type { ResellerRole } from '../types'

export interface ResellerSession {
  staffId: string
  name: string
  email: string
  role: ResellerRole
  organisation: string
}

interface ResellerAuthContextValue {
  session: ResellerSession | null
  login: (email: string) => boolean
  loginAsDemo: () => boolean
  logout: () => void
}

const ResellerAuthContext = createContext<ResellerAuthContextValue | null>(null)

export function ResellerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ResellerSession | null>(() => {
    const stored = sessionStorage.getItem('reseller-session')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (s: ResellerSession | null) => {
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

  const loginAsDemo = useCallback((): boolean => {
    persist(getDataProvider().getCurrentResellerUser())
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
