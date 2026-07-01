import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Users, Package, Zap, ArrowRight } from 'lucide-react'
import { useCustomers } from '../../context/CustomerContext'
import { listSubscriptions } from '../../services/repository'

const STORAGE_KEY = 'partnerhub-getting-started-dismissed'

const steps = [
  { icon: Users, label: 'Add a customer', to: '/customers', hint: 'Register tenant' },
  { icon: Package, label: 'Browse marketplace', to: '/catalog', hint: 'Pick SKUs' },
  { icon: Zap, label: 'Provision services', to: '/provision', hint: 'Deploy to tenant' },
]

export function GettingStartedBanner() {
  const { customers } = useCustomers()
  const hasSubs = listSubscriptions().length > 0
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1' || (customers.length > 0 && hasSubs)
  )

  if (dismissed) return null

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-4 sm:p-5">
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, '1')
          setDismissed(true)
        }}
        className="absolute right-3 top-3 rounded p-1 text-slate-400 hover:bg-white/80 hover:text-slate-600"
        aria-label="Dismiss getting started"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="text-sm font-semibold text-slate-900">Getting started with PartnerHub</p>
      <p className="mt-1 max-w-xl text-xs text-slate-600">
        Three steps to run your first demo provision — each link opens the right screen.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {steps.map(({ icon: Icon, label, to, hint }, i) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 rounded-lg border border-white/80 bg-white/70 px-3 py-2.5 transition-colors hover:border-brand-300 hover:bg-white"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                <Icon className="h-3.5 w-3.5 text-brand-600" />
                {label}
              </p>
              <p className="text-[10px] text-slate-500">{hint}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
          </Link>
        ))}
      </div>
    </div>
  )
}
