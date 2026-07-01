import { Link } from 'react-router-dom'
import {
  Cloud,
  Building2,
  Users,
  ArrowRight,
  Layers,
  Shield,
  Zap,
} from 'lucide-react'
import { marketplaceStats, portfolioSummary, resellerProfile } from '../data/mock'

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
              <Cloud className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">PartnerHub</span>
          </div>
          <p className="hidden text-sm text-slate-400 sm:block">
            Cloud marketplace powered by {resellerProfile.distributor}
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-400">
            Multi-vendor cloud platform
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            One place to provision, manage, and serve cloud services
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Resellers manage customers across Microsoft, AWS, Google, and more.
            End customers get a simple portal for licenses and products.
          </p>
        </div>
      </section>

      {/* Portal chooser */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Reseller */}
          <Link
            to="/login"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-900/50 to-slate-900 p-8 transition-all hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold">Reseller portal</h2>
            <p className="mt-2 text-slate-400">
              For MSP and partner staff — provision services, manage customers, and run your cloud business.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-400" />
                {marketplaceStats.vendors} vendors · {marketplaceStats.totalProducts} products
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-400" />
                Unified provisioning wizard
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-400" />
                Team roles & permissions
              </li>
            </ul>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-400 group-hover:text-brand-300">
              Sign in as reseller
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Customer */}
          <Link
            to="/portal/login"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-900/30 to-slate-900 p-8 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold">Customer portal</h2>
            <p className="mt-2 text-slate-400">
              For end-customer organisations — view products, licenses, and users across all your cloud vendors.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                All vendors in one dashboard
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                License usage & availability
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                Request services from your IT partner
              </li>
            </ul>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
              Sign in as customer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-6 sm:grid-cols-4">
          {[
            { label: 'Portfolio MRR', value: `$${(portfolioSummary.totalMrr / 1000).toFixed(1)}k` },
            { label: 'Active customers', value: String(portfolioSummary.activeCustomers) },
            { label: 'Cloud vendors', value: String(marketplaceStats.vendors) },
            { label: 'Subscriptions', value: String(portfolioSummary.activeSubscriptions) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Demo environment · No real authentication required
        </p>
      </section>
    </div>
  )
}
