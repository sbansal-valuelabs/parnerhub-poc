# Demo guide — data interpretation

Use **two demo reseller organisations**, each with **3 customers**. All dollar amounts are **AUD**.

---

## Demo resellers

| Reseller | Tier | Login as | Portfolio MRR | Story |
|----------|------|----------|---------------|--------|
| **Nexus IT Solutions** | Gold Cloud Partner | Alex Morgan | **$10,622.60** | Established MSP — manufacturing & legal |
| **Horizon Cloud Services** | Silver Cloud Partner | Chris Freeman | **$4,633.00** | Growth partner — finance & retail |

**Reseller sign-in:** `/login` — pick an organisation card, then quick-login as admin.

---

## Nexus IT Solutions — demo customers

| # | Customer | Status | Portal login | Story |
|---|----------|--------|--------------|--------|
| 1 | **Acme Manufacturing** | Active | Sarah Chen | Multi-vendor flagship (Microsoft + AWS + CrowdStrike) |
| 2 | **Bright Legal Partners** | Active | James Morrison | Multi-vendor legal firm (Microsoft + Adobe + Google) |
| 3 | **Coastal Health Group** | Onboarding | — | Empty state — tenant being provisioned |

---

## 1. Acme Manufacturing

### Subscriptions (must sum to **$6,200.00/mo**)

| Product | Vendor | Seats | Price/seat/mo | Calculation | MRR |
|---------|--------|-------|---------------|-------------|-----|
| Microsoft 365 Business Premium | Microsoft | 120 | $32.90 | 120 × 32.90 | **$3,948.00** |
| Azure Subscription | Microsoft | — | consumption | avg Jun bill | **$332.00** |
| AWS EC2 & Core Services | AWS | — | consumption | avg Jun bill | **$540.00** |
| CrowdStrike Falcon Pro | CrowdStrike | 120 | $11.50 | 120 × 11.50 | **$1,380.00** |
| | | | | **Total** | **$6,200.00** |

### License pools (seat-based only)

| Product | Total | Assigned | Available | Utilisation |
|---------|-------|----------|-----------|-------------|
| M365 Business Premium | 120 | 118 | 2 | 98% — **almost full** |
| CrowdStrike Falcon Pro | 120 | 115 | 5 | 96% |
| Azure / AWS | — | — | — | Consumption (no seats) |

**Licensed users (118)** = M365 assigned count (primary productivity SKU).

### Customer portal talking points

- Low M365 availability (2 seats left) → request more licenses
- 4 active products across 3 vendors in one view
- Monthly services **$6,200** matches reseller customer detail

---

## 2. Bright Legal Partners

### Subscriptions (must sum to **$4,422.60/mo**)

| Product | Vendor | Seats | Price/seat/mo | Calculation | MRR |
|---------|--------|-------|---------------|-------------|-----|
| Microsoft 365 E3 | Microsoft | 65 | $48.60 | 65 × 48.60 | **$3,159.00** |
| Adobe Acrobat Sign | Adobe | 40 | $24.99 | 40 × 24.99 | **$999.60** |
| Google Workspace Business Plus | Google | 10 | $26.40 | 10 × 26.40 | **$264.00** |
| | | | | **Total** | **$4,422.60** |

### License pools

| Product | Total | Assigned | Available |
|---------|-------|----------|-----------|
| M365 E3 | 65 | 63 | 2 |
| Adobe Acrobat Sign | 40 | 38 | 2 |
| Google Workspace Plus | 10 | 10 | **0 — full** |

**Licensed users (63)** = M365 E3 assigned count.

### Customer portal talking points

- Google pool **10/10 full** — triggers low-license alert on dashboard
- Legal firm using different vendors for different teams

---

## 3. Coastal Health Group

- **Onboarding** — no subscriptions, $0 MRR, 0 users
- Use for: Add Customer flow, onboarding banner, empty portal state

---

## Portfolio (Nexus reseller dashboard)

| Metric | Value | How derived |
|--------|-------|-------------|
| **Total MRR** | **$10,622.60** | Acme $6,200 + Bright Legal $4,422.60 |
| Active customers | 2 | Acme + Bright Legal |
| Active subscriptions | 7 | 4 + 3 |
| Onboarding | 1 | Coastal Health |
| Synnex credit used | 35% | $26,250 of $75,000 limit |

---

## Horizon Cloud Services — demo customers

| # | Customer | Status | Portal login | Story |
|---|----------|--------|--------------|--------|
| 1 | **Metro Finance Group** | Active | Tom Bradley | Finance — Microsoft + Salesforce + Defender |
| 2 | **Summit Retail Co** | Active | — | Retail — Google + AWS + M365 |
| 3 | **Riverside Schools** | Onboarding | — | Education empty state |

### Metro Finance Group — **$3,064.00/mo**

| Product | Vendor | Seats | MRR |
|---------|--------|-------|-----|
| Microsoft 365 Business Standard | Microsoft | 55 | $1,023.00 |
| Azure Subscription | Microsoft | — | $295.00 |
| Salesforce Sales Cloud Professional | Salesforce | 18 | $1,350.00 |
| Microsoft Defender for Endpoint P2 | Microsoft | 55 | $396.00 |
| | | **Total** | **$3,064.00** |

### Summit Retail Co — **$1,569.00/mo**

