# Microsoft vendor API reference — granular data for reseller analysis

> **Split guides:** See [vendor-apis/README.md](./vendor-apis/README.md) for per-line references (Microsoft CSP, Microsoft Azure, Google Workspace, Google Cloud, Acronis) and UI implementation status.

This document describes **what Microsoft’s official APIs can expose at a granular level**, with **concrete request/response examples**, and how that data maps to **PartnerHub UI widgets** we plan to build.

**Status:** Implemented in demo UI (mock BFF) — see `src/data/vendorInsightsMock.ts`.  
**Scope:** Microsoft CSP + Microsoft Azure (Synnex vendor lines).  
**Audience:** Product, engineering, demo script authors.

---

## 1. Context

### 1.1 Synnex vendor lines in PartnerHub

| Synnex line | PartnerHub `CloudVendor` | Primary Microsoft APIs |
|-------------|------------------------|-------------------------|
| Microsoft CSP | `microsoft-csp` | Partner Center REST, Microsoft Graph (GDAP) |
| Microsoft Azure | `microsoft-azure` | Partner Center REST, Azure Cost Management, Graph Partner Billing |

### 1.2 Where data flows in production

```
Microsoft APIs          Synnex / distributor        PartnerHub
─────────────────       ────────────────────        ──────────
Partner Center REST  →  (optional sync)          →  BFF           →  Reseller UI
Microsoft Graph      →
Azure Cost Mgmt      →
Graph Partner Billing→
```

For an **indirect CSP reseller** (Nexus IT, Horizon Cloud):

- **Subscription & order truth** → Partner Center (scoped to reseller’s customers)
- **License assignment & usage** → Microsoft Graph on customer tenant (requires **GDAP**)
- **Azure consumption detail** → Cost Management + billing exports
- **Consolidated invoice** → Often Synnex billing feed **plus** Microsoft reconciliation APIs

### 1.3 What the POC shows today (mock only)

| Screen | Current mock fields | Gap vs Microsoft APIs |
|--------|---------------------|------------------------|
| Dashboard | Portfolio MRR, customer count | No churn risk, renewals, utilization |
| Customer detail | Name, domain, subscriptions | No attention flags, GDAP status, term dates |
| Subscriptions | Seats, MRR, renewal date | No billing cycle, auto-renew, SKU IDs, upgrade paths |
| Customer portal licenses | total / assigned / available | No stale users, service plan status, sign-in activity |
| Provision wizard | Static catalog | No live MCA status, upgrade eligibility, GDAP check |

---

## 2. API families at a glance

| # | API family | Auth | Granularity | Best for |
|---|------------|------|-------------|----------|
| A | Partner Center — Customers & subscriptions | Partner user / app + MFA | Per customer, per subscription | Order state, renewals, upgrades |
| B | Partner Center — Subscription analytics | Partner user | Per subscription + aggregates | Churn risk, trial conversion |
| C | Partner Center — Azure usage analytics | Partner user | Daily per meter/region | Azure spend breakdown |
| D | Partner Center Insights (reports) | Partner user | 6-month rollups | Portfolio revenue, seat trends |
| E | Partner Center — Invoices & line items | Partner user | Per invoice line | Margin, reconciliation |
| F | Microsoft Graph — subscribedSkus & users | GDAP + app consent | Per SKU, per user | Utilization, stale licenses |
| G | Microsoft Graph — Usage reports | GDAP + Reports.Read.All | Per user/app (aggregated) | Right-sizing M365 |
| H | Microsoft Graph — GDAP relationships | Partner tenant app | Per relationship | Access expiry, roles |
| I | Azure Cost Management | Partner / customer scope | Daily cost rows | Burn rate, budgets, tags |
| J | Graph Partner Billing (async export) | Direct CSP partner | Bulk line items | Billed/unbilled reconciliation |

