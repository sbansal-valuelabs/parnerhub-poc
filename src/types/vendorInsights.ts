import type { CloudVendor } from './index'

/** Severity aligned with partner ops workflows — not vendor-native enums. */
export type VendorSignalSeverity = 'info' | 'warning' | 'critical'

/**
 * Normalised alert derived from vendor APIs (Partner Center, Graph, Channel, Acronis, etc.).
 * `sourceApi` cites the official API surface — see docs/vendor-apis/.
 */
export interface VendorSignal {
  id: string
  customerId: string
  vendor: CloudVendor
  severity: VendorSignalSeverity
  code: string
  title: string
  message: string
  sourceApi: string
  syncedAt: string
}

/** Microsoft CSP — Partner Center subscription + Graph subscribedSku + analytics. */
export interface MicrosoftCspInsights {
  vendor: 'microsoft-csp'
  sourceApis: string[]
  syncedAt: string
  gdap: {
    status: 'active' | 'pending' | 'expired' | 'none'
    endDate: string | null
    roles: string[]
  }
  mca: {
    status: 'accepted' | 'pending' | 'unknown'
    acceptedAt: string | null
  }
  subscriptions: Array<{
    subscriptionId: string
    offerName: string
    status: string
    quantity: number
    assignedSeats: number | null
    activeUsers30d: number | null
    billingCycle: string
    commitmentEndDate: string
    autoRenewEnabled: boolean
    attentionNeeded: boolean
    attentionReason: string | null
    churnRisk: 'Low' | 'Medium' | 'High' | null
  }>
  licenseFunnel: {
    purchasedSeats: number
    assignedSeats: number
    activeUsers30d: number
    utilizationPct: number
    staleLicenseCount: number
  }
  servicePlanIssues: Array<{
    servicePlanName: string
    provisioningStatus: string
  }>
}

/** Microsoft Azure — Partner Center + Cost Management export shape (aggregated in BFF). */
export interface MicrosoftAzureInsights {
  vendor: 'microsoft-azure'
  sourceApis: string[]
  syncedAt: string
  subscriptionId: string
  subscriptionName: string
  status: string
  period: string
  currency: string
  totalCost: number
  previousPeriodCost: number
  changePct: number
  budget: number | null
  budgetUtilizationPct: number | null
  topServices: Array<{ name: string; cost: number; sharePct: number }>
  dailyUsageSample: Array<{
    usageDate: string
    meterCategory: string
    resourceLocation: string
    quantity: number
    meterUnit: string
  }>
}

/** Google Workspace — Cloud Channel entitlement + Reseller API seats (REST). */
export interface GoogleWorkspaceInsights {
  vendor: 'google-workspace'
  sourceApis: string[]
  syncedAt: string
  cloudIdentityId: string | null
  domainVerified: boolean
  entitlements: Array<{
    entitlementName: string
    skuName: string
    provisioningState: string
    numUnits: number
    assignedUnits: number
    maxUnits: number | null
    trial: boolean
    trialEndTime: string | null
    commitmentEndTime: string | null
    renewalType: string | null
    suspensionReasons: string[]
  }>
  /** Billing/cost from BigQuery export — daily refresh, not live REST. */
  billingNote: string
  mtdCostAud: number | null
}

/** Google Cloud — Cloud Channel GCP entitlement + BigQuery billing export. */
export interface GoogleCloudInsights {
  vendor: 'google-cloud'
  sourceApis: string[]
  syncedAt: string
  billingAccountId: string
  provisioningState: string
  period: string
  currency: string
  totalCost: number
  previousPeriodCost: number
  changePct: number
  topServices: Array<{ serviceDescription: string; cost: number; sharePct: number }>
  billingNote: string
}

/** Acronis — Account Management + resource_statuses + Alert Manager. */
export interface AcronisInsights {
  vendor: 'acronis'
  sourceApis: string[]
  syncedAt: string
  tenantId: string
  tenantEnabled: boolean
  mfaStatus: string
  protectionSummary: {
    totalMachines: number
    protected: number
    critical: number
    noPolicies: number
  }
  cyberFitScore: number | null
  cyberFitAssessedAt: string | null
  backupCompliance: Array<{
    machineName: string
    status: string
    lastSuccessRun: string | null
    nextRun: string | null
    planNames: string[]
  }>
  openAlerts: Array<{
    severity: string
    title: string
    createdAt: string
  }>
  storageFootprintGb: number
  usageNote: string
}

export type VendorInsightBundle =
  | MicrosoftCspInsights
  | MicrosoftAzureInsights
  | GoogleWorkspaceInsights
  | GoogleCloudInsights
  | AcronisInsights

export interface CustomerVendorInsights {
  customerId: string
  signals: VendorSignal[]
  insights: Partial<Record<CloudVendor, VendorInsightBundle>>
  syncedAt: string
}
