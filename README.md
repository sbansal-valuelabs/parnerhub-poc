# PartnerHub POC

A **multi-vendor cloud marketplace + B2B2C portal** demo — designed to replace the friction of legacy distributor marketplaces (e.g. Synnex) with a unified, user-friendly experience.

## Vision

| Pain point (legacy marketplace) | PartnerHub demo |
|--------------------------------|-----------------|
| Separate portals per vendor | **One marketplace** — Microsoft, AWS, Google, Adobe, CrowdStrike, Salesforce |
| Opaque pricing & margin | **Margin % and activation ETA** on every SKU |
| Slow, confusing provisioning | **Guided 5-step wizard** with vendor agreements across all vendors |
| No end-customer self-service | **Customer portal** — products, licenses, users across vendors |
| Fragmented subscription view | **Unified subscriptions** with vendor badges |

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — home page with two portal options.

- **Home:** http://localhost:5173/
- **Reseller login:** http://localhost:5173/login
- **Customer login:** http://localhost:5173/portal/login

## Demo flows

**Read [DEMO_GUIDE.md](./DEMO_GUIDE.md) for accurate MRR math and a 10-minute demo script.**

### Reseller (B2B)
1. **Cloud Marketplace** — filter by vendor, browse 16+ SKUs
2. **Provision** — multi-vendor cart, vendor agreement acceptance, one workflow
3. **Subscriptions** — portfolio-wide view with vendor column
4. **Add customer** — multi-vendor cloud account setup

### End customer (B2C)
1. Quick login as **Acme Manufacturing** (multi-vendor: Microsoft + AWS + CrowdStrike)
2. **My Products** — grouped by vendor
3. **Licenses** — unified table across all vendors
4. **Support** — request licenses/products from IT partner

## Vendors in demo catalog

Microsoft · AWS · Google · Adobe · CrowdStrike · Salesforce

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router

All data is mocked by default (`VITE_DATA_MODE=mock`). Set `VITE_DATA_MODE=live` and run a BFF at `/api/v1` for real vendor integration — see `src/api/` and `src/services/`.
