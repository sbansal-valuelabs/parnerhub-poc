import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card } from '../ui/Card'
import { VendorBadge } from '../ui/VendorBadge'
import { VendorSignalList } from './VendorSignalList'
import { fetchPortfolioVendorSignals } from '../../services/vendorInsights'
import { useCustomers } from '../../context/CustomerContext'
import type { VendorSignal } from '../../types/vendorInsights'

export function PortfolioVendorSignalsCard() {
  const signals = fetchPortfolioVendorSignals()
  const { customers } = useCustomers()

  const resolveCustomerName = (signal: VendorSignal) =>
    customers.find((c) => c.id === signal.customerId)?.name ?? signal.customerId

  if (signals.length === 0) return null

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Vendor signals</h2>
          <p className="text-xs text-slate-500">From Partner Center, Graph, Channel, and Acronis APIs</p>
        </div>
      </div>
      <ul className="space-y-2">
        {signals.slice(0, 5).map((signal) => (
          <li key={signal.id}>
            <Link
              to={`/customers/${signal.customerId}`}
              className="block rounded-lg border border-surface-border p-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <VendorBadge vendor={signal.vendor} size="sm" />
                    <span className="text-xs font-medium text-slate-500">{resolveCustomerName(signal)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">{signal.title}</p>
                  <p className="text-xs text-slate-600">{signal.message}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {signals.length > 5 && (
        <p className="mt-2 text-xs text-slate-500">{signals.length - 5} more signals on customer pages</p>
      )}
    </Card>
  )
}

/** Compact signal strip for customer list context */
export function VendorSignalsStrip({ signals }: { signals: VendorSignal[] }) {
  if (signals.length === 0) return null
  return <VendorSignalList signals={signals.slice(0, 3)} compact />
}
