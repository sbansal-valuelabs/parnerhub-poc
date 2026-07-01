import type { CloudVendor } from '../../types'
import { getVendor } from '../../lib/vendors'
import { cn } from '../../lib/utils'

export function VendorBadge({
  vendor,
  size = 'sm',
  showName = true,
}: {
  vendor: CloudVendor
  size?: 'sm' | 'md'
  showName?: boolean
}) {
  const config = getVendor(vendor)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgColor,
        config.color,
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        size === 'md' && 'px-2.5 py-1 text-xs'
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded font-bold',
          size === 'sm' && 'h-4 w-4 text-[9px]',
          size === 'md' && 'h-5 w-5 text-[10px]'
        )}
      >
        {config.shortName}
      </span>
      {showName && config.name}
    </span>
  )
}

export function VendorLogo({ vendor, className }: { vendor: CloudVendor; className?: string }) {
  const config = getVendor(vendor)
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg font-bold',
        config.bgColor,
        config.color,
        className ?? 'h-10 w-10 text-sm'
      )}
    >
      {config.shortName}
    </div>
  )
}
