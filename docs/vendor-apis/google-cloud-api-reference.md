# Google Cloud — API reference & UI mapping

**Synnex line:** Google Cloud  
**PartnerHub vendor id:** `google-cloud`  
**Status:** Design reference — UI uses mock BFF shaped like these APIs.

## Official documentation

| API | URL |
|-----|-----|
| Cloud Channel API | https://cloud.google.com/channel/docs/reference/rest |
| Entitlements | https://cloud.google.com/channel/docs/reference/rest/v1/accounts.customers.entitlements |
| queryEligibleBillingAccounts | https://cloud.google.com/channel/docs/reference/rest/v1/accounts.customers/queryEligibleBillingAccounts |
| BigQuery billing export | https://cloud.google.com/channel/docs/rebilling/export-data-to-bigquery |
| Export query examples | https://cloud.google.com/channel/docs/rebilling/example-export-queries |

## Example: GCP entitlement (REST)

```json
{
  "name": "accounts/.../customers/metrofinance/entitlements/gcp-payg",
  "provisioningState": "ACTIVE",
  "provisionedService": {
    "provisioningId": "012345-678901-ABCDEF",
    "productId": "google-cloud-platform",
    "skuId": "GCP_PAYG"
  },
  "parameters": [
    { "name": "displayName", "value": { "stringValue": "Metro Finance GCP" } }
  ]
}
```

> **Feasibility:** For GCP, `provisionedService.provisioningId` is the **billing account ID** per Channel API docs — not project-level usage.

## Example: BigQuery export row (project costs)

```json
{
  "customer_name": "accounts/.../customers/metrofinance",
  "billing_account_id": "012345-678901-ABCDEF",
  "project": { "id": "metro-prod-001", "name": "Metro Production" },
  "service": { "description": "Compute Engine" },
  "sku": { "description": "N2 Instance Core running in APAC" },
  "usage": {
    "amount": 720,
    "unit": "seconds",
    "amount_in_pricing_unit": 0.2,
    "pricing_unit": "hour"
  },
  "customer_cost": 820.0,
  "currency": "AUD",
  "usage_start_time": "2025-06-01T00:00:00Z",
  "usage_end_time": "2025-06-30T23:59:59Z"
}
```

## BFF aggregation (UI)

```json
{
  "billingAccountId": "012345-678901-ABCDEF",
  "provisioningState": "ACTIVE",
  "totalCost": 1350,
  "changePct": 14.4,
  "topServices": [
    { "serviceDescription": "Compute Engine", "cost": 820, "sharePct": 60.7 }
  ],
  "billingNote": "GCP project-level costs from BigQuery export — not on entitlement GET."
}
```

## UI widgets (implemented)

| Widget | Source |
|--------|--------|
| Billing account ID | Entitlement `provisionedService.provisioningId` |
| MTD spend + top services | BigQuery export aggregation |
| Signal: spend spike | BFF compares current vs previous period from export |

## Not feasible

- Project/service **cost breakdown** on Cloud Channel entitlement REST alone
- **Real-time** billing (export is daily incremental)
- Distributor-only columns (`channel_partner_cost`) for indirect resellers
