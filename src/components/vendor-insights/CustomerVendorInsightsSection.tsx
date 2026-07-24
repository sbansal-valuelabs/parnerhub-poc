import { useState } from 'react'
import { Card } from '../ui/Card'
import { VendorBadge } from '../ui/VendorBadge'
import { VendorSignalList } from './VendorSignalList'
import { MicrosoftCspInsightPanel } from './MicrosoftCspInsightPanel'
import { MicrosoftAzureInsightPanel } from './MicrosoftAzureInsightPanel'
import { GoogleWorkspaceInsightPanel } from './GoogleWorkspaceInsightPanel'
import { GoogleCloudInsightPanel } from './GoogleCloudInsightPanel'
import { AcronisInsightPanel } from './AcronisInsightPanel'
import type { CloudVendor } from '../../types'
import type { CustomerVendorInsights, VendorInsightBundle } from '../../types/vendorInsights'
import { getVendor } from '../../lib/vendors'
import { cn } from '../../lib/utils'

interface Props {
  insights: CustomerVendorInsights
}

const VENDOR_ORDER: CloudVendor[] = [
  'microsoft-csp',
  'microsoft-azure',
  'google-workspace',
  'google-cloud',
  'acronis',
]

function renderPanel(bundle: VendorInsightBundle) {
  switch (bundle.vendor) {
    case 'microsoft-csp':
      return <MicrosoftCspInsightPanel data={bundle} />
    case 'microsoft-azure':
      return <MicrosoftAzureInsightPanel data={bundle} />
    case 'google-workspace':
      return <GoogleWorkspaceInsightPanel data={bundle} />
    case 'google-cloud':
      return <GoogleCloudInsightPanel data={bundle} />
    case 'acronis':
      return <AcronisInsightPanel data={bundle} />
    default:
      return null
  }
}

export function CustomerVendorInsightsSection({ insights }: Props) {
  const vendorKeys = VENDOR_ORDER.filter((v) => insights.insights[v])
  const [active, setActive] = useState<CloudVendor>(vendorKeys[0] ?? 'microsoft-csp')

  if (vendorKeys.length === 0) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-slate-900">Vendor insights</h2>
        <p className="mt-2 text-sm text-slate-500">
          No vendor API data for this customer yet. Insights appear once subscriptions are provisioned and
          integrations sync.
        </p>
      </Card>
    )
  }

  const activeBundle = insights.insights[active]

  return (
    <div className="space-y-4">
      {insights.signals.length > 0 && (
        <Card>
          <h2 className="mb-3 text-base font-semibold text-slate-900">Vendor signals</h2>
          <VendorSignalList signals={insights.signals} showVendor={false} />
        </Card>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-slate-900">Vendor insights</h2>
          <p className="text-xs text-slate-500">
            Aggregated from official vendor APIs ·{' '}
            <a href="/help#vendor-apis" className="text-brand-600 hover:underline">
              API reference
            </a>
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {vendorKeys.map((vendor) => (
            <button
              key={vendor}
              type="button"
              onClick={() => setActive(vendor)}
              className={cn(
                'rounded-full border px-3 py-1.5 transition-colors',
                active === vendor
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                  : 'border-surface-border bg-white hover:bg-slate-50'
              )}
            >
              <VendorBadge vendor={vendor} size="sm" />
            </button>
          ))}
        </div>

        {activeBundle && (
          <>
            <p className="mb-3 text-sm text-slate-600">{getVendor(active).description}</p>
            {renderPanel(activeBundle)}
          </>
        )}
      </Card>
    </div>
  )
}
