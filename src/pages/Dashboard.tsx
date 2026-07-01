import { Link } from 'react-router-dom'
import {
  Users,
  DollarSign,
  Layers,
  TrendingUp,
  ArrowRight,
  Package,
  UserPlus,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { Header } from '../components/layout/Sidebar'
import { StatCard, Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import {
  listSubscriptions,
  listActivities,
  getResellerProfile,
  getMarketplaceStats,
  getPortfolioSummary,
} from '../services/repository'
import { getPortfolioMrr, getCustomerStats } from '../data/customerStats'
import { vendorList } from '../lib/vendors'
import { VendorBadge } from '../components/ui/VendorBadge'
import { useCustomers } from '../context/CustomerContext'
import { formatCurrency, formatRelativeTime } from '../lib/utils'
import type { ActivityItem } from '../types'

const activityIcons: Record<ActivityItem['type'], typeof Package> = {
  provision: Package,
  change: Layers,
  suspend: AlertCircle,
  invoice: FileText,
  user: UserPlus,
}

const activityColors: Record<ActivityItem['type'], string> = {
  provision: 'bg-emerald-100 text-emerald-600',
  change: 'bg-blue-100 text-blue-600',
  suspend: 'bg-red-100 text-red-600',
  invoice: 'bg-purple-100 text-purple-600',
  user: 'bg-amber-100 text-amber-600',
}

export function DashboardPage() {
  const { customers } = useCustomers()
  const subscriptions = listSubscriptions()
  const activities = listActivities()
  const resellerProfile = getResellerProfile()
  const marketplaceStats = getMarketplaceStats()
  const portfolioSummary = getPortfolioSummary()
  const totalMrr = getPortfolioMrr()
  const activeCustomers = customers.filter((c) => c.status === 'active').length
  const onboardingCount = customers.filter((c) => c.status === 'onboarding').length
  const creditUsed = ((resellerProfile.creditLimit - resellerProfile.creditAvailable) / resellerProfile.creditLimit) * 100

  const vendorBreakdown = vendorList.map((v) => ({
    vendor: v.id,
    count: subscriptions.filter((s) => s.vendor === v.id && s.status === 'active').length,
  })).filter((v) => v.count > 0)

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`Welcome back — here's your portfolio at a glance`}
        action={
          <Link to="/provision">
            <Button>
              <Package className="h-4 w-4" />
              Provision Service
            </Button>
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly Recurring Revenue"
          value={formatCurrency(totalMrr)}
          change={`${portfolioSummary.activeSubscriptions} active subs`}
          changeType="positive"
          icon={<DollarSign className="h-5 w-5 text-brand-600" />}
        />
        <StatCard
          label="Active Customers"
          value={String(activeCustomers)}
          change={`${onboardingCount} onboarding`}
          changeType="neutral"
          icon={<Users className="h-5 w-5 text-brand-600" />}
          iconBg="bg-sky-100"
        />
        <StatCard
          label="Cloud Vendors"
          value={String(marketplaceStats.vendors)}
          change={`${marketplaceStats.totalProducts} SKUs in marketplace`}
          changeType="neutral"
          icon={<Layers className="h-5 w-5 text-brand-600" />}
          iconBg="bg-violet-100"
        />
        <StatCard
          label="Partner Margin"
          value={`${resellerProfile.margin}%`}
          change="Gold tier rate"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5 text-brand-600" />}
          iconBg="bg-emerald-100"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Customers needing attention</h2>
              <Link to="/customers" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </div>
            <div className="divide-y divide-surface-border">
              {customers
                .filter((c) => c.status !== 'active' || c.mrr === 0)
                .slice(0, 4)
                .map((customer) => (
                  <Link
                    key={customer.id}
                    to={`/customers/${customer.id}`}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 transition-colors hover:bg-slate-50 -mx-2 px-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={customer.status} />
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </Link>
                ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
            </div>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity: ActivityItem) => {
                const Icon = activityIcons[activity.type]
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activityColors[activity.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500">
                        {activity.description} · {activity.customerName}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-600 to-brand-800 !p-6 text-white border-0">
            <h2 className="text-lg font-semibold">Quick provision</h2>
            <p className="mt-2 text-sm text-brand-100">
              Deploy from {marketplaceStats.vendors} vendors — Microsoft, AWS, Google, Adobe, and more — in under 10 minutes.
            </p>
            <Link to="/catalog" className="mt-2 block text-sm font-medium text-brand-200 hover:text-white">
              Browse marketplace →
            </Link>
            <Link to="/provision" className="mt-4 block">
              <Button variant="secondary" className="w-full bg-white text-brand-700 hover:bg-brand-50">
                Start provisioning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-slate-900">Credit utilization</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Available</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(resellerProfile.creditAvailable)} / {formatCurrency(resellerProfile.creditLimit)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${creditUsed}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {creditUsed.toFixed(0)}% utilized · Synnex billing cycle closes in 6 days
            </p>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-slate-900">Subscriptions by vendor</h2>
            <div className="space-y-3">
              {vendorBreakdown.map(({ vendor, count }) => (
                <div key={vendor} className="flex items-center justify-between">
                  <VendorBadge vendor={vendor} size="sm" />
                  <span className="text-sm font-medium text-slate-900">{count} active</span>
                </div>
              ))}
            </div>
            <Link to="/catalog" className="mt-4 block text-sm font-medium text-brand-600 hover:text-brand-700">
              Add from marketplace
            </Link>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-slate-900">Top customers by MRR</h2>
            <div className="space-y-3">
              {customers
                .filter((c) => c.status === 'active')
                .map((c) => ({ ...c, stats: getCustomerStats(c.id) }))
                .filter((c) => c.stats.mrr > 0)
                .sort((a, b) => b.stats.mrr - a.stats.mrr)
                .slice(0, 4)
                .map((customer, i) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded text-xs font-medium text-slate-400">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700">{customer.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(customer.stats.mrr)}</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
