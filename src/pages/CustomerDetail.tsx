import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Mail,
  Globe,
  Users,
  CreditCard,
  Zap,
  Copy,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { Breadcrumb } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import { listSubscriptions } from '../services/repository'
import { useCustomers } from '../context/CustomerContext'
import { getCustomerStats } from '../data/customerStats'
import { formatCurrency, formatDate } from '../lib/utils'
import { useToast } from '../context/ToastContext'

export function CustomerDetailPage() {
  const subscriptions = listSubscriptions()
  const { id } = useParams()
  const { getCustomer } = useCustomers()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const customer = id ? getCustomer(id) : undefined
  const customerSubs = subscriptions.filter((s) => s.customerId === id)

  if (!customer) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Customer not found.</p>
        <Link to="/customers" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to customers
        </Link>
      </div>
    )
  }

  const stats = getCustomerStats(customer.id)

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Customers', to: '/customers' },
          { label: customer.name },
        ]}
      />

      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-700">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">{customer.name}</h1>
                <StatusBadge status={customer.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{customer.industry} · Customer since {formatDate(customer.createdAt)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={`/portal/login?customer=${customer.id}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
                Preview client portal
              </Button>
            </a>
            <Link to={`/provision?customer=${customer.id}`}>
              <Button>
                <Zap className="h-4 w-4" />
                Provision Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {customer.status === 'onboarding' && (
        <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Tenant provisioning is in progress via Synnex. Products and licenses will appear here once cloud accounts are linked.
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Licensed Users', value: stats.licensedUsers > 0 ? String(stats.licensedUsers) : '—', icon: Users },
          { label: 'Subscriptions', value: String(stats.activeSubscriptions), icon: CreditCard },
          { label: 'Monthly Revenue', value: stats.mrr > 0 ? formatCurrency(stats.mrr) : '—', icon: CreditCard },
          { label: 'Domain', value: customer.domain, icon: Globe },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Active subscriptions</h2>
              <Link to="/subscriptions" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </div>

            {customerSubs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-surface-border py-10 text-center">
                <p className="text-sm text-slate-500">No subscriptions yet.</p>
                <Link to={`/provision?customer=${customer.id}`} className="mt-3 inline-block">
                  <Button size="sm">Provision first service</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {customerSubs.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{sub.productName}</p>
                      <p className="text-xs text-slate-500">
                        {sub.seats} {sub.seats === 1 ? 'seat' : 'seats'} · {sub.billingCycle} · Renews {formatDate(sub.renewalDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-900">
                        {sub.mrr > 0 ? formatCurrency(sub.mrr) : '—'}/mo
                      </span>
                      <StatusBadge status={sub.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-slate-900">Contact details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-slate-500">Primary contact</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{customer.contactName}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <dd className="text-sm text-slate-700">{customer.contactEmail}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                <dd className="text-sm text-slate-700">{customer.domain}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-slate-900">Tenant information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-slate-500">Tenant ID</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <code className="truncate text-xs text-slate-600">{customer.tenantId}</code>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    title="Copy tenant ID"
                    onClick={async () => {
                      await navigator.clipboard.writeText(customer.tenantId)
                      setCopied(true)
                      toast('Tenant ID copied')
                      window.setTimeout(() => setCopied(false), 2000)
                    }}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Tenant status</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Linked & verified
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  )
}
