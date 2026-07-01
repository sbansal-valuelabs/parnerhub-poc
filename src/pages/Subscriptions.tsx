import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { VendorBadge } from '../components/ui/VendorBadge'
import { SearchInput } from '../components/ui/SearchInput'
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

        <div className="overflow-x-auto">
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
      </Card>
    </>
  )
}
