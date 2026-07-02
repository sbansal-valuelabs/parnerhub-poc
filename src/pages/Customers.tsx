import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, Building2 } from 'lucide-react'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import { SearchInput } from '../components/ui/SearchInput'
import { AddCustomerModal } from '../components/customers/AddCustomerModal'
import { useCustomers } from '../context/CustomerContext'
import { getCustomerStats } from '../data/customerStats'
import { FilterChip } from '../components/ui/FilterChip'
import { formatCurrency, formatDate } from '../lib/utils'

export function CustomersPage() {
  const { customers } = useCustomers()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filters = [
    { value: 'all', label: 'All', count: customers.length },
    { value: 'active', label: 'Active', count: customers.filter((c) => c.status === 'active').length },
    { value: 'onboarding', label: 'Onboarding', count: customers.filter((c) => c.status === 'onboarding').length },
    { value: 'suspended', label: 'Suspended', count: customers.filter((c) => c.status === 'suspended').length },
  ]

  return (
    <>
      <Header
        title="Customers"
        subtitle="Manage end-customer tenants and their cloud services"
        action={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add or invite
          </Button>
        }
      />

      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-surface-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search customers, domains, contacts..."
            className="w-full lg:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <FilterChip
                key={f.value}
                active={statusFilter === f.value}
                onClick={() => setStatusFilter(f.value)}
                count={f.count}
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="hidden px-4 py-3 xl:table-cell">Industry</th>
                <th className="px-4 py-3">Users</th>
                <th className="hidden px-4 py-3 lg:table-cell">Subs</th>
                <th className="px-4 py-3">MRR</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 xl:table-cell">Since</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((customer) => {
                const stats = getCustomerStats(customer.id)
                return (
                  <tr key={customer.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <Link to={`/customers/${customer.id}`} className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">{customer.name}</p>
                          <p className="truncate text-xs text-slate-500">{customer.domain}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="truncate text-sm text-slate-700">{customer.contactName}</p>
                      <p className="truncate text-xs text-slate-500">{customer.contactEmail}</p>
                    </td>
                    <td className="hidden truncate px-4 py-3 text-sm text-slate-600 xl:table-cell">
                      {customer.industry}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{stats.licensedUsers || '—'}</td>
                    <td className="hidden px-4 py-3 text-sm text-slate-700 lg:table-cell">
                      {stats.activeSubscriptions}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {stats.mrr > 0 ? formatCurrency(stats.mrr) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 xl:table-cell">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Stacked cards on narrow viewports — no horizontal scroll */}
        <div className="divide-y divide-surface-border md:hidden">
          {filtered.map((customer) => {
            const stats = getCustomerStats(customer.id)
            return (
              <Link
                key={customer.id}
                to={`/customers/${customer.id}`}
                className="flex items-start gap-3 p-4 transition-colors hover:bg-slate-50/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">{customer.name}</p>
                    <StatusBadge status={customer.status} />
                  </div>
                  <p className="truncate text-xs text-slate-500">{customer.domain}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>{stats.licensedUsers || 0} users</span>
                    <span>{stats.activeSubscriptions} subs</span>
                    <span className="font-medium text-slate-900">
                      {stats.mrr > 0 ? formatCurrency(stats.mrr) : '—'} MRR
                    </span>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">
              {customers.length === 0 ? 'No customers yet.' : 'No customers match your search.'}
            </p>
            {customers.length === 0 && (
              <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4" />
                Add your first customer
              </Button>
            )}
          </div>
        )}
      </Card>

      <AddCustomerModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  )
}
