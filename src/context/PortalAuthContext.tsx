import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getDataProvider } from '../services'
import { useCustomers } from './CustomerContext'

export interface PortalSession {
  customerId: string
  userName: string
  userEmail: string
  role: string
}

interface PortalAuthContextValue {
  session: PortalSession | null
  login: (customerId: string, email: string) => boolean
  loginAsDemo: (customerId: string) => boolean
  logout: () => void
}

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null)

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const { getCustomer } = useCustomers()
  const [session, setSession] = useState<PortalSession | null>(() => {
    const stored = sessionStorage.getItem('portal-session')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (s: PortalSession | null) => {
    if (s) sessionStorage.setItem('portal-session', JSON.stringify(s))
    else sessionStorage.removeItem('portal-session')
    setSession(s)
  }

  const login = useCallback(
    (customerId: string, email: string): boolean => {
      const customer = getCustomer(customerId)
      if (!customer || customer.status === 'suspended') return false

      const result = getDataProvider().authenticatePortal(customerId, email)
      if (!result) return false

      persist(result)
      return true
    },
    [getCustomer]
  )

  const loginAsDemo = useCallback(
    (customerId: string): boolean => {
      const account = getDataProvider().getPortalDemoAccount(customerId)
      if (!account) return false
      return login(customerId, account.email)
    },
    [login]
  )

  const logout = useCallback(() => persist(null), [])

  return (
    <PortalAuthContext.Provider value={{ session, login, loginAsDemo, logout }}>
      {children}
    </PortalAuthContext.Provider>
  )
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext)
  if (!ctx) throw new Error('usePortalAuth must be used within PortalAuthProvider')
  return ctx
}
