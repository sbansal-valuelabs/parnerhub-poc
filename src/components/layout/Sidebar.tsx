import { useState, useEffect } from 'react'
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
  Menu,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { getResellerProfile } from '../../services/repository'
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

function navLinkClass(isActive: boolean, compact = false) {
  return cn(
    'flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
    compact ? 'px-3 py-2' : 'px-3 py-2.5',
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-brand-200 hover:bg-white/5 hover:text-white'
  )
}

function bottomNavLinkClass(isActive: boolean) {
  return cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-white/10 font-medium text-white'
      : 'text-brand-300 hover:bg-white/5 hover:text-white'
  )
}

function isNavActive(pathname: string, to: string) {
  return to === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(to)
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, logout } = useResellerAuth()
  const resellerProfile = getResellerProfile()

  const handleLogout = () => {
    onMobileClose()
    logout()
    navigate('/')
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/60 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-width)] flex-col bg-brand-950 text-white transition-transform duration-200 ease-out lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Link
          to="/"
          onClick={onMobileClose}
          className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4 transition-colors hover:bg-white/5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
            <Cloud className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">PartnerHub</p>
            <p className="text-[11px] text-brand-300">Cloud Provisioning</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onMobileClose()
            }}
            className="rounded p-1 text-brand-300 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
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
            const isActive = isNavActive(location.pathname, to)
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onMobileClose}
                className={navLinkClass(isActive)}
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
          {session && (
            <p className="mb-2 truncate px-2 text-xs text-brand-300">
              {session.name} · {session.role ? resellerRoleLabels[session.role] : ''}
            </p>
          )}
          <Link
            to="/portal/login"
            target="_blank"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Client portal
          </Link>
          {bottomNav.map(({ to, icon: Icon, label }) => {
            const isActive = isNavActive(location.pathname, to)
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onMobileClose}
                className={bottomNavLinkClass(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

export function Header({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div>}
    </header>
  )
}

function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const resellerProfile = getResellerProfile()

  return (
    <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-surface-border bg-white px-[var(--page-gutter)] lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{resellerProfile.name}</p>
        <p className="truncate text-[10px] text-slate-500">PartnerHub</p>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="min-w-0 lg:pl-[var(--sidebar-width)]">
        <MobileTopBar onMenuClick={() => setMobileOpen(true)} />
        <main id="main-content" className="page-shell">
          {children}
        </main>
      </div>
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-slate-500">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="hover:text-brand-600">
              {item.label}
            </Link>
          ) : (
            <span
              className={i === items.length - 1 ? 'font-medium text-slate-800' : ''}
              aria-current={i === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
