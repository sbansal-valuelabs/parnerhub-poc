import { PortalPageHeader } from '../../components/portal/PortalLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { VendorBadge } from '../../components/ui/VendorBadge'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { getLicensesForCustomer, isConsumptionSku } from '../../services/repository'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

function isConsumption(sku: string) {
  return isConsumptionSku(sku)
}

export function PortalLicensesPage() {
  const { session } = usePortalAuth()
  const licenses = session ? getLicensesForCustomer(session.customerId) : []

  return (
    <>
      <PortalPageHeader
        title="Licenses"
        subtitle="Unified license view across Microsoft CSP, Azure, Google Workspace, Google Cloud, and Acronis"
        action={
          <Link to="/portal/support">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Request licenses</Button>
          </Link>
        }
      />

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Vendor</th>
                <th className="px-5 py-3">Product / SKU</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Assigned</th>
                <th className="px-5 py-3">Available</th>
                <th className="px-5 py-3">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {licenses.map((pool) => {
                const consumption = isConsumption(pool.sku)
                const pct = consumption ? 0 : Math.round((pool.assigned / pool.total) * 100)
                const isLow = !consumption && pool.available <= 3
                return (
                  <tr key={pool.sku} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <VendorBadge vendor={pool.vendor} size="sm" />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">{pool.productName}</p>
                      <p className="text-xs text-slate-500">{pool.sku}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {consumption ? 'Consumption' : pool.total}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {consumption ? '—' : pool.assigned}
                    </td>
                    <td className="px-5 py-4">
                      {consumption ? (
                        <span className="text-sm text-slate-500">Pay-as-you-go</span>
                      ) : (
                        <span className={cn('text-sm font-medium', isLow ? 'text-amber-600' : 'text-emerald-600')}>
                          {pool.available}
                          {isLow && ' — low'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {consumption ? (
                        <span className="text-xs text-slate-400">N/A</span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn('h-full rounded-full', pct >= 95 ? 'bg-amber-500' : 'bg-emerald-500')}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600">{pct}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {licenses.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">No licenses assigned yet.</div>
        )}
      </Card>
    </>
  )
}
