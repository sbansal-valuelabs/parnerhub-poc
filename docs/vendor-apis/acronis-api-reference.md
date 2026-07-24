# Acronis — API reference & UI mapping

**Synnex line:** Acronis  
**PartnerHub vendor id:** `acronis`  
**Status:** Design reference — UI uses mock BFF shaped like these APIs.

## Official documentation

| API | URL |
|-----|-----|
| Integration guide | https://developer.acronis.com/doc/ |
| Account Management | https://developer.acronis.com/doc/account-management/v2/guide/tenants/index.html |
| resource_statuses (protection) | https://developer.acronis.com/doc/outbound/scenarios/rmm/monitoring.html |
| Alert Manager | https://developer.acronis.com/doc/connector/managing-alerts/fetching-alerts/index.html |
| Vault Manager (backups) | https://developer.acronis.com/doc/vaultman/v1/reference/index.html |
| Workload Management v5 | https://developer.acronis.com/doc/connector/managing-workloads/fetching-workloads/index.html |
| Protection status blog (JSON examples) | https://www.acronis.com/en/blog/posts/protection-status-report-for-acronis-cyber-cloud-protected-workloads/ |

## Auth

```http
POST {datacenter_url}/api/2/idp/token
Authorization: Basic {base64(client_id:client_secret)}
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
```

Customer-scoped reads (protection data):

```http
POST {datacenter_url}/bc/idp/token
grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer
&assertion={base_token}
&scope=urn:acronis.com:tenant-id:{customer_tenant_uuid}
```

Token TTL: **2 hours** (documented).

## Example: tenant (customer)

```http
GET {datacenter_url}/api/2/tenants/{tenant_id}
```

```json
{
  "id": "acronis-tenant-acme-001",
  "name": "Acme Manufacturing",
  "kind": "customer",
  "enabled": true,
  "mfa_status": "enabled",
  "pricing_mode": "production"
}
```

## Example: resource_statuses (backup compliance)

```http
GET /api/resource_management/v4/resource_statuses?type=resource.machine&include_attributes=true&tenant_id={uuid}
```

```json
{
  "items": [{
    "context": {
      "name": "ACME-FILE-02",
      "tenant_id": "acronis-tenant-acme-001",
      "type": "resource.machine"
    },
    "aggregate": {
      "status": "critical",
      "names": "Server backup — nightly"
    },
    "policies": [{
      "type": "policy.backup.machine",
      "last_success_run": "2025-06-20T02:00:00Z",
      "next_run": "2025-06-25T02:00:00Z"
    }]
  }]
}
```

## Example: alert

```http
GET /api/alert_manager/v1/alerts?tenant={uuid}&severity=or(warning,critical)
```

```json
{
  "severity": "critical",
  "details": {
    "title": "Backup failed — ACME-FILE-02",
    "description": "Agent failed to complete backup task"
  },
  "createdAt": "2025-06-21T03:15:00Z"
}
```

## Example: #CyberFit (resource attributes)

```http
GET /api/resource_management/v4/resources/{id}/attributes
```

```json
{
  "cyberfit": {
    "cyberfit_score_value": 78,
    "cyberfit_score_assessment_date": "2025-06-22"
  }
}
```

## Usage / billing

```http
GET /api/2/tenants/{tenant_id}/usages
```

> Documented **5–6 hour refresh lag**. For billing reports use `POST /api/2/reports`.

## UI widgets (implemented)

| Widget | API |
|--------|-----|
| Protection summary counts | Aggregate `resource_statuses` by `aggregate.status` |
| Backup compliance table | `policies[]` where `type=policy.backup.machine` |
| Open alerts list | Alert Manager |
| #CyberFit score | Resource attributes |
| Storage footprint | Vault Manager `/vaults` or `/archives` stats |
| Signal: backup failed | Alert + `last_success_run` stale |

## Not feasible (per official docs)

- **EDR incidents UI** from `GET /api/mdr/v1/incidents` — docs state not intended for direct user-facing UI
- **Real-time usage** from `/tenants/usages` (5–6 hr lag)
- **Instant** protection status without polling (RMM scenario recommends interval sync)
