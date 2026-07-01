import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  KeyRound,
  Users,
  LifeBuoy,
  LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { useCustomers } from '../../context/CustomerContext'
import { resellerProfile } from '../../data/mock'

const navItems = [
  { to: '/portal', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/portal/products', icon: Package, label: 'My Products' },
  { to: '/portal/licenses', icon: KeyRound, label: 'Licenses' },
  { to: '/portal/users', icon: Users, label: 'Users' },
  { to: '/portal/support', icon: LifeBuoy, label: 'Support' },
]

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = usePortalAuth()
  const { getCustomer } = useCustomers()
  const navigate = useNavigate()
  const customer = session ? getCustomer(session.customerId) : undefined

  const handleLogout = () => {
    logout()
    navigate('/portal/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-surface-border bg-white">
        <div className="mx-auto flex h-14 max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              {customer?.name.charAt(0) ?? 'P'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{customer?.name ?? 'Customer Portal'}</p>
              <p className="text-xs text-slate-500">Powered by {resellerProfile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{session?.userName}</p>
              <p className="text-xs text-slate-500">{session?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="page-shell">
        <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-surface-border pb-px">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {children}
      </div>

      <footer className="border-t border-surface-border bg-white py-4">
        <div className="mx-auto flex max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter)]">
          <span>Cloud services managed by {resellerProfile.name} via Synnex</span>
          <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
            Home
          </Link>
        </div>
      </footer>
    </div>
  )
}

export function PortalPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