> **Note:** Indirect resellers via Synnex use the same Partner Center customer/subscription APIs for their portfolio. Some billing exports (J) may be limited to direct CSP; Synnex may supply equivalent files.

---

## 3. API A — Partner Center subscriptions

**Docs:** [Get subscription by ID](https://learn.microsoft.com/en-us/rest/api/partner-center/manage-orders/get-subscription-by-id)

### 3.1 Example request

```http
GET https://api.partnercenter.microsoft.com/v1/customers/a1b2c3d4-e5f6-7890-abcd-ef1234567890/subscriptions/4BF546B2-8998-4838-BEE2-5F1BBE65A04F
Authorization: Bearer {partner_center_token}
Accept: application/json
MS-CorrelationId: {guid}
MS-RequestId: {guid}
```

### 3.2 Example response (abbreviated, mapped to demo customer **Acme Manufacturing**)

```json
{
  "id": "4BF546B2-8998-4838-BEE2-5F1BBE65A04F",
  "offerId": "CFQ7TTC0LH18:0001",
  "offerName": "Microsoft 365 Business Premium",
  "friendlyName": "Acme M365 BP",
  "productType": "OnlineServicesNCE",
  "quantity": 120,
  "unitType": "Licenses",
  "status": "active",
  "autoRenewEnabled": true,
  "billingCycle": "monthly",
  "billingType": "license",
  "termDuration": "P1M",
  "commitmentEndDate": "2025-07-15T00:00:00Z",
  "effectiveStartDate": "2023-06-15T00:00:00Z",
  "creationDate": "2023-06-15T19:29:38Z",
  "partnerId": "1234567",
  "attentionNeeded": false,
  "attentionReason": null,
  "productId": "6fd2c87f-b296-42f0-b197-1e91e994b900",
  "skuId": "0001",
  "publisherName": "Microsoft Corporation",
  "scheduledNextTermInstructions": null
}
```

### 3.3 Fields → UI mapping

| API field | Example value | Proposed UI widget | Screen |
|-----------|---------------|-------------------|--------|
| `status` | `active` | Status badge (active / suspended / cancelled) | Subscriptions, Customer detail |
| `quantity` | `120` | **Purchased seats** column | Subscriptions |
| `commitmentEndDate` | `2025-07-15` | **Renewal date** + countdown | Subscriptions, Dashboard “Renewals” |
| `autoRenewEnabled` | `true` | Auto-renew icon / toggle (read-only) | Subscription detail |
| `billingCycle` | `monthly` | Billing frequency chip | Subscriptions, Provision review |
| `termDuration` | `P1M` | NCE term label (1 mo / 1 yr / 3 yr) | Subscriptions |
| `attentionNeeded` | `false` | **Action required** alert banner | Customer detail, Dashboard |
| `attentionReason` | (string) | Tooltip / detail on alert | Customer detail |
| `offerId` / `skuId` | `CFQ7TTC0LH18` | Link to catalog SKU row | Catalog, Provision |

### 3.4 Example: subscription needing attention

```json
{
  "id": "sub-azure-acme-001",
  "offerName": "Azure Plan",
  "friendlyName": "Acme Azure PAYG",
  "status": "active",
  "attentionNeeded": true,
  "attentionReason": "Payment past due — review billing profile",
  "productType": "Azure",
  "billingType": "usage",
  "quantity": 1
}
```

**UI copy example:**  
> ⚠ **Acme Manufacturing** — Azure subscription requires attention: *Payment past due — review billing profile*

---

## 4. API A — Upgrade & transition paths

**Docs:** [Get upgrades for a subscription](https://learn.microsoft.com/en-us/rest/api/partner-center/manage-orders/get-upgrades-for-a-subscription)

### 4.1 Example request

```http
GET https://api.partnercenter.microsoft.com/v1/customers/{customerTenantId}/subscriptions/{subscriptionId}/upgrades
```

### 4.2 Example response

```json
{
  "totalCount": 1,
  "items": [
    {
      "upgradeType": "upgrade_only",
      "quantity": 120,
      "isEligible": true,
      "targetOffer": {
        "id": "CFQ7TTC0LCHC:0001",
        "name": "Microsoft 365 E3",
        "description": "Enterprise productivity with compliance and information protection.",
        "minimumQuantity": 1,
        "maximumQuantity": 1000000,
        "isAutoRenewable": true,
        "supportedBillingCycles": ["monthly", "annual"],
        "product": {
          "id": "6fd2c87f-b296-42f0-b197-1e91e994b900",
          "title": "Microsoft 365 E3"
        }
      },
      "upgradeErrors": []
    }
  ]
}
```

### 4.3 UI mapping

| Widget | Example |
|--------|---------|
| **Upgrade available** chip on subscription row | “Eligible: M365 E3” |
| Provision wizard suggestion | Pre-fill cart with target offer when user asks AI “upgrade Acme to E3” |
| Customer detail CTA | “Check upgrades” → side panel listing `targetOffer.name`, supported billing cycles |

---

## 5. API B — Subscription analytics (incl. churn risk)

**Docs:** [Get all subscription analytics](https://learn.microsoft.com/en-us/partner-center/developer/get-all-subscription-analytics)

### 5.1 Example request

```http
GET https://api.partnercenter.microsoft.com/v1/analytics/subscriptions?$filter=customerTenantId eq 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```

### 5.2 Example response (single row)

```json
{
  "customerTenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerName": "Acme Manufacturing",
  "customerMarket": "AU",
  "id": "4BF546B2-8998-4838-BEE2-5F1BBE65A04F",
  "status": "ACTIVE",
  "productName": "Microsoft 365 Business Premium",
  "subscriptionType": "Microsoft365",
  "autoRenewEnabled": true,
  "friendlyName": "Acme M365 BP",
  "effectiveStartDate": "2023-06-15T00:00:00Z",
  "commitmentEndDate": "2025-07-15T00:00:00Z",
  "lastRenewalDate": "2024-07-15T02:39:57Z",
  "lastUsageDate": "2025-06-23T18:00:00Z",
  "licenseCount": 120,
  "billingCycleName": "MONTHLY",
  "churnRisk": "Low"
}
```

### 5.3 Example: high churn risk (Bright Legal trial SKU)

```json
{
  "customerName": "Bright Legal Partners",
  "productName": "Microsoft 365 E3",
  "status": "ACTIVE",
  "trialEndDate": "2025-07-01T00:00:00Z",
  "trialToPaidConversionDate": null,
  "licenseCount": 65,
  "churnRisk": "High",
  "lastUsageDate": "2025-05-12T09:00:00Z"
}
```

### 5.4 UI mapping

| Widget | Screen | Example display |
|--------|--------|-----------------|
| **Churn risk queue** | Dashboard | Table sorted by `churnRisk`: High → Medium → Low |
| **Trial expiring** | Dashboard | “Bright Legal — M365 E3 trial ends 1 Jul, no conversion yet” |
| **Last usage stale** | Customer detail | “Last activity 43 days ago” when `lastUsageDate` > 30d |
| **Renewal pipeline** | Dashboard | Group by `commitmentEndDate` month; sum `licenseCount × price` |

---

## 6. API C — Azure usage analytics (daily meters)

**Docs:** [Partner Center Analytics — Azure usage resource](https://learn.microsoft.com/en-us/partner-center/developer/partner-center-analytics-resources)

### 6.1 Example response rows (Acme Azure)

```json
[
  {
    "customerTenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "customerName": "Acme Manufacturing",
    "subscriptionId": "azure-sub-acme-001",
    "subscriptionName": "Acme Azure PAYG",
    "usageDate": "2025-06-23",
    "resourceLocation": "Australia East",
    "meterCategory": "Virtual Machines",
    "meterSubcategory": "Dv3/DSv3 Series",
    "meterUnit": "Hours",
    "serviceType": "Standard_D4s_v3",
    "quantity": 96,
    "reservationId": null
  },
  {
    "usageDate": "2025-06-23",
    "meterCategory": "Storage",
    "meterSubcategory": "Premium SSD Managed Disks",
    "meterUnit": "GB/Month",
    "quantity": 512,
    "resourceLocation": "Australia East"
  }
]
```

### 6.2 UI mapping

| Widget | Example |
|--------|---------|
| **Azure daily burn chart** | Line chart: sum `quantity × rate` by `usageDate` |
| **Top cost drivers** | Bar chart: group by `meterCategory` |
| **Region split** | Donut: `resourceLocation` |
| **RI opportunity** | Flag when `serviceType` VM hours steady & `reservationId` null |

---

## 7. API D — Partner Insights report (6-month seats & revenue)

**Docs:** [Insights system queries](https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-system-queries)

**Query ID:** `c9fc1c79-4408-49ff-97f9-e1aa3f155804` (Seats, Subscriptions and Revenue)

### 7.1 Example report row (CSV / JSON export)

```json
{
  "CustomerTenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "Name": "Acme Manufacturing",
  "CustomerMarket": "AU",
  "CustomerSegment": "Commercial",
  "Product": "Microsoft 365 Business Premium",
  "SKU": "CFQ7TTC0LH18",
  "ProductFamily": "Microsoft 365",
  "SubscriptionState": "Active",
  "IsAutoRenew": true,
  "TotalSoldSeats": 120,
  "TotalAssignedSeats": 118,
  "BilledRevenueUSD": 3948.00,
  "AzureConsumedRevenueUSD": 332.00,
  "month": "2025-06"
}
```

### 7.2 Derived metrics (computed in BFF)

```json
{
  "customerId": "cust-001",
  "month": "2025-06",
  "soldSeats": 120,
  "assignedSeats": 118,
  "assignmentRatePct": 98.3,
  "unassignedSeats": 2,
  "licenseRevenueUsd": 3948.00,
  "azureRevenueUsd": 332.00,
  "totalRevenueUsd": 4280.00
}
```

### 7.3 UI mapping

| Widget | Example |
|--------|---------|
| **Seat utilization %** | “98.3% assigned (118/120)” on customer stat card |
| **Revenue mix** | Stacked bar: CSP license vs Azure consumption |
| **Portfolio trend** | 6-month line: `TotalSoldSeats` vs `TotalAssignedSeats` |

---

## 8. API F — Microsoft Graph subscribedSkus (tenant license truth)

**Docs:** [subscribedSku resource](https://learn.microsoft.com/en-us/graph/api/resources/subscribedsku)

**Requires:** GDAP with at least **Directory Readers** + **License Administrator** (for assignment APIs).

### 8.1 Example request

```http
GET https://graph.microsoft.com/v1.0/subscribedSkus
Authorization: Bearer {token_for_customer_tenant_via_gdap}
```

### 8.2 Example response (Acme tenant)

```json
{
  "value": [
    {
      "id": "c7df2760-2c81-4ef7-b578-5b5392b571df",
      "skuId": "c7df2760-2c81-4ef7-b578-5b5392b571df",
      "skuPartNumber": "SPB",
      "capabilityStatus": "Enabled",
      "appliesTo": "User",
      "prepaidUnits": {
        "enabled": 120,
        "lockedOut": 0,
        "warning": 0,
        "suspended": 0
      },
      "consumedUnits": 118,
      "subscriptionIds": ["4BF546B2-8998-4838-BEE2-5F1BBE65A04F"],
      "servicePlans": [
        {
          "servicePlanId": "8c098270-9dd4-4350-9b30-ba4703f3b36b",
          "servicePlanName": "EXCHANGE_S_STANDARD",
          "provisioningStatus": "Success",
          "appliesTo": "User"
        },
        {
          "servicePlanName": "TEAMS1",
          "provisioningStatus": "Success",
          "appliesTo": "User"
        },
        {
          "servicePlanName": "INTUNE_A",
          "provisioningStatus": "PendingProvisioning",
          "appliesTo": "User"
        }
      ]
    }
  ]
}
```

### 8.3 Reconciliation: Partner Center vs Graph

| Source | Field | Value | Meaning |
|--------|-------|-------|---------|
| Partner Center | `quantity` | 120 | **Purchased** (billable) |
| Graph | `prepaidUnits.enabled` | 120 | **Entitled** in tenant |
| Graph | `consumedUnits` | 118 | **Assigned** to users |
| Graph | active users (usage report) | 105 | **Active** in last 30 days |

**UI example — license funnel card:**

```
Purchased 120 → Assigned 118 → Active 105
                    ↓              ↓
              2 unassigned    13 stale licences
```

### 8.4 Service plan failure example

When `provisioningStatus` ≠ `Success`:

> **Intune** — Pending provisioning (3 users affected). [View in Entra admin center]

---

## 9. API F — Stale license detection (users + sign-in)

**Docs:** [User signInActivity](https://learn.microsoft.com/en-us/graph/api/resources/user), [M365 active users report](https://learn.microsoft.com/en-us/graph/api/reportroot-getoffice365activeuserdetail)

### 9.1 Example Graph query

```http
GET https://graph.microsoft.com/v1.0/users?$select=displayName,mail,assignedLicenses,signInActivity&$filter=assignedLicenses/any(x:x/skuId eq c7df2760-2c81-4ef7-b578-5b5392b571df)
```

### 9.2 Example user rows

```json
{
  "value": [
    {
      "displayName": "Sarah Chen",
      "mail": "s.chen@acmemfg.com.au",
      "signInActivity": { "lastSignInDateTime": "2025-06-24T08:30:00Z" }
    },
    {
      "displayName": "Lisa Nguyen",
      "mail": "l.nguyen@acmemfg.com.au",
      "signInActivity": { "lastSignInDateTime": "2025-05-10T14:20:00Z" }
    }
  ]
}
```

### 9.3 BFF derived row (stale license report)

```json
{
  "customerId": "cust-001",
  "skuPartNumber": "SPB",
  "productName": "Microsoft 365 Business Premium",
  "staleThresholdDays": 90,
  "staleUsers": [
    {
      "displayName": "Lisa Nguyen",
      "email": "l.nguyen@acmemfg.com.au",
      "lastSignIn": "2025-05-10",
      "daysSinceSignIn": 45,
      "accountEnabled": false,
      "recommendation": "Remove license — account disabled"
    }
  ],
  "estimatedMonthlySavingAud": 32.90
}
```

### 9.4 UI mapping

| Widget | Screen |
|--------|--------|
| **Stale licenses table** | Customer detail → Licenses tab |
| **Right-size recommendation** | Dashboard insight card + AI assistant |
| **Export CSV** | Finance / account manager workflow |

---

## 10. API G — M365 usage reports (aggregate)

**Docs:** [Microsoft 365 usage reports](https://learn.microsoft.com/en-us/graph/api/resources/report)

### 10.1 Example: Teams active users (report CSV header + rows)

```csv
Report Refresh Date,User Principal Name,Last Activity Date,Team Chat Message Count,Call Count,Meeting Count
2025-06-24,s.chen@acmemfg.com.au,2025-06-24,142,8,12
2025-06-24,l.nguyen@acmemfg.com.au,2025-05-10,0,0,0
```

### 10.2 UI mapping

| Report | Widget |
|--------|--------|
| Office 365 active users | **Active vs licensed** headline metric |
| Exchange / Teams / OneDrive activity | Per-app adoption bars |
| Mailbox usage | Storage alert before E3 → E5 upsell |

---

## 11. API H — GDAP relationship status

**Docs:** [delegatedAdminRelationship](https://learn.microsoft.com/en-us/graph/api/resources/delegatedadminrelationship)

### 11.1 Example response

```json
{
  "id": "gdap-acme-001",
  "displayName": "Nexus IT — Acme Manufacturing",
  "status": "active",
  "duration": "P730D",
  "autoExtendDuration": "P180D",
  "createdDateTime": "2023-06-15T10:00:00Z",
  "activatedDateTime": "2023-06-16T08:00:00Z",
  "lastModifiedDateTime": "2025-06-01T12:00:00Z",
  "endDateTime": "2025-06-15T10:00:00Z",
  "customer": {
    "tenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "displayName": "Acme Manufacturing"
  },
  "accessDetails": {
    "unifiedRoles": [
      { "roleDefinitionId": "88d8e3e3-8f55-4a1e-953a-9b9898ba287c", "roleDefinitionDisplayName": "Directory Readers" },
      { "roleDefinitionId": "4d6f8745-4f0a-4b5e-8b2e-8b2e8b2e8b2e", "roleDefinitionDisplayName": "License Administrator" }
    ]
  }
}
```

### 11.2 UI mapping

| Condition | UI |
|-----------|-----|
| `endDateTime` within 30 days | Amber banner: “GDAP expires 15 Jun — request extension” |
| `status` ≠ active | Red banner: “Cannot read license data — GDAP inactive” |
| Missing License Administrator role | Provision wizard warning: “Limited access — cannot assign licenses” |

---

## 12. API I — Azure Cost Management (customer consumption)

**Docs:** [Cost Management for partners](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/get-started-partners)

### 12.1 Example Cost Details row (export CSV)

```csv
Date,SubscriptionId,ResourceGroup,ServiceName,MeterCategory,Region,CostUSD,CostAUD,Tags
2025-06-23,azure-sub-acme-001,rg-prod,Virtual Machines,Compute,Australia East,42.18,64.50,"env=prod;app=erp"
2025-06-23,azure-sub-acme-001,rg-prod,Storage,Storage,Australia East,8.04,12.30,"env=prod"
```

### 12.2 BFF aggregated response (for dashboard widget)

```json
{
  "customerId": "cust-001",
  "period": "2025-06-01/2025-06-30",
  "currency": "AUD",
  "totalCost": 332.00,
  "previousPeriodCost": 298.50,
  "changePct": 11.2,
  "topServices": [
    { "name": "Virtual Machines", "costAud": 210.40, "sharePct": 63.4 },
    { "name": "Storage", "costAud": 68.20, "sharePct": 20.5 },
    { "name": "Networking", "costAud": 53.40, "sharePct": 16.1 }
  ],
  "forecastMonthEndAud": 345.00,
  "budgetAud": 400.00,
  "budgetUtilizationPct": 83.0
}
```

### 12.3 UI mapping

| Widget | Example copy |
|--------|--------------|
| **Azure MTD spend** | “$332 MTD (+11% vs last month)” |
| **Budget gauge** | “83% of $400 budget” |
| **Cost by service** | Horizontal bar chart |
| **Anomaly alert** | “VM spend up 28% WoW — review rg-prod” |

---

## 13. API E/J — Billing & invoice line items

**Docs:** [Invoice resources](https://learn.microsoft.com/en-us/partner-center/developer/invoice-resources), [Billed reconciliation v2](https://learn.microsoft.com/en-us/partner-center/developer/billed-invoice-reconciliation)

### 13.1 Example license-based line item

```json
{
  "invoiceNumber": "G123456789",
  "customerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerName": "Acme Manufacturing",
  "customerDomainName": "acmemfg.com.au",
  "customerCountry": "AU",
  "productName": "Microsoft 365 Business Premium",
  "skuName": "CFQ7TTC0LH18",
  "quantity": 120,
  "unitPrice": 32.90,
  "totalAmount": 3948.00,
  "currency": "AUD",
  "chargeType": "CycleCharge",
  "billingCycle": "Monthly",
  "resellerMpnId": 7654321,
  "partnerId": 1234567
}
```

### 13.2 Example daily rated usage line (Azure)

```json
{
  "customerName": "Acme Manufacturing",
  "subscriptionId": "azure-sub-acme-001",
  "meterCategory": "Virtual Machines",
  "meterSubCategory": "Dv3/DSv3 Series",
  "resourceLocation": "AU East",
  "usageDate": "2025-06-23",
  "quantity": 96,
  "unit": "Hours",
  "billingPreTaxTotal": 42.18,
  "currency": "AUD"
}
```

### 13.3 Margin analysis (BFF computed — uses Synnex price list)

```json
{
  "customerId": "cust-001",
  "productName": "Microsoft 365 Business Premium",
  "seats": 120,
  "listPricePerSeatAud": 32.90,
  "distributorCostPerSeatAud": 28.79,
  "resellerMarginPerSeatAud": 4.11,
  "resellerMarginPct": 12.5,
  "monthlyMarginAud": 493.20
}
```

---

## 14. Proposed BFF normalised models (for UI consumption)

These shapes decouple UI from raw Microsoft payloads. Live mode BFF would map APIs → these types.

### 14.1 `MicrosoftCustomerInsights`

```typescript
interface MicrosoftCustomerInsights {
  customerId: string
  tenantId: string
  gdap: {
    status: 'active' | 'pending' | 'expired' | 'none'
    endDate: string | null
    roles: string[]
  }
  mca: {
    status: 'accepted' | 'pending' | 'unknown'
    acceptedAt: string | null
  }
  licenseSummary: {
    purchasedSeats: number
    assignedSeats: number
    activeUsers30d: number
    utilizationPct: number
    staleLicenseCount: number
  }
  azureSummary: {
    mtdCostAud: number
    budgetAud: number | null
    changePctVsLastMonth: number
  }
  alerts: Array<{
    severity: 'info' | 'warning' | 'critical'
    code: string
    message: string
    actionHref?: string
  }>
}
```

### 14.2 Example populated for **Acme Manufacturing**

```json
{
  "customerId": "cust-001",
  "tenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "gdap": {
    "status": "active",
    "endDate": "2025-06-15",
    "roles": ["Directory Readers", "License Administrator"]
  },
  "mca": { "status": "accepted", "acceptedAt": "2023-06-15" },
  "licenseSummary": {
    "purchasedSeats": 120,
    "assignedSeats": 118,
    "activeUsers30d": 105,
    "utilizationPct": 87.5,
    "staleLicenseCount": 13
  },
  "azureSummary": {
    "mtdCostAud": 332.00,
    "budgetAud": 400.00,
    "changePctVsLastMonth": 11.2
  },
  "alerts": [
    {
      "severity": "warning",
      "code": "GDAP_EXPIRING",
      "message": "GDAP expires in 12 days — renew to retain license visibility"
    },
    {
      "severity": "info",
      "code": "STALE_LICENSES",
      "message": "13 assigned licenses with no sign-in in 90 days — est. saving $426/mo"
    }
  ]
}
```

---

## 15. Screen-by-screen widget plan (with examples)

### 15.1 Dashboard — “Customers needing attention”

**Data sources:** B (churn risk), A (attentionNeeded), F (stale licenses), I (Azure anomaly)

| Customer | Signal | Example row |
|----------|--------|-------------|
| Bright Legal | `churnRisk: High` | “Trial ending — no paid conversion” |
| Acme | `staleLicenseCount: 13` | “13 stale M365 licenses” |
| Metro Finance | Azure +28% WoW | “Azure spend spike — $1,350 MTD” |

### 15.2 Customer detail — Microsoft tab (new)

Sections:
1. **GDAP & MCA** — status chips  
2. **License funnel** — purchased → assigned → active  
3. **Subscriptions table** — Partner Center fields (§3)  
4. **Stale users** — Graph sign-in (§9)  
5. **Azure cost** — Cost Management summary (§12)  

### 15.3 Subscriptions list — extra columns

| Column | Source |
|--------|--------|
| Purchased | `quantity` |
| Assigned | Graph `consumedUnits` |
| Active (30d) | Usage report |
| Renewal | `commitmentEndDate` |
| Auto-renew | `autoRenewEnabled` |
| Churn risk | Analytics `churnRisk` |

### 15.4 Provision wizard — pre-flight checks

Before step “Agreements”:

```json
{
  "checks": [
    { "name": "MCA", "status": "pass", "detail": "Accepted 15 Jun 2023" },
    { "name": "GDAP", "status": "pass", "detail": "License Administrator active until 15 Jun 2025" },
    { "name": "Credit", "status": "pass", "detail": "$48,750 available of $75,000 Synnex credit" },
    { "name": "Upgrade path", "status": "info", "detail": "Eligible upgrade to M365 E3 available" }
  ]
}
```

### 15.5 Customer portal — license panel (read-only subset)

End customers see (no distributor margin):

- Assigned vs purchased seats  
- Their own stale users (optional policy)  
- Azure budget vs spend (if partner enabled policy)

---

## 16. Sync & auth checklist

| API | Auth | Sync frequency | Notes |
|-----|------|----------------|-------|
| Partner Center subscriptions | Partner Center token (MFA from Apr 2026) | Every 15–60 min | Webhook-style unavailable — poll |
| Subscription analytics | Partner Center token | Daily | Churn / trial fields |
| Graph subscribedSkus | GDAP + customer tenant token | Hourly | Per customer |
| Graph sign-in / usage | GDAP + Reports.Read.All | Daily | Large tenants — async report download |
| Azure Cost Management | Partner billing scope | Daily export | Use Exports API for scale |
| Invoice line items | Partner Center / Graph billing | Monthly + on invoice | Match Synnex invoice date |

---

## 17. Implementation phases (recommended)

| Phase | APIs | UI deliverable |
|-------|------|----------------|
| **1** | A, B | Subscription table + renewal pipeline + churn queue |
| **2** | F, G | License funnel + stale license report |
| **3** | I, C | Azure cost dashboard + meter breakdown |
| **4** | E, J, D | Margin analysis + invoice reconciliation |
| **5** | H | GDAP health + provision pre-flight |

---

## 18. Official references

- [Partner Center REST API](https://learn.microsoft.com/en-us/partner-center/develop/partner-center-rest-api-reference)
- [Subscription analytics](https://learn.microsoft.com/en-us/partner-center/developer/get-all-subscription-analytics)
- [Partner Center Analytics resources](https://learn.microsoft.com/en-us/partner-center/developer/partner-center-analytics-resources)
- [Partner Insights system queries](https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-system-queries)
- [Microsoft Graph subscribedSku](https://learn.microsoft.com/en-us/graph/api/resources/subscribedsku)
- [GDAP API overview](https://learn.microsoft.com/en-us/graph/api/resources/delegatedadminrelationships-api-overview)
- [M365 usage reports](https://learn.microsoft.com/en-us/graph/api/resources/report)
- [Cost Management for partners](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/get-started-partners)
- [Graph Partner Billing API](https://learn.microsoft.com/en-us/graph/api/resources/partners-billing-api-overview)
- [Billed invoice reconciliation v2](https://learn.microsoft.com/en-us/partner-center/developer/billed-invoice-reconciliation)

---

## 19. Related PartnerHub docs

- [DEMO_GUIDE.md](../DEMO_GUIDE.md) — current mock demo script  
- Future: `docs/bff-microsoft-integration.md` — endpoint mapping & env vars (when live mode is built)
