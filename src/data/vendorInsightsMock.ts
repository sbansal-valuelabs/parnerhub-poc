import type {
  AcronisInsights,
  CustomerVendorInsights,
  GoogleCloudInsights,
  GoogleWorkspaceInsights,
  MicrosoftAzureInsights,
  MicrosoftCspInsights,
  VendorSignal,
} from '../types/vendorInsights'

const SYNCED = '2025-06-24T08:00:00Z'

const acmeMicrosoftCsp: MicrosoftCspInsights = {
  vendor: 'microsoft-csp',
  sourceApis: [
    'Partner Center REST — subscriptions',
    'Partner Center Analytics — subscription analytics',
    'Microsoft Graph — subscribedSkus (GDAP)',
    'Microsoft Graph — signInActivity (GDAP)',
  ],
  syncedAt: SYNCED,
  gdap: {
    status: 'active',
    endDate: '2025-07-15',
    roles: ['Directory Readers', 'License Administrator'],
  },
  mca: { status: 'accepted', acceptedAt: '2023-06-15' },
  subscriptions: [
    {
      subscriptionId: '4BF546B2-8998-4838-BEE2-5F1BBE65A04F',
      offerName: 'Microsoft 365 Business Premium',
      status: 'active',
      quantity: 120,
      assignedSeats: 118,
      activeUsers30d: 105,
      billingCycle: 'monthly',
      commitmentEndDate: '2025-07-15',
      autoRenewEnabled: true,
      attentionNeeded: false,
      attentionReason: null,
      churnRisk: 'Low',
    },
    {
      subscriptionId: 'defender-acme-001',
      offerName: 'Microsoft Defender for Endpoint P2',
      status: 'active',
      quantity: 120,
      assignedSeats: 115,
      activeUsers30d: null,
      billingCycle: 'annual',
      commitmentEndDate: '2026-03-01',
      autoRenewEnabled: true,
      attentionNeeded: false,
      attentionReason: null,
      churnRisk: 'Low',
    },
  ],
  licenseFunnel: {
    purchasedSeats: 120,
    assignedSeats: 118,
    activeUsers30d: 105,
    utilizationPct: 87.5,
    staleLicenseCount: 13,
  },
  servicePlanIssues: [
    {
      servicePlanName: 'INTUNE_A',
      provisioningStatus: 'PendingProvisioning',
    },
  ],
}

const acmeAzure: MicrosoftAzureInsights = {
  vendor: 'microsoft-azure',
  sourceApis: [
    'Partner Center Analytics — Azure usage',
    'Azure Cost Management — export / cost details',
  ],
  syncedAt: SYNCED,
  subscriptionId: 'azure-sub-acme-001',
  subscriptionName: 'Azure Pay-As-You-Go Subscription',
  status: 'active',
  period: '2025-06-01/2025-06-30',
  currency: 'AUD',
  totalCost: 332,
  previousPeriodCost: 298.5,
  changePct: 11.2,
  budget: 400,
  budgetUtilizationPct: 83,
  topServices: [
    { name: 'Virtual Machines', cost: 210.4, sharePct: 63.4 },
    { name: 'Storage', cost: 68.2, sharePct: 20.5 },
    { name: 'Networking', cost: 53.4, sharePct: 16.1 },
  ],
  dailyUsageSample: [
    {
      usageDate: '2025-06-23',
      meterCategory: 'Virtual Machines',
      resourceLocation: 'Australia East',
      quantity: 96,
      meterUnit: 'Hours',
    },
    {
      usageDate: '2025-06-23',
      meterCategory: 'Storage',
      resourceLocation: 'Australia East',
      quantity: 512,
      meterUnit: 'GB/Month',
    },
  ],
}

const acmeAcronis: AcronisInsights = {
  vendor: 'acronis',
  sourceApis: [
    'Acronis Account Management — tenants',
    'Acronis Resource Management — resource_statuses',
    'Acronis Alert Manager — alerts',
    'Acronis Vault Manager — backups',
  ],
  syncedAt: SYNCED,
  tenantId: 'acronis-tenant-acme-001',
  tenantEnabled: true,
  mfaStatus: 'enabled',
  protectionSummary: {
    totalMachines: 124,
    protected: 118,
    critical: 3,
    noPolicies: 3,
  },
  cyberFitScore: 78,
  cyberFitAssessedAt: '2025-06-22',
  backupCompliance: [
    {
      machineName: 'ACME-ERP-01',
      status: 'ok',
      lastSuccessRun: '2025-06-24T02:00:00Z',
      nextRun: '2025-06-25T02:00:00Z',
      planNames: ['Server backup — nightly'],
    },
    {
      machineName: 'ACME-FILE-02',
      status: 'critical',
      lastSuccessRun: '2025-06-20T02:00:00Z',
      nextRun: '2025-06-25T02:00:00Z',
      planNames: ['Server backup — nightly'],
    },
  ],
  openAlerts: [
    {
      severity: 'critical',
      title: 'Backup failed — ACME-FILE-02',
      createdAt: '2025-06-21T03:15:00Z',
    },
  ],
  storageFootprintGb: 1840,
  usageNote: 'Tenant usage via GET /api/2/tenants/{id}/usages refreshes every 5–6 hours.',
}

