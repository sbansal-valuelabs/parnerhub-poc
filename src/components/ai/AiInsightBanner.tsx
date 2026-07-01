import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, AlertTriangle, Info, TrendingUp } from 'lucide-react'
import { getPortfolioInsights } from '../../ai/portfolioInsights'
import { useAiAssistant } from '../../context/AiAssistantContext'
import { cn } from '../../lib/utils'
import type { AiInsight } from '../../ai/types'

const severityStyles = {
  warning: {
    border: 'border-amber-200 bg-amber-50/80',
    icon: 'text-amber-600 bg-amber-100',
    Icon: AlertTriangle,
  },
  info: {
    border: 'border-sky-200 bg-sky-50/80',
    icon: 'text-sky-600 bg-sky-100',
    Icon: Info,
  },
  success: {
    border: 'border-emerald-200 bg-emerald-50/80',
    icon: 'text-emerald-600 bg-emerald-100',
    Icon: TrendingUp,
  },
}

export function AiInsightBanner() {
  const { openWithPrompt } = useAiAssistant()
  const insights = getPortfolioInsights().filter((i: AiInsight) => i.id !== 'portfolio-mrr').slice(0, 3)

  if (insights.length === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50/80 to-brand-50/50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-brand-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI portfolio insights</p>
            <p className="text-xs text-slate-500">Based on subscriptions, license pools, and onboarding status</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => openWithPrompt('What needs attention in my portfolio?')}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Ask follow-up →
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {insights.map((insight: AiInsight) => {
          const style = severityStyles[insight.severity]
          const Icon = style.Icon
          const inner = (
            <div
              className={cn(
                'flex h-full items-start gap-3 rounded-lg border p-3 transition-colors',
                style.border,
                insight.href && 'hover:shadow-sm'
              )}
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', style.icon)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{insight.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{insight.description}</p>
                {insight.actionLabel && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                    {insight.actionLabel}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          )
          return insight.href ? (
            <Link key={insight.id} to={insight.href}>
              {inner}
            </Link>
          ) : (
            <div key={insight.id}>{inner}</div>
          )
        })}
      </div>
    </div>
  )
}
