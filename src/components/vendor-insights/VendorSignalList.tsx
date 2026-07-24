import { AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { VendorBadge } from '../ui/VendorBadge'
import type { VendorSignal } from '../../types/vendorInsights'
import { cn } from '../../lib/utils'

const severityStyles = {
  critical: 'border-red-200 bg-red-50 text-red-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
}

const severityIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

interface VendorSignalListProps {
  signals: VendorSignal[]
  showVendor?: boolean
  compact?: boolean
}

export function VendorSignalList({ signals, showVendor = true, compact = false }: VendorSignalListProps) {
  if (signals.length === 0) {
    return (
      <p className="text-sm text-slate-500">No vendor signals from connected APIs.</p>
    )
  }

  return (
    <ul className={cn('space-y-2', compact && 'space-y-1.5')}>
      {signals.map((signal) => {
        const Icon = severityIcons[signal.severity]
        return (
          <li
            key={signal.id}
            className={cn(
              'rounded-lg border px-3 py-2.5',
              severityStyles[signal.severity],
              compact && 'py-2'
            )}
          >
            <div className="flex gap-2">
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {showVendor && <VendorBadge vendor={signal.vendor} size="sm" showName={false} />}
                  <p className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>{signal.title}</p>
                </div>
                <p className={cn('mt-0.5 opacity-90', compact ? 'text-[11px]' : 'text-xs')}>
                  {signal.message}
                </p>
                {!compact && (
                  <p className="mt-1 text-[10px] uppercase tracking-wide opacity-60">
                    Source: {signal.sourceApi}
                  </p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