const brightMicrosoftCsp: MicrosoftCspInsights = {
  vendor: 'microsoft-csp',
  sourceApis: [
    'Partner Center REST — subscriptions',
    'Partner Center Analytics — subscription analytics',
    'Microsoft Graph — subscribedSkus (GDAP)',
  ],
  syncedAt: SYNCED,
  gdap: { status: 'active', endDate: '2026-01-22', roles: ['Directory Readers', 'License Administrator'] },
  mca: { status: 'accepted', acceptedAt: '2024-01-22' },
  subscriptions: [
    {
      subscriptionId: 'bright-e3-001',
      offerName: 'Microsoft 365 E3',
      status: 'active',
      quantity: 65,
      assignedSeats: 63,
      activeUsers30d: 58,
      billingCycle: 'annual',
      commitmentEndDate: '2026-01-22',
      autoRenewEnabled: true,
      attentionNeeded: false,
      attentionReason: null,
      churnRisk: 'Low',
    },
  ],
  licenseFunnel: {
    purchasedSeats: 65,
    assignedSeats: 63,
    activeUsers30d: 58,
    utilizationPct: 89.2,
    staleLicenseCount: 5,
  },
  servicePlanIssues: [],
}

const brightGws: GoogleWorkspaceInsights = {
  vendor: 'google-workspace',
  sourceApis: [
    'Google Cloud Channel API — entitlements',
    'Google Workspace Reseller API — subscriptions (legacy)',
  ],
  syncedAt: SYNCED,
  cloudIdentityId: 'C01234567890',
  domainVerified: true,
  entitlements: [
    {
      entitlementName: 'accounts/C01234567890/customers/brightlegal/entitlements/gws-plus',
      skuName: 'Google Workspace Business Plus',
      provisioningState: 'ACTIVE',
      numUnits: 10,
      assignedUnits: 10,
      maxUnits: null,
      trial: false,
      trialEndTime: null,
      commitmentEndTime: '2025-07-22',
      renewalType: 'RENEW_CURRENT_USERS_MONTHLY_PAY',
      suspensionReasons: [],
    },
  ],
  billingNote:
    'Seat billing amounts come from BigQuery reseller_billing_detailed_export_v1 (daily), not live REST on entitlements.',
  mtdCostAud: 264,
}

const brightAcronis: AcronisInsights = {
  vendor: 'acronis',
  sourceApis: ['Acronis Resource Management — resource_statuses', 'Acronis Alert Manager'],
  syncedAt: SYNCED,
  tenantId: 'acronis-tenant-bright-001',
  tenantEnabled: true,
  mfaStatus: 'enabled',
  protectionSummary: { totalMachines: 42, protected: 38, critical: 0, noPolicies: 4 },
  cyberFitScore: 82,
  cyberFitAssessedAt: '2025-06-23',
  backupCompliance: [
    {
      machineName: 'BL-DC-01',
      status: 'ok',
      lastSuccessRun: '2025-06-24T01:00:00Z',
      nextRun: '2025-06-25T01:00:00Z',
      planNames: ['Legal workstations'],
    },
  ],
  openAlerts: [],
  storageFootprintGb: 420,
  usageNote: 'Tenant usage via GET /api/2/tenants/{id}/usages refreshes every 5–6 hours.',
}

