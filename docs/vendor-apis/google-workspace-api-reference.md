# Google Workspace — API reference & UI mapping

**Synnex line:** Google Workspace  
**PartnerHub vendor id:** `google-workspace`  
**Status:** Design reference — UI uses mock BFF shaped like these APIs.

## Official documentation

| API | URL |
|-----|-----|
| Cloud Channel API (preferred) | https://cloud.google.com/channel/docs/reference/rest |
| Entitlements resource | https://cloud.google.com/channel/docs/reference/rest/v1/accounts.customers.entitlements |
| Customers resource | https://cloud.google.com/channel/docs/reference/rest/v1/accounts.customers |
| Workspace Reseller API (legacy) | https://developers.google.com/workspace/admin/reseller/reference/rest |
| Subscription resource | https://developers.google.com/workspace/admin/reseller/reference/rest/v1/subscriptions |
| Enterprise License Manager (per-user) | https://developers.google.com/workspace/admin/licensing/reference/rest/v1/licenseAssignments |
| BigQuery billing export | https://cloud.google.com/channel/docs/rebilling/export-data-to-bigquery |

## Auth

- Cloud Channel: service account + domain-wide delegation as reseller super admin
- Scope: `https://www.googleapis.com/auth/apps.order`
- License Manager (optional): `https://www.googleapis.com/auth/apps.licensing`

## Example: Cloud Channel entitlement

```http
GET https://cloudchannel.googleapis.com/v1/accounts/{account}/customers/{customer}/entitlements/{entitlement}
```

```json
{
  "name": "accounts/C01234567890/customers/brightlegal/entitlements/gws-plus",
  "provisioningState": "ACTIVE",
  "provisionedService": {
    "provisioningId": "subscription-id-from-reseller-api",
    "skuId": "1010020020"
  },
  "parameters": [
    { "name": "num_units", "value": { "int64Value": "10" } },
    { "name": "assigned_units", "value": { "int64Value": "10" } }
  ],
  "trialSettings": { "trial": false },
  "commitmentSettings": {
    "startTime": "2024-01-22T00:00:00Z",
    "endTime": "2025-07-22T00:00:00Z",
    "renewalSettings": { "renewalPolicy": "RENEW_CURRENT_USERS_MONTHLY_PAY" }
  },
  "suspensionReasons": []
}
```

> **Feasibility:** `assigned_units` and `num_units` are documented Workspace entitlement parameters.

## Example: Reseller API subscription (legacy)

```http
GET https://reseller.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}
```

```json
{
  "customerId": "brightlegal.com.au",
  "subscriptionId": "763923019488",
  "skuId": "1010020020",
  "skuName": "Google Workspace Business Plus",
  "status": "ACTIVE",
  "seats": {
    "numberOfSeats": 10,
    "licensedNumberOfSeats": 10
  },
  "plan": {
    "planName": "ANNUAL",
    "isCommitmentPlan": true,
    "commitmentInterval": {
      "startTime": "1705900800000",
      "endTime": "1737523200000"
    }
  },
  "customerDomainVerified": true
}
```

## Billing (not live REST on entitlement)

Seat **costs** come from BigQuery table `reseller_billing_detailed_export_v1` (daily refresh):

```json
{
  "customer_name": "accounts/.../customers/brightlegal",
  "sku": { "description": "Google Workspace Business Plus" },
  "usage": { "amount": 10, "unit": "seats" },
  "customer_cost": 264.0,
  "currency": "AUD"
}
```

## UI widgets (implemented)

| Widget | API fields |
|--------|------------|
| Entitlement cards | `provisioningState`, `num_units`, `assigned_units`, trial/commitment |
| Domain verified | Reseller `customerDomainVerified` or Channel customer domain |
| MTD cost note | BigQuery export (with disclaimer in UI) |
| Signal: seats full | `assigned_units >= num_units` |

## Not feasible

- **Live REST** dollar amounts on entitlement GET
- **customers.list** on Workspace Reseller API (discover via subscriptions.list or Channel customers.list)
- **Per-user roster** without Enterprise License Manager API
