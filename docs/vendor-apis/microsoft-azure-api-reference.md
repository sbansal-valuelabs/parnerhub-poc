# Microsoft Azure — API reference & UI mapping

**Synnex line:** Microsoft Azure  
**PartnerHub vendor id:** `microsoft-azure`  
**Status:** Design reference — UI uses mock BFF shaped like these APIs.

## Official documentation

| API | URL |
|-----|-----|
| Partner Center Azure usage analytics | https://learn.microsoft.com/en-us/partner-center/developer/partner-center-analytics-resources |
| Cost Management for partners | https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/get-started-partners |
| Cost Management Exports REST | https://learn.microsoft.com/en-us/rest/api/cost-management/exports |
| Graph Partner Billing (async) | https://learn.microsoft.com/en-us/graph/api/resources/partners-billing-api-overview |
| Billed reconciliation v2 | https://learn.microsoft.com/en-us/partner-center/developer/billed-invoice-reconciliation |

## Auth requirements

- Partner Center token for analytics subscription rows
- Azure Resource Manager / Cost Management scope on customer billing account or subscription
- Graph Partner Billing: direct CSP partners (indirect may use Synnex reconciliation feeds)

## Example: Azure usage analytics (daily meters)

From Partner Center Analytics `Azure usage` resource:

```json
{
  "customerTenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerName": "Acme Manufacturing",
  "subscriptionId": "azure-sub-acme-001",
  "usageDate": "2025-06-23",
  "resourceLocation": "Australia East",
  "meterCategory": "Virtual Machines",
  "meterSubcategory": "Dv3/DSv3 Series",
  "meterUnit": "Hours",
  "serviceType": "Standard_D4s_v3",
  "quantity": 96
}
```

## Example: Cost Management export row (aggregated in BFF)

Cost details / export CSV columns (paraphrased from Azure docs):

```csv
Date,ServiceName,MeterCategory,ResourceLocation,CostUSD,Currency
2025-06-23,Virtual Machines,Compute,Australia East,42.18,AUD
```

## BFF aggregation example (UI payload)

```json
{
  "period": "2025-06-01/2025-06-30",
  "currency": "AUD",
  "totalCost": 332,
  "previousPeriodCost": 298.5,
  "changePct": 11.2,
  "budget": 400,
  "budgetUtilizationPct": 83,
  "topServices": [
    { "name": "Virtual Machines", "cost": 210.4, "sharePct": 63.4 }
  ]
}
```

> **Feasibility:** Budget vs actual requires Cost Management budget resources configured on the billing scope. Top services come from export aggregation — not a single Partner Center GET.

## UI widgets (implemented)

| Widget | Source |
|--------|--------|
| MTD spend + % change | Cost Management export / cost details API |
| Budget gauge | Azure budgets API |
| Top services bar chart | Export grouped by `meterCategory` or `ServiceName` |
| Daily usage sample table | Partner Center Analytics Azure usage |
| Signal: budget threshold | BFF rule on `budgetUtilizationPct` |

## Not feasible

- **Classic CSP** Azure plans: Cost Management docs state Azure Plan / MCA customers — not legacy classic CSP
- **Real-time** per-resource costs in Partner Center REST (use Cost Management with latency)
- **Single REST call** for full month of all customers at resource grain (use Exports or Graph async billing)
