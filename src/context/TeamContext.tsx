import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getDataProvider } from '../services'
import type { ResellerSessionDto } from '../types/api'
import type { ResellerRole, ResellerStaff } from '../types'
import { useResellerAuth } from './ResellerAuthContext'

export interface NewStaffInput {
  name: string
  email: string
  role: ResellerRole
  department: string
}

interface TeamContextValue {
  team: ResellerStaff[]
  currentUser: ResellerSessionDto
  isAdmin: boolean
  addStaff: (input: NewStaffInput) => ResellerStaff
  deactivateStaff: (id: string) => void
  resendInvite: (id: string) => void
}

const TeamContext = createContext<TeamContextValue | null>(null)

export function TeamProvider({ children }: { children: ReactNode }) {
  const { session } = useResellerAuth()
  const [team, setTeam] = useState<ResellerStaff[]>(() => getDataProvider().listResellerTeam())

  useEffect(() => {
    setTeam(getDataProvider().listResellerTeam())
  }, [session?.resellerId])

  const currentUser: ResellerSessionDto = session ?? getDataProvider().getCurrentResellerUser()

  const refreshTeam = () => setTeam(getDataProvider().listResellerTeam())

  const addStaff = useCallback((input: NewStaffInput): ResellerStaff => {
    const member = getDataProvider().addStaff(input)
    refreshTeam()
    return member
  }, [])

  const deactivateStaff = useCallback((id: string) => {
    getDataProvider().deactivateStaff(id)
    refreshTeam()
  }, [])

  const resendInvite = useCallback((id: string) => {
    getDataProvider().resendInvite(id)
    refreshTeam()
  }, [])

  return (
    <TeamContext.Provider
      value={{
        team,
        currentUser,
        isAdmin: currentUser.role === 'admin',
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
