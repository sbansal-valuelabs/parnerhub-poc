import { getLicensesForCustomer, isConsumptionSku, getCustomerMrr } from '../services/repository'
import { formatCurrency } from '../lib/utils'

export function answerPortalQuestion(query: string, customerId: string): string | null {
  const q = query.toLowerCase()
  const pools = getLicensesForCustomer(customerId).filter((p) => !isConsumptionSku(p.sku))

  if (/license|seat|available|spare|left|pool/.test(q)) {
    if (pools.length === 0) {
      return 'No seat-based license pools are assigned yet. Contact your IT partner to provision services.'
    }
    const lines = pools.map(
      (p) =>
        `• **${p.productName}**: ${p.available} available (${p.assigned}/${p.total} assigned)`
    )
    const low = pools.filter((p) => p.available <= 3)
    const footer =
      low.length > 0
        ? `\n\n⚠ ${low.map((p) => p.productName).join(', ')} ${low.length === 1 ? 'is' : 'are'} running low — consider requesting more licenses.`
        : ''
    return `License availability:\n\n${lines.join('\n')}${footer}`
  }

  if (/mrr|spend|cost|bill|monthly/.test(q)) {
    const mrr = getCustomerMrr(customerId)
    return mrr > 0
      ? `Your organisation's monthly services total **${formatCurrency(mrr)}** across all active subscriptions (normalised MRR).`
      : 'No recurring charges yet — your tenant may still be onboarding.'
  }

  if (/product|service|subscription|what do we have/.test(q)) {
    return 'Open **My Products** to see everything across Microsoft, Google Workspace, Google Cloud, and Acronis in one list.'
  }

  return null
}
