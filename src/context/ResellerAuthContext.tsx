import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { currentResellerUser, resellerTeam } from '../data/teamMock'
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

const organisation = 'Nexus IT Solutions'

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
    const member = resellerTeam.find(
      (m) => m.email.toLowerCase() === email.toLowerCase() && m.status === 'active'
    )
    if (!member) return false
    persist({
      staffId: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      organisation,
    })
    return true
  }, [])

  const loginAsDemo = useCallback((): boolean => {
    persist({
      staffId: currentResellerUser.staffId,
      name: currentResellerUser.name,
      email: currentResellerUser.email,
      role: currentResellerUser.role,
      organisation,
    })
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
