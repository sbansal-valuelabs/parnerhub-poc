import { listCustomers, listProducts } from '../services/repository'
import type { Customer } from '../types'
import { calcSeatMrr } from '../lib/billing'
import type { ProvisionSuggestion } from './types'

function findCustomer(query: string) {
  const q = query.toLowerCase()
  return listCustomers().find(
    (c: Customer) =>
      c.name.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      (q.includes('acme') && c.id === 'cust-001') ||
      (q.includes('bright') && c.id === 'cust-002') ||
      (q.includes('legal') && c.id === 'cust-002') ||
      (q.includes('coastal') && c.id === 'cust-003') ||
      (q.includes('health') && c.id === 'cust-003') ||
      (q.includes('metro') && c.id === 'cust-h001') ||
      (q.includes('finance') && c.id === 'cust-h001') ||
      (q.includes('summit') && c.id === 'cust-h002') ||
      (q.includes('retail') && c.id === 'cust-h002') ||
      (q.includes('riverside') && c.id === 'cust-h003') ||
      (q.includes('school') && c.id === 'cust-h003')
  )
}

function matchProducts(query: string): string[] {
  const q = query.toLowerCase()
  const products = listProducts()
  const ids: string[] = []

  const add = (id: string) => {
    if (!ids.includes(id)) ids.push(id)
  }

  if (/m365|microsoft 365|office|productivity|business premium|business standard|e3/.test(q)) {
    if (/premium|bp/.test(q)) add('prod-m365-bp')
    else if (/e3|enterprise/.test(q)) add('prod-m365-e3')
    else add('prod-m365-bs')
  }
  if (/azure/.test(q)) add('prod-azure-payg')
  if (/workspace|gws|gmail/.test(q)) {
    if (/plus/.test(q)) add('prod-gws-plus')
    else if (/enterprise/.test(q)) add('prod-gws-enterprise')
    else if (/standard/.test(q)) add('prod-gws-standard')
    else add('prod-gws-plus')
  }
  if (/google cloud|gcp/.test(q)) add('prod-gcp-payg')
  if (/acronis|backup|cyber protect/.test(q)) {
    if (/complete|full/.test(q)) add('prod-acronis-complete')
    else if (/security|av/.test(q)) add('prod-acronis-security')
    else add('prod-acronis-backup')
  }
  if (/defender/.test(q)) add('prod-defender')
  if (/manufactur/.test(q) && ids.length === 0) {
    add('prod-m365-bp')
    add('prod-acronis-complete')
  }
  if (/legal|law/.test(q) && ids.length === 0) {
    add('prod-m365-e3')
    add('prod-acronis-security')
  }
  if (/health|onboard/.test(q) && ids.length === 0) {
    add('prod-m365-bs')
    add('prod-azure-payg')
  }

  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => p!.id)
}

export function suggestProvision(query: string): ProvisionSuggestion | null {
  const customer = findCustomer(query)
  const productIds = matchProducts(query)

  if (!customer) {
    if (productIds.length > 0) {
      return null
    }
    return null
  }

  const resolvedProducts =
    productIds.length > 0
      ? productIds
      : customer.status === 'onboarding'
        ? ['prod-m365-bs', 'prod-azure-payg']
        : ['prod-m365-bp']

  const products = listProducts().filter((p) => resolvedProducts.includes(p.id))
  const seats = customer.users > 0 ? customer.users : 25
  const estimatedMrr = products.reduce((sum, p) => {
    if (p.priceMonthly <= 0) return sum + 200
    return sum + calcSeatMrr(Math.max(seats, p.minSeats), p.priceMonthly)
  }, 0)

  return {
    customerId: customer.id,
    customerName: customer.name,
    productIds: resolvedProducts,
    rationale:
      customer.status === 'onboarding'
        ? `Kickstart ${customer.name}'s cloud footprint with productivity and infrastructure SKUs typical for onboarding tenants.`
        : `Suggested stack for ${customer.name} based on industry patterns and your request.`,
    estimatedMrr,
  }
}

export function buildProvisionHref(suggestion: ProvisionSuggestion): string {
  const params = new URLSearchParams({ customer: suggestion.customerId })
  if (suggestion.productIds.length === 1) {
    params.set('product', suggestion.productIds[0])
  } else if (suggestion.productIds.length > 1) {
    params.set('products', suggestion.productIds.join(','))
  }
  return `/provision?${params.toString()}`
}
