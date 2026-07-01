import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Search } from 'lucide-react'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { VendorBadge } from '../components/ui/VendorBadge'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState, EmptyStateLink } from '../components/ui/EmptyState'
import { listSubscriptions } from '../services/repository'
import { useCustomers } from '../context/CustomerContext'
import { formatCurrency, formatDate } from '../lib/utils'

export function SubscriptionsPage() {
  const subscriptions = listSubscriptions()
  const { customers } = useCustomers()
  const [search, setSearch] = useState('')

  const enriched = subscriptions.map((sub) => ({
    ...sub,
    customer: customers.find((c) => c.id === sub.customerId),
  }))

  const filtered = enriched.filter((sub) => {
    const matchesSearch =
      sub.productName.toLowerCase().includes(search.toLowerCase()) ||
      sub.customer?.name.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <>
      <Header
        title="Subscriptions"
        subtitle="All customer subscriptions across every cloud vendor"
      />

      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-surface-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search subscriptions or customers..."
            className="sm:w-80"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={search ? <Search className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
            title={search ? 'No subscriptions match your search' : 'No subscriptions yet'}
            description={
              search
                ? 'Try a different product or customer name.'
                : 'Provision your first service to see subscriptions here.'
            }
            action={
              !search ? (
                <EmptyStateLink to="/provision">Start provisioning</EmptyStateLink>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">Vendor</th>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Seats</th>
                    <th className="px-5 py-3">Billing</th>
                    <th className="px-5 py-3">MRR</th>
                    <th className="px-5 py-3">Renewal</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filtered.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <VendorBadge vendor={sub.vendor} size="sm" />
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">{sub.productName}</td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/customers/${sub.customerId}`}
                          className="text-sm text-brand-600 hover:text-brand-700"
                        >
                          {sub.customer?.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{sub.seats}</td>
                      <td className="px-5 py-4 text-sm capitalize text-slate-600">{sub.billingCycle}</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {sub.mrr > 0 ? formatCurrency(sub.mrr) : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{formatDate(sub.renewalDate)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-surface-border md:hidden">
              {filtered.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/customers/${sub.customerId}`}
                  className="block p-4 transition-colors hover:bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{sub.productName}</p>
                      <p className="truncate text-xs text-slate-500">{sub.customer?.name}</p>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <VendorBadge vendor={sub.vendor} size="sm" />
                    <span className="text-xs text-slate-600">
                      {sub.mrr > 0 ? formatCurrency(sub.mrr) : 'Consumption'}/mo
                    </span>
                    <span className="text-xs text-slate-400">· Renews {formatDate(sub.renewalDate)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>
    </>
  )
}
