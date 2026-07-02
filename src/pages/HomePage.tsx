import { Link } from 'react-router-dom'
import {
  Cloud,
  Building2,
  Users,
  ArrowRight,
  Layers,
  Shield,
  Zap,
  GitBranch,
} from 'lucide-react'
import { getMarketplaceStats, listDemoResellers } from '../services/repository'

/**
 * Public home — capability stats only (no portfolio MRR).
 * Reseller-specific metrics belong on the dashboard after login.
 */
export function HomePage() {
  const marketplaceStats = getMarketplaceStats()
  const demoResellerCount = listDemoResellers().length

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
            Multi-vendor cloud marketplace demo
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
            Resellers manage customers across Microsoft CSP, Azure, Google Workspace, Google Cloud, and Acronis.
            End customers get a simple portal for licenses and subscriptions.
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
              For MSP and partner staff — provision plans, manage customers, and run your cloud business.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-brand-400" />
                {marketplaceStats.vendors} vendors · {marketplaceStats.totalProducts} service plans
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-brand-400" />
                Guided provision wizard with vendor agreements
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-brand-400" />
                Team roles &amp; permissions
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
              For end-customer organisations — view subscriptions, licenses, and users across vendors.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                All vendors in one dashboard
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                License usage &amp; availability
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

        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Platform capabilities (not reseller-specific metrics)
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Cloud vendors', value: String(marketplaceStats.vendors), icon: Layers },
              { label: 'Service plans & SKUs', value: String(marketplaceStats.totalProducts), icon: GitBranch },
              { label: 'Demo reseller orgs', value: String(demoResellerCount), icon: Building2 },
              { label: 'Portal experiences', value: '2', icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto mb-1 h-4 w-4 text-slate-500" />
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-500">
            Portfolio MRR and customer counts appear on the reseller dashboard after sign-in.
          </p>
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-500">
          Demo environment · No real authentication required
        </p>
      </section>
    </div>
  )
}
