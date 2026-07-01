import {
  listCustomers,
  getLicensesForCustomer,
  isConsumptionSku,
  getCustomerStats,
  getPortfolioMrr,
  getResellerProfile,
} from '../services/repository'
import type { AiInsight } from './types'
import { formatCurrency } from '../lib/utils'

/** Rule-based portfolio analysis — production would use an LLM over synced vendor data */
export function getPortfolioInsights(): AiInsight[] {
  const insights: AiInsight[] = []
  const customers = listCustomers()
  const portfolioMrr = getPortfolioMrr()
  const profile = getResellerProfile()
  const creditUsedPct =
    ((profile.creditLimit - profile.creditAvailable) / profile.creditLimit) * 100

  for (const customer of customers) {
    if (customer.status === 'onboarding') {
      insights.push({
        id: `onboarding-${customer.id}`,
        severity: 'warning',
        title: `${customer.name} still onboarding`,
        description: 'No active subscriptions yet. Complete tenant linking and provision initial services.',
        customerId: customer.id,
        href: `/provision?customer=${customer.id}`,
        actionLabel: 'Start provisioning',
      })
      continue
    }

    const pools = getLicensesForCustomer(customer.id).filter((p) => !isConsumptionSku(p.sku))
    for (const pool of pools) {
      if (pool.total > 0 && pool.available <= 3) {
        insights.push({
          id: `low-seats-${customer.id}-${pool.sku}`,
          severity: pool.available === 0 ? 'warning' : 'info',
          title:
            pool.available === 0
              ? `${customer.name}: ${pool.productName} pool full`
              : `${customer.name}: only ${pool.available} ${pool.productName} seats left`,
          description: `${pool.assigned}/${pool.total} assigned (${Math.round((pool.assigned / pool.total) * 100)}% utilisation). Consider a seat increase before new hires.`,
          customerId: customer.id,
          href: `/customers/${customer.id}`,
          actionLabel: 'View customer',
        })
      }
    }

    const stats = getCustomerStats(customer.id)
    if (stats.mrr > 0 && stats.activeSubscriptions >= 3) {
      insights.push({
        id: `upsell-${customer.id}`,
        severity: 'success',
        title: `${customer.name} is a strong multi-vendor account`,
        description: `${stats.activeSubscriptions} active services · ${formatCurrency(stats.mrr)}/mo MRR. Good candidate for security or backup upsell.`,
        customerId: customer.id,
        href: `/catalog`,
        actionLabel: 'Browse marketplace',
      })
    }
  }

  if (creditUsedPct > 30) {
    insights.push({
      id: 'credit-usage',
      severity: 'info',
      title: `Synnex credit ${creditUsedPct.toFixed(0)}% utilised`,
      description: `${formatCurrency(profile.creditAvailable)} available of ${formatCurrency(profile.creditLimit)} limit. Monitor before large multi-vendor orders.`,
      href: '/settings',
      actionLabel: 'View settings',
    })
  }

  insights.push({
    id: 'portfolio-mrr',
    severity: 'info',
    title: `Portfolio MRR ${formatCurrency(portfolioMrr)}`,
    description: `${listCustomers().filter((c) => c.status === 'active').length} active customers across Microsoft, AWS, Google, Adobe, and CrowdStrike.`,
    href: '/subscriptions',
    actionLabel: 'View subscriptions',
  })

  return insights.slice(0, 6)
}
