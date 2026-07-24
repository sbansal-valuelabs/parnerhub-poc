import type { GoogleWorkspaceInsights } from '../../types/vendorInsights'
import { formatCurrency, formatDate } from '../../lib/utils'
import { ApiSourceNote } from './MicrosoftCspInsightPanel'

interface Props {
  data: GoogleWorkspaceInsights
}

export function GoogleWorkspaceInsightPanel({ data }: Props) {
  return (
    <div className="space-y-4">
      <ApiSourceNote apis={data.sourceApis} syncedAt={data.syncedAt} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-surface-border px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Domain verified</p>
          <p className="text-sm font-semibold text-slate-900">{data.domainVerified ? 'Yes' : 'No'}</p>
        </div>
        {data.cloudIdentityId && (
          <div className="rounded-lg border border-surface-border px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Cloud Identity ID</p>
            <p className="truncate text-sm font-mono text-slate-900">{data.cloudIdentityId}</p>
          </div>
        )}
      </div>

      {data.mtdCostAud != null && (
        <p className="text-sm text-slate-700">
          MTD cost (BigQuery export): <strong>{formatCurrency(data.mtdCostAud)}</strong>
        </p>
      )}
      <p className="text-xs text-slate-500">{data.billingNote}</p>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Entitlements</h4>
        <div className="space-y-3">
          {data.entitlements.map((ent) => (
            <div key={ent.entitlementName} className="rounded-lg border border-surface-border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{ent.skuName}</p>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600">
                  {ent.provisioningState}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-semibold text-slate-900">{ent.numUnits}</p>
                  <p className="text-slate-500">Purchased</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{ent.assignedUnits}</p>
                  <p className="text-slate-500">Assigned</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {ent.maxUnits ?? '—'}
                  </p>
                  <p className="text-slate-500">Max</p>
                </div>
              </div>
              {ent.trial && ent.trialEndTime && (
                <p className="mt-2 text-xs text-amber-700">Trial ends {formatDate(ent.trialEndTime)}</p>
              )}
              {ent.commitmentEndTime && !ent.trial && (
                <p className="mt-2 text-xs text-slate-500">Commitment ends {formatDate(ent.commitmentEndTime)}</p>
              )}
              {ent.suspensionReasons.length > 0 && (
                <p className="mt-2 text-xs text-red-600">Suspended: {ent.suspensionReasons.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
