# Microsoft CSP — API reference & UI mapping

**Synnex line:** Microsoft CSP  
**PartnerHub vendor id:** `microsoft-csp`  
**Status:** Design reference — UI uses mock BFF shaped like these APIs.

## Official documentation

| API | URL |
|-----|-----|
| Partner Center REST | https://learn.microsoft.com/en-us/partner-center/develop/partner-center-rest-api-reference |
| Get subscription | https://learn.microsoft.com/en-us/rest/api/partner-center/manage-orders/get-subscription-by-id |
| Subscription analytics | https://learn.microsoft.com/en-us/partner-center/developer/get-all-subscription-analytics |
| Graph subscribedSku | https://learn.microsoft.com/en-us/graph/api/resources/subscribedsku |
| Graph GDAP | https://learn.microsoft.com/en-us/graph/api/resources/delegatedadminrelationships-api-overview |
| Partner Insights reports | https://learn.microsoft.com/en-us/partner-center/insights/insights-programmatic-system-queries |

## Auth requirements

- **Partner Center:** Partner user credentials + MFA (mandatory from April 2026)
- **Graph tenant data:** GDAP relationship + app consent in customer tenant
- **Indirect reseller (Synnex):** Same customer/subscription APIs for own portfolio; billing may also flow via Synnex

## Example: subscription (Partner Center)

```http
GET https://api.partnercenter.microsoft.com/v1/customers/{tenantId}/subscriptions/{subscriptionId}
```

```json
{
  "id": "4BF546B2-8998-4838-BEE2-5F1BBE65A04F",
  "offerName": "Microsoft 365 Business Premium",
  "quantity": 120,
  "status": "active",
  "autoRenewEnabled": true,
  "billingCycle": "monthly",
  "termDuration": "P1M",
  "commitmentEndDate": "2025-07-15T00:00:00Z",
  "attentionNeeded": false,
  "attentionReason": null
}
```

## Example: subscription analytics (churn risk)

```http
GET https://api.partnercenter.microsoft.com/v1/analytics/subscriptions
```

```json
{
  "customerTenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "productName": "Microsoft 365 Business Premium",
  "status": "ACTIVE",
  "licenseCount": 120,
  "churnRisk": "Low",
  "lastUsageDate": "2025-06-23T18:00:00Z",
  "commitmentEndDate": "2025-07-15T00:00:00Z",
  "billingCycleName": "MONTHLY"
}
```

> **Feasibility:** `churnRisk` is documented on the Partner Center Analytics subscription resource.

## Example: Graph subscribedSku (assigned seats)

```http
GET https://graph.microsoft.com/v1.0/subscribedSkus
```

```json
{
  "skuPartNumber": "SPB",
  "prepaidUnits": { "enabled": 120 },
  "consumedUnits": 118,
  "capabilityStatus": "Enabled",
  "servicePlans": [
    {
      "servicePlanName": "INTUNE_A",
      "provisioningStatus": "PendingProvisioning"
    }
  ]
}
```

## Example: GDAP relationship

```json
{
  "status": "active",
  "endDateTime": "2025-07-15T10:00:00Z",
  "accessDetails": {
    "unifiedRoles": [
      { "roleDefinitionDisplayName": "License Administrator" }
    ]
  }
}
```

## UI widgets (implemented)

| Widget | API fields |
|--------|------------|
| License funnel | `quantity` → `consumedUnits` → active users (Graph signInActivity / usage reports) |
| Subscription table | `offerName`, `quantity`, `commitmentEndDate`, `autoRenewEnabled`, `churnRisk` |
| GDAP / MCA chips | Graph GDAP + Partner Center MCA attestation |
| Service plan warnings | `servicePlans[].provisioningStatus` |
| Vendor signals | Derived from GDAP expiry, stale licenses, `attentionNeeded` |

## Not feasible via CSP APIs alone

- Per-user license list without Graph (use Graph or license assignment APIs)
- Customer tenant sign-in without GDAP + Entra P1/P2 for signInActivity
- Real-time invoice margin (use Partner Center invoices + Synnex price list)
