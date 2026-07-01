import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { resellerTeam as initialTeam, currentResellerUser } from '../data/teamMock'
import type { ResellerRole, ResellerStaff } from '../types'

export interface NewStaffInput {
  name: string
  email: string
  role: ResellerRole
  department: string
}

interface TeamContextValue {
  team: ResellerStaff[]
  currentUser: typeof currentResellerUser
  isAdmin: boolean
  addStaff: (input: NewStaffInput) => ResellerStaff
  deactivateStaff: (id: string) => void
  resendInvite: (id: string) => void
}

const TeamContext = createContext<TeamContextValue | null>(null)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<ResellerStaff[]>(initialTeam)

  const addStaff = useCallback((input: NewStaffInput): ResellerStaff => {
    const member: ResellerStaff = {
      id: `staff-${Date.now().toString(36)}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      department: input.department.trim(),
      status: 'invited',
      lastActive: '',
      invitedAt: new Date().toISOString(),
    }
    setTeam((prev) => [...prev, member])
    return member
  }, [])

  const deactivateStaff = useCallback((id: string) => {
    if (id === currentResellerUser.staffId) return
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'deactivated' as const } : m))
    )
  }, [])

  const resendInvite = useCallback((id: string) => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id && m.status === 'invited'
          ? { ...m, invitedAt: new Date().toISOString() }
          : m
      )
    )
  }, [])

  return (
    <TeamContext.Provider
      value={{
        team,
        currentUser: currentResellerUser,
        isAdmin: currentResellerUser.role === 'admin',
        addStaff,
        deactivateStaff,
        resendInvite,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}
