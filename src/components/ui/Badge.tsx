import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  className?: string
}

const variants = {
  default: 'bg-brand-100 text-brand-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    active: { label: 'Active', variant: 'success' },
    onboarding: { label: 'Onboarding', variant: 'info' },
    suspended: { label: 'Suspended', variant: 'danger' },
    pending: { label: 'Pending', variant: 'warning' },
    cancelled: { label: 'Cancelled', variant: 'neutral' },
  }
  const config = map[status] ?? { label: status, variant: 'neutral' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
