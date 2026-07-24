import type { MicrosoftCspInsights } from '../../types/vendorInsights'
import { formatDate } from '../../lib/utils'

interface Props {
  data: MicrosoftCspInsights
}

export function MicrosoftCspInsightPanel({ data }: Props) {
  const { licenseFunnel, gdap, mca, subscriptions, servicePlanIssues } = data

  return (
    <div className="space-y-4">
      <ApiSourceNote apis={data.sourceApis} syncedAt={data.syncedAt} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatusChip label="GDAP" value={gdap.status} detail={gdap.endDate ? `Expires ${formatDate(gdap.endDate)}` : undefined} />
        <StatusChip label="MCA" value={mca.status} detail={mca.acceptedAt ? `Since ${formatDate(mca.acceptedAt)}` : undefined} />
      </div>

      {gdap.roles.length > 0 && (
        <p className="text-xs text-slate-500">
          GDAP roles: {gdap.roles.join(', ')}
        </p>
      )}

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          License funnel (Partner Center quantity → Graph assigned → active users)
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <FunnelStep label="Purchased" value={licenseFunnel.purchasedSeats} />
          <FunnelStep label="Assigned" value={licenseFunnel.assignedSeats} />
          <FunnelStep label="Active (30d)" value={licenseFunnel.activeUsers30d} />
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Utilization {licenseFunnel.utilizationPct}% · {licenseFunnel.staleLicenseCount} stale licences (no sign-in 90d)
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Subscriptions</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-slate-500">
                <th className="pb-2 pr-3 font-medium">Offer</th>
                <th className="pb-2 pr-3 font-medium">Seats</th>
                <th className="pb-2 pr-3 font-medium">Renewal</th>
                <th className="pb-2 pr-3 font-medium">Churn</th>
                <th className="pb-2 font-medium">Auto-renew</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {subscriptions.map((sub) => (
                <tr key={sub.subscriptionId}>
                  <td className="py-2 pr-3 font-medium text-slate-900">{sub.offerName}</td>
                  <td className="py-2 pr-3 text-slate-600">
                    {sub.quantity}
                    {sub.assignedSeats != null && ` / ${sub.assignedSeats} assigned`}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{formatDate(sub.commitmentEndDate)}</td>
                  <td className="py-2 pr-3">
                    {sub.churnRisk ? (
                      <span
                        className={
                          sub.churnRisk === 'High'
                            ? 'text-red-600'
                            : sub.churnRisk === 'Medium'
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                        }
                      >
                        {sub.churnRisk}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-2 text-slate-600">{sub.autoRenewEnabled ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {servicePlanIssues.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <p className="font-medium">Service plan provisioning issues (Graph subscribedSku)</p>
          <ul className="mt-1 list-disc pl-4">
            {servicePlanIssues.map((issue) => (
              <li key={issue.servicePlanName}>
                {issue.servicePlanName}: {issue.provisioningStatus}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function FunnelStep({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-2">
      <p className="text-lg font-semibold text-slate-900">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}

function StatusChip({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-semibold capitalize text-slate-900">{value}</p>
      {detail && <p className="text-xs text-slate-500">{detail}</p>}
    </div>
  )
}

function ApiSourceNote({ apis, syncedAt }: { apis: string[]; syncedAt: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Data sources</p>
      <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
        {apis.map((api) => (
          <li key={api}>• {api}</li>
        ))}
      </ul>
      <p className="mt-1 text-[10px] text-slate-400">Last synced {new Date(syncedAt).toLocaleString()}</p>
    </div>
  )
}

export { ApiSourceNote }
