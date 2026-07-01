import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-border bg-white shadow-card',
        padding && 'p-5',
        className
      )}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: ReactNode
  iconBg?: string
}

export function StatCard({ label, value, change, changeType = 'neutral', icon, iconBg = 'bg-brand-100' }: StatCardProps) {
  const changeColors = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-slate-500',
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {change && (
            <p className={cn('mt-1 text-xs font-medium', changeColors[changeType])}>{change}</p>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBg)}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
