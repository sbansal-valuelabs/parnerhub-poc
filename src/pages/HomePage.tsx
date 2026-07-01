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
import { getMarketplaceStats, getPortfolioSummary, getResellerProfile } from '../services/repository'

export function HomePage() {
  const resellerProfile = getResellerProfile()
  const marketplaceStats = getMarketplaceStats()
  const portfolioSummary = getPortfolioSummary()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="marketing-shell flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <Cloud className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold">PartnerHub</span>
          </div>
          <p className="hidden text-xs text-slate-400 sm:block">
            Cloud marketplace powered by {resellerProfile.distributor}
          </p>
        </div>
      </header>

      <section className="relative overflow-hidden py-[clamp(2.5rem,6vh,4.5rem)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />
        <div className="marketing-shell relative text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-brand-400">
            Multi-vendor cloud platform
          </p>
          <h1 className="text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] font-bold leading-snug tracking-tight">
            One place to provision, manage, and serve cloud services
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400">
            Resellers manage customers across Microsoft, AWS, Google, and more.
            End customers get a simple portal for licenses and products.
          </p>
        </div>
      </section>

      <section className="marketing-shell pb-[clamp(3rem,6vh,5rem)]">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/login"
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-brand-900/50 to-slate-900 p-5 transition-all hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Reseller portal</h2>
            <p className="mt-1.5 text-sm text-slate-400">
              For MSP and partner staff — provision services, manage customers, and run your cloud business.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-brand-400" />
                {marketplaceStats.vendors} vendors · {marketplaceStats.totalProducts} products
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-brand-400" />
                Unified provisioning wizard
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-brand-400" />
                Team roles & permissions
              </li>
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 group-hover:text-brand-300">
              Sign in as reseller
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/portal/login"
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-emerald-900/30 to-slate-900 p-5 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Customer portal</h2>
            <p className="mt-1.5 text-sm text-slate-400">
              For end-customer organisations — view products, licenses, and users across all your cloud vendors.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                All vendors in one dashboard
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                License usage & availability
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                Request services from your IT partner
              </li>
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
              Sign in as customer
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:grid-cols-4">
          {[
            { label: 'Portfolio MRR', value: `$${(portfolioSummary.totalMrr / 1000).toFixed(1)}k` },
            { label: 'Active customers', value: String(portfolioSummary.activeCustomers) },
            { label: 'Cloud vendors', value: String(marketplaceStats.vendors) },
            { label: 'Subscriptions', value: String(portfolioSummary.activeSubscriptions) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-500">
          Demo environment · No real authentication required
        </p>
      </section>
    </div>
  )
}