| Product | Vendor | Seats | MRR |
|---------|--------|-------|-----|
| Google Workspace Business Plus | Google | 35 | $924.00 |
| AWS Business Support | AWS | — | $180.00 |
| Microsoft 365 Business Standard | Microsoft | 25 | $465.00 |
| | | **Total** | **$1,569.00** |

### Horizon portfolio

| Metric | Value |
|--------|-------|
| **Total MRR** | **$4,633.00** |
| Active customers | 2 |
| Onboarding | 1 (Riverside Schools) |
| Synnex credit used | 54.5% | $21,800 of $40,000 limit |

---

## Key formulas (used in the app)

### MRR (Monthly Recurring Revenue)

```
Seat-based:  MRR = seats × monthly list price
Consumption: MRR = average monthly spend (from last billing period)
```

Annual billing does **not** reduce MRR — we always normalise to monthly:
```
Example: CrowdStrike 120 seats × $11.50 = $1,380/mo MRR
         (even though billed annually: 120 × $138 = $16,560/yr)
```

### Reseller margin (catalog)

```
Partner margin/mo = MRR × margin %
Example: M365 BP 120 seats → $3,948 × 12% = $473.76/mo gross margin
```

### License utilisation

```
Utilisation % = assigned ÷ total × 100
Available     = total − assigned
```

### Customer MRR (UI)

Computed live from active subscriptions (`getCustomerMrr()`), so customer list and detail always match the Subscriptions page.

---

## Recommended demo script (~10 min)

0. **Home** (`/`) — Choose reseller or customer portal  
1. **Reseller login** — Pick **Nexus IT** or **Horizon Cloud**, sign in as admin  
2. **Dashboard** — Portfolio scoped to selected reseller  
1. **Reseller login** — Quick login as Alex Morgan (Administrator)  
2. **Dashboard** — Portfolio MRR **$10,623**, 2 active + 1 onboarding, vendor breakdown  
2. **Customers → Acme** — Walk through **$6,200** MRR, 4 subs, 118 users  
3. **Subscriptions** — Show line items; verify Acme rows sum to $6,200  
4. **Cloud Marketplace** — Filter AWS, show margin % and activation time  
4. **Provision** — Coastal Health: add Microsoft + AWS → **Agreements** step shows **AI agreement assistant** (summarise + per-vendor explain)  
5. **Team** — Reseller staff roles (Admin vs Provisioning)  
6. **Customer portal** — Login as **Acme / Sarah Chen** → Products, Licenses, **License assistant**  
7. **Customer portal** — Login as **Bright Legal / James Morrison** → Google pool full  

**PartnerHub AI entry points**
- **Floating ✨ button** (bottom-right) — portfolio insights & provisioning copilot (not in sidebar)
- **Dashboard** — AI portfolio insights banner
- **Provision → Agreements** — AI agreement assistant panel (visible on step 4)

---

## PartnerHub AI (demo agent)

Reseller app includes a rule-based **PartnerHub AI** assistant (sidebar, floating button, dashboard insight cards). It reads portfolio data via `src/services/repository` — same path production agents would use.

**Try in the reseller portal:**
1. Dashboard → review **AI portfolio insights** banner  
2. Click **PartnerHub AI** → *"What needs attention?"*  
3. *"Provision Coastal Health with M365 and AWS"* → **Open provision wizard**  
4. *"Explain Microsoft MCA"* before the agreements step  

**Customer portal:** Acme or Bright Legal → **License assistant** on Overview (*"How many licenses are available?"*)

Agent code: `src/ai/` · UI: `src/components/ai/` · Production: swap `runAgent()` for an LLM with tool calling.

---

## Provision wizard — vendor agreements (step 4)

When the cart spans one or more vendors, step **Agreements** lists required terms before review:

| Vendor | Agreement(s) in demo |
|--------|----------------------|
| Microsoft | Microsoft Customer Agreement (MCA) + CSP Partner Authorisation |
| AWS | AWS Customer Agreement |
| Google | Google Workspace / Cloud Terms |
| Adobe | Adobe Enterprise Terms & VIP |
| CrowdStrike | Falcon Master Subscription Agreement |
| Salesforce | Master Subscription Agreement |

**Demo talking points**

- Legacy distributor portals often bury agreements in separate admin screens — PartnerHub surfaces them **in the order flow**
- Reseller attests on behalf of customer; MCA can also be emailed to customer contact (production)
- Accepted agreements appear on **Review** and are **recorded for audit** on success
- Click **View full agreement** to open the document viewer (sample MCA / AWS / vendor terms styled like production PDFs)

**Suggested demo cart for Coastal Health:** M365 Business Basic + AWS EC2 — triggers **3 agreements** (2× Microsoft, 1× AWS).

---

## What the user table shows

The **Users** tab in the customer portal shows a **sample** of employees (5–6 rows), not every licensed user. The **Licensed users** count and **license pools** reflect the full organisation.

---

## Editing data safely

When changing `src/data/mock.ts`:

1. Update **seats** on subscription  
2. Recalculate **MRR** = seats × `product.priceMonthly` (or set consumption estimate)  
3. Update matching **license pool** `total` to match subscription seats  
4. Set `assigned + available = total`  
5. Update customer `licensedUsers` to match primary SKU assigned count  

Or use helpers in `src/lib/billing.ts` and `calcSeatMrr()`.
