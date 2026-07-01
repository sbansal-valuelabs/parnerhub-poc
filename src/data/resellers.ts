import type { ResellerProfile } from '../types/api'

export const RESELLER_NEXUS = 'reseller-nexus'
export const RESELLER_HORIZON = 'reseller-horizon'

export interface DemoReseller {
  id: string
  name: string
  tier: string
  distributor: string
  tagline: string
  demoAdminEmail: string
}

export const demoResellers: DemoReseller[] = [
  {
    id: RESELLER_NEXUS,
    name: 'Nexus IT Solutions',
    tier: 'Gold Cloud Partner',
    distributor: 'Synnex',
    tagline: 'Established MSP — manufacturing & legal verticals',
    demoAdminEmail: 'alex.morgan@nexusit.com.au',
  },
  {
    id: RESELLER_HORIZON,
    name: 'Horizon Cloud Services',
    tier: 'Silver Cloud Partner',
    distributor: 'Synnex',
    tagline: 'Growth partner — finance & retail focus',
    demoAdminEmail: 'chris.freeman@horizoncloud.com.au',
  },
]

export const resellerProfiles: Record<string, ResellerProfile> = {
  [RESELLER_NEXUS]: {
    name: 'Nexus IT Solutions',
    tier: 'Gold Cloud Partner',
    distributor: 'Synnex',
    margin: 12.5,
    creditAvailable: 48750,
    creditLimit: 75000,
  },
  [RESELLER_HORIZON]: {
    name: 'Horizon Cloud Services',
    tier: 'Silver Cloud Partner',
    distributor: 'Synnex',
    margin: 9.5,
    creditAvailable: 18200,
    creditLimit: 40000,
  },
}

export function getDemoReseller(id: string) {
  return demoResellers.find((r) => r.id === id)
}