const metroMicrosoftCsp: MicrosoftCspInsights = {
  vendor: 'microsoft-csp',
  sourceApis: ['Partner Center REST', 'Partner Center Analytics', 'Microsoft Graph — subscribedSkus'],
  syncedAt: SYNCED,
  gdap: { status: 'active', endDate: '2026-03-10', roles: ['Directory Readers', 'License Administrator'] },
  mca: { status: 'accepted', acceptedAt: '2024-03-10' },
  subscriptions: [
    {
      subscriptionId: 'metro-bs-001',
      offerName: 'Microsoft 365 Business Standard',
      status: 'active',
      quantity: 55,
      assignedSeats: 52,
      activeUsers30d: 49,
      billingCycle: 'annual',
      commitmentEndDate: '2026-03-10',
      autoRenewEnabled: true,
      attentionNeeded: false,
      attentionReason: null,
      churnRisk: 'Low',
    },
  ],
  licenseFunnel: {
    purchasedSeats: 55,
    assignedSeats: 52,
    activeUsers30d: 49,
    utilizationPct: 89.1,
    staleLicenseCount: 3,
  },
  servicePlanIssues: [],
}

const metroAzure: MicrosoftAzureInsights = {
  vendor: 'microsoft-azure',
  sourceApis: ['Azure Cost Management export'],
  syncedAt: SYNCED,
  subscriptionId: 'azure-sub-metro-001',
  subscriptionName: 'Azure Pay-As-You-Go Subscription',
  status: 'active',
  period: '2025-06-01/2025-06-30',
  currency: 'AUD',
  totalCost: 295,
  previousPeriodCost: 280,
  changePct: 5.4,
  budget: 350,
  budgetUtilizationPct: 84.3,
  topServices: [
    { name: 'SQL Database', cost: 120, sharePct: 40.7 },
    { name: 'Virtual Machines', cost: 95, sharePct: 32.2 },
    { name: 'Storage', cost: 80, sharePct: 27.1 },
  ],
  dailyUsageSample: [],
}

const metroGcp: GoogleCloudInsights = {
  vendor: 'google-cloud',
  sourceApis: ['Google Cloud Channel API — entitlements', 'BigQuery billing export'],
  syncedAt: SYNCED,
  billingAccountId: '012345-678901-ABCDEF',
  provisioningState: 'ACTIVE',
  period: '2025-06-01/2025-06-30',
  currency: 'AUD',
  totalCost: 1350,
  previousPeriodCost: 1180,
  changePct: 14.4,
  topServices: [
    { serviceDescription: 'Compute Engine', cost: 820, sharePct: 60.7 },
    { serviceDescription: 'Cloud Storage', cost: 310, sharePct: 23.0 },
    { serviceDescription: 'BigQuery', cost: 220, sharePct: 16.3 },
  ],
  billingNote:
    'GCP project-level costs from BigQuery export. Entitlement REST only exposes billingAccountId (provisioningId).',
}

const summitGws: GoogleWorkspaceInsights = {
  vendor: 'google-workspace',
  sourceApis: ['Google Cloud Channel API — entitlements'],
  syncedAt: SYNCED,
  cloudIdentityId: 'C09876543210',
  domainVerified: true,
  entitlements: [
    {
      entitlementName: 'accounts/.../entitlements/gws-plus-summit',
      skuName: 'Google Workspace Business Plus',
      provisioningState: 'ACTIVE',
      numUnits: 35,
      assignedUnits: 32,
      maxUnits: null,
      trial: false,
      trialEndTime: null,
      commitmentEndTime: '2025-07-22',
      renewalType: 'RENEW_CURRENT_USERS_MONTHLY_PAY',
      suspensionReasons: [],
    },
  ],
  billingNote: 'Billing from BigQuery export (daily).',
  mtdCostAud: 924,
}

const summitGcp: GoogleCloudInsights = {
  vendor: 'google-cloud',
  sourceApis: ['BigQuery billing export'],
  syncedAt: SYNCED,
  billingAccountId: 'summit-billing-001',
  provisioningState: 'ACTIVE',
  period: '2025-06-01/2025-06-30',
  currency: 'AUD',
  totalCost: 180,
  previousPeriodCost: 165,
  changePct: 9.1,
  topServices: [
    { serviceDescription: 'Cloud Run', cost: 95, sharePct: 52.8 },
    { serviceDescription: 'Cloud Storage', cost: 85, sharePct: 47.2 },
  ],
  billingNote: 'GCP costs from BigQuery export — not available on entitlement GET.',
}

