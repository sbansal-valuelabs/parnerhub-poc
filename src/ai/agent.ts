import { getPortfolioInsights } from './portfolioInsights'
import { suggestProvision, buildProvisionHref } from './provisionCopilot'
import { explainAgreementTopic } from './agreementAssistant'
import { formatCurrency } from '../lib/utils'
import type { AgentResponse } from './types'

const HELP_TEXT = `I can help with:

• **Portfolio insights** — "What needs attention?" or "Customer health"
• **Provisioning** — "Provision Coastal Health with M365 and AWS"
• **Agreements** — "Explain Microsoft MCA" or "What agreements are required?"

I use your live portfolio data (demo mode). Orders and agreements still need your confirmation.`

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function runAgent(userMessage: string): Promise<AgentResponse> {
  await delay(400 + Math.random() * 300)

  const q = userMessage.trim().toLowerCase()

  if (/^help$|what can you|how do you/.test(q)) {
    return { content: HELP_TEXT }
  }

  const agreementAnswer = explainAgreementTopic(q)
  if (agreementAnswer && /agreement|mca|terms|accept|legal|compliance|microsoft|aws|google/.test(q)) {
    return { content: agreementAnswer }
  }

  if (
    /insight|health|attention|recommend|portfolio|alert|what needs|status/.test(q) ||
    /customer health/.test(q)
  ) {
    const insights = getPortfolioInsights().filter((i) => i.id !== 'portfolio-mrr').slice(0, 4)
    if (insights.length === 0) {
      return { content: 'Your portfolio looks healthy — no urgent actions detected.' }
    }
    const content = insights
      .map((i) => `• **${i.title}** — ${i.description}`)
      .join('\n\n')
    return {
      content: `Here's what I'd prioritise:\n\n${content}`,
      actions: insights
        .filter((i) => i.href)
        .slice(0, 3)
        .map((i) => ({
          id: i.id,
          label: i.actionLabel ?? 'View',
          href: i.href,
          variant: i.severity === 'warning' ? 'primary' : 'outline',
        })),
    }
  }

  if (/provision|deploy|add|setup|order|give|start/.test(q) || /coastal|acme|bright/.test(q)) {
    const suggestion = suggestProvision(userMessage)
    if (suggestion) {
      const href = buildProvisionHref(suggestion)
      const productNames = suggestion.productIds.length
      return {
        content: `I suggest provisioning **${productNames} service${productNames > 1 ? 's' : ''}** for **${suggestion.customerName}**.\n\n${suggestion.rationale}${
          suggestion.estimatedMrr
            ? `\n\nEstimated added MRR: **${formatCurrency(suggestion.estimatedMrr)}**/mo (demo estimate).`
            : ''
        }`,
        actions: [
          {
            id: 'open-provision',
            label: 'Open provision wizard',
            href,
            variant: 'primary',
          },
        ],
        suggestions: [suggestion],
      }
    }
    return {
      content:
        "I couldn't match a customer from your message. Try naming **Acme**, **Bright Legal**, or **Coastal Health**, plus the products (e.g. M365, AWS, CrowdStrike).",
    }
  }

  const fallbackSuggestion = suggestProvision(userMessage)
  if (fallbackSuggestion) {
    return {
      content: `Did you want to provision for **${fallbackSuggestion.customerName}**? I can open the wizard with a suggested cart.`,
      actions: [
        {
          id: 'open-provision-fallback',
          label: 'Open provision wizard',
          href: buildProvisionHref(fallbackSuggestion),
          variant: 'primary',
        },
      ],
    }
  }

  return {
    content: `I'm not sure how to help with that yet. ${HELP_TEXT}`,
  }
}

export { getPortfolioInsights } from './portfolioInsights'
