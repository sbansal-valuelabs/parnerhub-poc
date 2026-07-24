import type { GoogleCloudInsights } from '../../types/vendorInsights'
import { formatCurrency } from '../../lib/utils'
import { ApiSourceNote } from './MicrosoftCspInsightPanel'

interface Props {
  data: GoogleCloudInsights
}

export function GoogleCloudInsightPanel({ data }: Props) {
  return (
    <div className="space-y-4">
      <ApiSourceNote apis={data.sourceApis} syncedAt={data.syncedAt} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-surface-border px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">MTD spend</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(data.totalCost)}</p>
          <p className="text-xs text-slate-500">
            {data.changePct >= 0 ? '+' : ''}
            {data.changePct.toFixed(1)}% vs last period
          </p>
        </div>
        <div className="rounded-lg border border-surface-border px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Billing account</p>
          <p className="truncate font-mono text-xs text-slate-900">{data.billingAccountId}</p>
        </div>
        <div className="rounded-lg border border-surface-border px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">State</p>
          <p className="text-sm font-semibold text-slate-900">{data.provisioningState}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500">{data.billingNote}</p>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Top services ({data.period})
        </h4>
        <div className="space-y-2">
          {data.topServices.map((svc) => (
            <div key={svc.serviceDescription}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-700">{svc.serviceDescription}</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(svc.cost)} ({svc.sharePct.toFixed(0)}%)
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-red-400" style={{ width: `${svc.sharePct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
