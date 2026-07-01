import { Link } from 'react-router-dom'
import { Package, KeyRound, Users, AlertTriangle, ArrowRight } from 'lucide-react'
import { PortalPageHeader } from '../../components/portal/PortalLayout'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { VendorBadge } from '../../components/ui/VendorBadge'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { useCustomers } from '../../context/CustomerContext'
import { subscriptions } from '../../data/mock'
import { getLicensesForCustomer, getUsersForCustomer, isConsumptionSku } from '../../data/portalMock'
import { getCustomerMrr } from '../../data/customerStats'
import { formatCurrency, formatDate } from '../../lib/utils'

export function PortalDashboardPage() {
  const { session } = usePortalAuth()
  const { getCustomer } = useCustomers()
  const customer = session ? getCustomer(session.customerId) : undefined
  const licenses = session ? getLicensesForCustomer(session.customerId) : []
  const seatLicenses = licenses.filter((l) => !isConsumptionSku(l.sku))
  const users = session ? getUsersForCustomer(session.customerId) : []
  const customerSubs = session
    ? subscriptions.filter((s) => s.customerId === session.customerId && s.status === 'active')
    : []

  const totalLicenses = seatLicenses.reduce((sum, l) => sum + l.total, 0)
  const assignedLicenses = seatLicenses.reduce((sum, l) => sum + l.assigned, 0)
  const activeUsers = users.filter((u) => u.status === 'active').length
  const customerMrr = session ? getCustomerMrr(session.customerId) : 0
  const lowLicensePools = seatLicenses.filter((l) => l.available <= 3 && l.available >= 0)

  if (!customer) return null

  if (customer.status === 'onboarding') {
    return (
      <>
        <PortalPageHeader title={`Welcome, ${session?.userName}`} subtitle={customer.name} />
        <Card className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Your tenant is being set up</h2>
          <p className="mt-2 text-sm text-slate-500">
            {customer.name} is currently onboarding. Products and licenses will appear here once tenant provisioning completes via Synnex.
          </p>
        </Card>
      </>
    )
  }

  return (
    <>
      <PortalPageHeader
        title={`Welcome back, ${session?.userName?.split(' ')[0]}`}
        subtitle={`${customer.name} · ${customer.domain}`}
      />

      {lowLicensePools.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Low license availability</p>
            <p className="text-sm text-amber-700">
              {lowLicensePools.map((l) => l.productName).join(', ')} — only{' '}
              {lowLicensePools.map((l) => `${l.available} left`).join(', ')}.
            </p>
          </div>
          <Link to="/portal/support">
            <Button size="sm" variant="outline" className="shrink-0">
              Request more
            </Button>
          </Link>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active products"
          value={String(customerSubs.length)}
          icon={<Package className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
        />
        <StatCard
          label="Licenses assigned"
          value={`${assignedLicenses} / ${totalLicenses}`}
          icon={<KeyRound className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-sky-100"
        />
        <StatCard
          label="Active users"
          value={String(activeUsers)}
          change={`${users.length} total in directory`}
          changeType="neutral"
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-violet-100"
        />
        <StatCard
          label="Monthly services"
          value={customerMrr > 0 ? formatCurrency(customerMrr) : '—'}
          change="Managed by your IT partner"
          changeType="neutral"
          icon={<Package className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-amber-100"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Your products</h2>
            <Link to="/portal/products" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
          {customerSubs.length === 0 ? (
            <p className="text-sm text-slate-500">No active products yet.</p>
          ) : (
            <div className="space-y-3">
              {customerSubs.slice(0, 4).map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border border-surface-border p-3">
                  <div className="flex items-center gap-3">
                    <VendorBadge vendor={sub.vendor} size="sm" showName={false} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{sub.productName}</p>
                      <p className="text-xs text-slate-500">{sub.seats} seats · Renews {formatDate(sub.renewalDate)}</p>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">License usage</h2>
            <Link to="/portal/licenses" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {seatLicenses.filter((l) => l.total > 0).slice(0, 4).map((pool) => {
              const pct = Math.round((pool.assigned / pool.total) * 100)
              return (
                <div key={pool.sku}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-700">
                      <VendorBadge vendor={pool.vendor} size="sm" showName={false} />
                      {pool.productName}
                    </span>
                    <span className="font-medium text-slate-900">{pool.assigned}/{pool.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${pct >= 95 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Need more licenses or a new product?</h2>
            <p className="mt-1 text-sm text-slate-500">Submit a request to {customer.contactName ? 'your IT partner' : 'Nexus IT Solutions'}.</p>
          </div>
          <Link to="/portal/support">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Submit request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </>
  )
}