const SIGNALS: VendorSignal[] = [
  {
    id: 'sig-acme-gdap',
    customerId: 'cust-001',
    vendor: 'microsoft-csp',
    severity: 'warning',
    code: 'GDAP_EXPIRING',
    title: 'GDAP expiring soon',
    message: 'Delegated admin access expires 15 Jul 2025 — renew to retain license visibility.',
    sourceApi: 'Microsoft Graph — delegatedAdminRelationship',
    syncedAt: SYNCED,
  },
  {
    id: 'sig-acme-stale',
    customerId: 'cust-001',
    vendor: 'microsoft-csp',
    severity: 'info',
    code: 'STALE_LICENSES',
    title: '13 stale M365 licenses',
    message: 'Assigned users with no sign-in in 90 days — review before renewal.',
    sourceApi: 'Microsoft Graph — signInActivity',
    syncedAt: SYNCED,
  },
  {
    id: 'sig-acme-acronis-backup',
    customerId: 'cust-001',
    vendor: 'acronis',
    severity: 'critical',
    code: 'BACKUP_FAILED',
    title: 'Backup failed on ACME-FILE-02',
    message: 'Last successful backup 20 Jun — investigate agent connectivity.',
    sourceApi: 'Acronis resource_statuses — policy.backup.machine',
    syncedAt: SYNCED,
  },
  {
    id: 'sig-acme-azure-spend',
    customerId: 'cust-001',
    vendor: 'microsoft-azure',
    severity: 'info',
    code: 'AZURE_BUDGET',
    title: 'Azure at 83% of budget',
    message: '$332 MTD of $400 budget — VM category is 63% of spend.',
    sourceApi: 'Azure Cost Management export',
    syncedAt: SYNCED,
  },
  {
    id: 'sig-bright-gws-full',
    customerId: 'cust-002',
    vendor: 'google-workspace',
    severity: 'warning',
    code: 'GWS_SEATS_FULL',
    title: 'Google Workspace pool full',
    message: '10/10 seats assigned on Business Plus — add seats or reclaim licenses.',
    sourceApi: 'Cloud Channel API — entitlement parameters assigned_units',
    syncedAt: SYNCED,
  },
  {
    id: 'sig-metro-gcp-spike',
    customerId: 'cust-h001',
    vendor: 'google-cloud',
    severity: 'warning',
    code: 'GCP_SPEND_UP',
    title: 'Google Cloud spend up 14%',
    message: '$1,350 MTD vs $1,180 last month — Compute Engine is 61% of cost.',
    sourceApi: 'BigQuery reseller_billing_detailed_export_v1',
    syncedAt: SYNCED,
  },
  {
    id: 'sig-summit-gws-seats',
    customerId: 'cust-h002',
    vendor: 'google-workspace',
    severity: 'info',
    code: 'GWS_SEATS_AVAILABLE',
    title: '3 Workspace seats available',
    message: '32/35 Business Plus seats assigned.',
    sourceApi: 'Cloud Channel API — entitlement parameters',
    syncedAt: SYNCED,
  },
]

const CUSTOMER_INSIGHTS: Record<string, CustomerVendorInsights> = {
  'cust-001': {
    customerId: 'cust-001',
    syncedAt: SYNCED,
    signals: SIGNALS.filter((s) => s.customerId === 'cust-001'),
    insights: {
      'microsoft-csp': acmeMicrosoftCsp,
      'microsoft-azure': acmeAzure,
      acronis: acmeAcronis,
    },
  },
  'cust-002': {
    customerId: 'cust-002',
    syncedAt: SYNCED,
    signals: SIGNALS.filter((s) => s.customerId === 'cust-002'),
    insights: {
      'microsoft-csp': brightMicrosoftCsp,
      'google-workspace': brightGws,
      acronis: brightAcronis,
    },
  },
  'cust-h001': {
    customerId: 'cust-h001',
    syncedAt: SYNCED,
    signals: SIGNALS.filter((s) => s.customerId === 'cust-h001'),
    insights: {
      'microsoft-csp': metroMicrosoftCsp,
      'microsoft-azure': metroAzure,
      'google-cloud': metroGcp,
    },
  },
  'cust-h002': {
    customerId: 'cust-h002',
    syncedAt: SYNCED,
    signals: SIGNALS.filter((s) => s.customerId === 'cust-h002'),
    insights: {
      'google-workspace': summitGws,
      'google-cloud': summitGcp,
    },
  },
}

export function getCustomerVendorInsights(customerId: string): CustomerVendorInsights | null {
  return CUSTOMER_INSIGHTS[customerId] ?? null
}

export function listPortfolioVendorSignals(): VendorSignal[] {
  return [...SIGNALS].sort((a, b) => {
    const rank = { critical: 0, warning: 1, info: 2 }
    return rank[a.severity] - rank[b.severity]
  })
}

export function listVendorSignalsForCustomer(customerId: string): VendorSignal[] {
  return SIGNALS.filter((s) => s.customerId === customerId)
}
