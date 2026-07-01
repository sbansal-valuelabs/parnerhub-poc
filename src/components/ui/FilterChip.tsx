import { cn } from '../../lib/utils'

interface FilterChipProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
  className?: string
}

/** Consistent filter / tab chip used across list pages */
export function FilterChip({ active, onClick, children, count, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'border border-transparent text-slate-600 hover:bg-slate-100',
        className
      )}
    >
      {children}
      {count != null && (
        <span className={cn('ml-1.5 text-xs', active ? 'text-brand-100' : 'opacity-70')}>
          ({count})
        </span>
      )}
    </button>
  )
}
