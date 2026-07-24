import type { AcronisInsights } from '../../types/vendorInsights'
import { formatDate, formatRelativeTime } from '../../lib/utils'
import { ApiSourceNote } from './MicrosoftCspInsightPanel'

interface Props {
  data: AcronisInsights
}

export function AcronisInsightPanel({ data }: Props) {
  const { protectionSummary } = data

  return (
    <div className="space-y-4">
      <ApiSourceNote apis={data.sourceApis} syncedAt={data.syncedAt} />

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Machines" value={protectionSummary.totalMachines} />
        <Stat label="Protected" value={protectionSummary.protected} />
        <Stat label="Critical" value={protectionSummary.critical} accent="text-red-600" />
        <Stat label="No policy" value={protectionSummary.noPolicies} accent="text-amber-600" />
      </div>

      {data.cyberFitScore != null && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <p className="text-sm font-medium text-emerald-900">
            #CyberFit score: {data.cyberFitScore}/100
          </p>
          {data.cyberFitAssessedAt && (
            <p className="text-xs text-emerald-700">Assessed {formatDate(data.cyberFitAssessedAt)}</p>
          )}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Storage footprint: {data.storageFootprintGb.toLocaleString()} GB · MFA: {data.mfaStatus} ·{' '}
        {data.usageNote}
      </p>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Backup compliance (resource_statuses)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-slate-500">
                <th className="pb-2 pr-3 font-medium">Machine</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 pr-3 font-medium">Last success</th>
                <th className="pb-2 font-medium">Next run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {data.backupCompliance.map((row) => (
                <tr key={row.machineName}>
                  <td className="py-2 pr-3 font-medium text-slate-900">{row.machineName}</td>
                  <td className="py-2 pr-3">
                    <span className={row.status === 'critical' ? 'text-red-600' : 'text-emerald-600'}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-slate-600">
                    {row.lastSuccessRun ? formatRelativeTime(row.lastSuccessRun) : '—'}
                  </td>
                  <td className="py-2 text-slate-600">
                    {row.nextRun ? formatDate(row.nextRun) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.openAlerts.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Open alerts (Alert Manager)
          </h4>
          <ul className="space-y-1.5 text-xs">
            {data.openAlerts.map((alert, i) => (
              <li key={i} className="flex justify-between rounded border border-surface-border px-2 py-1.5">
                <span className="font-medium text-slate-900">{alert.title}</span>
                <span className="text-slate-500">{alert.severity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: string
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-white px-3 py-2 text-center">
      <p className={`text-lg font-semibold ${accent ?? 'text-slate-900'}`}>{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}
