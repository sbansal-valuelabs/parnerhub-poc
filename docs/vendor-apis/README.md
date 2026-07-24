# Vendor API reference — Synnex marketplace lines

Design documentation for **PartnerHub vendor insights**. Every field shown in the UI maps to a **documented official API** — see each vendor guide for endpoints, example payloads, feasibility limits, and UI widgets.

| Synnex line | Document | Primary APIs |
|-------------|----------|--------------|
| Microsoft CSP | [microsoft-csp-api-reference.md](./microsoft-csp-api-reference.md) | Partner Center REST, Partner Center Analytics, Microsoft Graph (GDAP) |
| Microsoft Azure | [microsoft-azure-api-reference.md](./microsoft-azure-api-reference.md) | Partner Center Analytics, Azure Cost Management, Graph Partner Billing |
| Google Workspace | [google-workspace-api-reference.md](./google-workspace-api-reference.md) | Cloud Channel API entitlements, Workspace Reseller API |
| Google Cloud | [google-cloud-api-reference.md](./google-cloud-api-reference.md) | Cloud Channel API, BigQuery billing export |
| Acronis | [acronis-api-reference.md](./acronis-api-reference.md) | Account Management, resource_statuses, Alert Manager, Vault Manager |

## Architecture

```
Vendor APIs  →  PartnerHub BFF (normalise)  →  Reseller UI
                     ↑
              Synnex (orders, invoice) optional
```

## BFF types (UI consumption)

Normalised shapes live in `src/types/vendorInsights.ts`. Mock data in `src/data/vendorInsightsMock.ts` mirrors API field names from the guides above.

## What we deliberately do not show

- Fields not returned by any documented API
- Real-time dollar amounts on Google entitlements (billing is BigQuery export, daily)
- EDR incident UI from Acronis `/api/mdr/v1/incidents` (official docs: not intended for direct UI)
- Distributor-only BigQuery columns for indirect resellers

## UI surfaces

| Screen | Component |
|--------|-----------|
| Dashboard | `PortfolioVendorSignalsCard` |
| Customer detail → Vendor insights tab | `CustomerVendorInsightsSection` + per-vendor panels |
