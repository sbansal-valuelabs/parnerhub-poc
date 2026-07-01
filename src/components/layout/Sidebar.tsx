import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  Zap,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronRight,
  Cloud,
  UserCog,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { resellerProfile } from '../../data/mock'
import { useResellerAuth } from '../../context/ResellerAuthContext'
import { resellerRoleLabels } from '../../types'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/catalog', icon: Package, label: 'Cloud Marketplace' },
  { to: '/provision', icon: Zap, label: 'Provision' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
]

const bottomNav = [
  { to: '/team', icon: UserCog, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, logout } = useResellerAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-brand-950 text-white">
      <Link to="/" className="flex h-16 items-center gap-3 border-b border-white/10 px-5 transition-colors hover:bg-white/5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
          <Cloud className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">PartnerHub</p>
          <p className="text-[11px] text-brand-300">Cloud Provisioning</p>
        </div>
      </Link>

      <div className="border-b border-white/10 px-4 py-4">
        <div className="rounded-lg bg-white/5 px-3 py-2.5">
          <p className="truncate text-sm font-medium">{resellerProfile.name}</p>
          <p className="text-xs text-brand-300">{resellerProfile.tier}</p>
          <p className="mt-1 text-[11px] text-brand-400">via {resellerProfile.distributor}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive =
            to === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-brand-200 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
              {to === '/provision' && (
                <span className="ml-auto rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  New
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <div className="mb-2 rounded-lg bg-white/5 px-3 py-2">
          <p className="truncate text-xs font-medium text-white">{session?.name}</p>
          <p className="text-[10px] text-brand-400">
            {session?.role ? resellerRoleLabels[session.role] : ''}
          </p>
        </div>
        <Link
          to="/portal/login"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Customer portal
        </Link>
        {bottomNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export function Header({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </header>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pl-64">
        <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
      </main>
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-4 flex items-center gap-1 text-sm text-slate-500">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          <span className={i === items.length - 1 ? 'font-medium text-slate-800' : ''}>
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  )
}
