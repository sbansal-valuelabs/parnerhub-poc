import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cloud, ArrowRight, Building2, ArrowLeft } from 'lucide-react'
import { useResellerAuth } from '../context/ResellerAuthContext'
import { listResellerTeam, listDemoResellers, getResellerProfileById } from '../services/repository'
import { resellerRoleLabels } from '../types'
import { RESELLER_NEXUS } from '../data/resellers'
import { Button } from '../components/ui/Button'
import { inputClassName } from '../components/ui/Modal'
import { cn } from '../lib/utils'

export function ResellerLoginPage() {
  const navigate = useNavigate()
  const { login, loginAsDemo } = useResellerAuth()
  const demoResellers = listDemoResellers()
  const [selectedResellerId, setSelectedResellerId] = useState(RESELLER_NEXUS)
  const resellerProfile = getResellerProfileById(selectedResellerId)
  const selectedDemo = demoResellers.find((r) => r.id === selectedResellerId)!

  const [email, setEmail] = useState(selectedDemo.demoAdminEmail)
  const [error, setError] = useState('')

  const activeStaff = listResellerTeam().filter(
    (m) => m.status === 'active' && m.resellerId === selectedResellerId
  )

  const handleResellerChange = (resellerId: string) => {
    setSelectedResellerId(resellerId)
    const demo = demoResellers.find((r) => r.id === resellerId)
    if (demo) setEmail(demo.demoAdminEmail)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email)) {
      navigate('/dashboard')
    } else {
      setError('No active account found for this organisation. Use a demo account below.')
    }
  }

  const handleQuickLogin = (memberEmail: string) => {
    if (login(memberEmail)) navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-800 to-brand-950 p-8 text-white lg:flex">
        <div>
          <Link to="/" className="flex items-center gap-2 text-brand-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <Cloud className="h-8 w-8" />
            <span className="text-xl font-semibold">Reseller portal</span>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            Manage your cloud business from one place
          </h1>
          <p className="mt-3 text-base text-brand-200">
            {resellerProfile.name} · {resellerProfile.tier} · via {resellerProfile.distributor}
          </p>
          <p className="mt-2 text-sm text-brand-300">{selectedDemo.tagline}</p>
          <ul className="mt-8 space-y-3 text-sm text-brand-100">
            <li>• Multi-vendor cloud marketplace</li>
            <li>• Customer provisioning & subscriptions</li>
            <li>• Team management with role-based access</li>
          </ul>
        </div>
        <p className="text-sm text-brand-300">Demo — any password accepted · 2 reseller orgs</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 lg:hidden">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h2 className="text-2xl font-semibold text-slate-900">Reseller sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a demo organisation, then sign in as staff
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {demoResellers.map((reseller) => (
              <button
                key={reseller.id}
                type="button"
                onClick={() => handleResellerChange(reseller.id)}
                className={cn(
                  'rounded-lg border p-3 text-left transition-colors',
                  selectedResellerId === reseller.id
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                    : 'border-surface-border hover:border-brand-300 hover:bg-slate-50'
                )}
              >
                <p className="text-sm font-semibold text-slate-900">{reseller.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{reseller.tier}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                defaultValue="demo"
                className={inputClassName}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              Quick demo login · {resellerProfile.name}
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemo(selectedResellerId)
                  navigate('/dashboard')
                }}
                className="flex w-full items-center gap-3 rounded-lg border-2 border-brand-200 bg-brand-50 p-3 text-left transition-colors hover:border-brand-400"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activeStaff.find((m) => m.role === 'admin')?.name ?? 'Administrator'} · Administrator
                  </p>
                  <p className="text-xs text-slate-500">Recommended for full demo</p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-600" />
              </button>
              {activeStaff
                .filter((m) => m.role !== 'admin')
                .slice(0, 2)
                .map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleQuickLogin(member.email)}
                    className="flex w-full items-center gap-3 rounded-lg border border-surface-border p-3 text-left hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{resellerRoleLabels[member.role]}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            End customer?{' '}
            <Link to="/portal/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Go to customer portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
