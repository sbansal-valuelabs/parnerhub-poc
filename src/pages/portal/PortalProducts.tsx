import { useMemo } from 'react'
import { PortalPageHeader } from '../../components/portal/PortalLayout'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { VendorBadge } from '../../components/ui/VendorBadge'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { listSubscriptions, listProducts } from '../../services/repository'
import { getVendor } from '../../lib/vendors'
import { formatDate } from '../../lib/utils'
import { Check } from 'lucide-react'
import type { CloudVendor } from '../../types'

export function PortalProductsPage() {
  const subscriptions = listSubscriptions()
  const products = listProducts()
  const { session } = usePortalAuth()
  const customerSubs = session
    ? subscriptions.filter((s) => s.customerId === session.customerId)
    : []

  const grouped = useMemo(() => {
    const map = new Map<CloudVendor, typeof customerSubs>()
    customerSubs.forEach((sub) => {
      const list = map.get(sub.vendor) ?? []
      list.push(sub)
      map.set(sub.vendor, list)
    })
    return Array.from(map.entries())
  }, [customerSubs])

  return (
    <>
      <PortalPageHeader
        title="My Products"
        subtitle="All cloud services across vendors — one unified view"
      />

      {customerSubs.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-sm text-slate-500">No products subscribed yet. Contact your IT partner to get started.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map(([vendor, subs]) => (
            <section key={vendor}>
              <div className="mb-4 flex items-center gap-3">
                <VendorBadge vendor={vendor} size="md" />
                <p className="text-sm text-slate-500">{getVendor(vendor).description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {subs.map((sub) => {
                  const product = products.find((p) => p.id === sub.productId)
                  return (
                    <Card key={sub.id} className="!p-0 overflow-hidden">
                      <div className="border-b border-surface-border p-5">
                        <div className="mb-2 flex items-start justify-between">
                          <StatusBadge status={sub.status} />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">{sub.productName}</h3>
                        <p className="mt-1 text-xs text-slate-400">SKU: {product?.sku}</p>
                      </div>
                      <div className="p-5">
                        <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <dt className="text-xs text-slate-500">Seats</dt>
                            <dd className="font-medium text-slate-900">{sub.seats}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-slate-500">Billing</dt>
                            <dd className="font-medium capitalize text-slate-900">{sub.billingCycle}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-slate-500">Renewal</dt>
                            <dd className="font-medium text-slate-900">{formatDate(sub.renewalDate)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-slate-500">Auto-renew</dt>
                            <dd className="font-medium text-slate-900">{sub.autoRenew ? 'Yes' : 'No'}</dd>
                          </div>
                        </dl>
                        {product && (
                          <ul className="space-y-1.5 border-t border-surface-border pt-4">
                            {product.features.slice(0, 3).map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
