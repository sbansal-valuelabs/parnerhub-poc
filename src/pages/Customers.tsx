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

            Add Customer

          </Button>

        }

      />



      <Card className="!p-0 overflow-hidden">

        <div className="flex flex-col gap-4 border-b border-surface-border p-4 sm:flex-row sm:items-center sm:justify-between">

          <SearchInput

            value={search}

            onChange={setSearch}

            placeholder="Search customers, domains, contacts..."

            className="sm:w-80"

          />

          <div className="flex gap-2">

            {filters.map((f) => (

              <button

                key={f.value}

                onClick={() => setStatusFilter(f.value)}

                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${

                  statusFilter === f.value

                    ? 'bg-brand-100 text-brand-700'

                    : 'text-slate-600 hover:bg-slate-100'

                }`}

              >

                {f.label}

                <span className="ml-1.5 text-xs opacity-70">({f.count})</span>

              </button>

            ))}

          </div>

        </div>



        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">

                <th className="px-5 py-3">Customer</th>

                <th className="px-5 py-3">Contact</th>

                <th className="px-5 py-3">Industry</th>

                <th className="px-5 py-3">Users</th>

                <th className="px-5 py-3">Subscriptions</th>

                <th className="px-5 py-3">MRR</th>

                <th className="px-5 py-3">Status</th>

                <th className="px-5 py-3">Since</th>

                <th className="px-5 py-3"></th>

              </tr>

            </thead>

            <tbody className="divide-y divide-surface-border">

              {filtered.map((customer) => {
                const stats = getCustomerStats(customer.id)
                return (
                <tr key={customer.id} className="group transition-colors hover:bg-slate-50/50">

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-sm font-semibold text-brand-700">

                        <Building2 className="h-4 w-4" />

                      </div>

                      <div>

                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>

                        <p className="text-xs text-slate-500">{customer.domain}</p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <p className="text-sm text-slate-700">{customer.contactName}</p>

                    <p className="text-xs text-slate-500">{customer.contactEmail}</p>

                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">{customer.industry}</td>

                  <td className="px-5 py-4 text-sm text-slate-700">{stats.licensedUsers || '—'}</td>

                  <td className="px-5 py-4 text-sm text-slate-700">{stats.activeSubscriptions}</td>

                  <td className="px-5 py-4 text-sm font-medium text-slate-900">

                    {stats.mrr > 0 ? formatCurrency(stats.mrr) : '—'}

                  </td>

                  <td className="px-5 py-4">

                    <StatusBadge status={customer.status} />

                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">{formatDate(customer.createdAt)}</td>

                  <td className="px-5 py-4">

                    <Link

                      to={`/customers/${customer.id}`}

                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-brand-700"

                    >

                      View <ArrowRight className="h-3.5 w-3.5" />

                    </Link>

                  </td>

                </tr>
                )
              })}

            </tbody>

          </table>

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

