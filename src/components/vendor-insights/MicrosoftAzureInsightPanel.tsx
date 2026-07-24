import type { MicrosoftAzureInsights } from '../../types/vendorInsights'
import { formatCurrency } from '../../lib/utils'
import { ApiSourceNote } from './MicrosoftCspInsightPanel'

interface Props {
  data: MicrosoftAzureInsights
}

export function MicrosoftAzureInsightPanel({ data }: Props) {
  return (
    <div className="space-y-4">
      <ApiSourceNote apis={data.sourceApis} syncedAt={data.syncedAt} />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="MTD spend"
          value={formatCurrency(data.totalCost)}
          sub={
            data.changePct >= 0
              ? `+${data.changePct.toFixed(1)}% vs last period`
              : `${data.changePct.toFixed(1)}% vs last period`
          }
        />
        {data.budget != null && (
          <MetricCard
            label="Budget used"
            value={`${data.budgetUtilizationPct?.toFixed(0) ?? '—'}%`}
            sub={`${formatCurrency(data.totalCost)} of ${formatCurrency(data.budget)}`}
          />
        )}
        <MetricCard label="Subscription" value={data.status} sub={data.subscriptionName} />
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Top services ({data.period})
        </h4>
        <div className="space-y-2">
          {data.topServices.map((svc) => (
            <div key={svc.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-700">{svc.name}</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(svc.cost)} ({svc.sharePct.toFixed(0)}%)
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${svc.sharePct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.dailyUsageSample.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sample daily usage (Partner Center Analytics)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-slate-500">
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Meter</th>
                  <th className="pb-2 pr-3 font-medium">Region</th>
                  <th className="pb-2 font-medium">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data.dailyUsageSample.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-3 text-slate-600">{row.usageDate}</td>
                    <td className="py-2 pr-3 text-slate-900">{row.meterCategory}</td>
                    <td className="py-2 pr-3 text-slate-600">{row.resourceLocation}</td>
                    <td className="py-2 text-slate-600">
                      {row.quantity} {row.meterUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
