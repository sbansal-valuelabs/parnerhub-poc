import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Cloud, ArrowRight, Building2, ArrowLeft } from 'lucide-react'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { useCustomers } from '../../context/CustomerContext'
import { listPortalAccounts, getResellerProfileForCustomer } from '../../services/repository'
import { Button } from '../../components/ui/Button'
import { inputClassName } from '../../components/ui/Modal'

const portalAccounts = listPortalAccounts()

export function PortalLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedCustomer = searchParams.get('customer') ?? ''
  const { login, loginAsDemo } = usePortalAuth()
  const { getCustomer } = useCustomers()

  const [customerId, setCustomerId] = useState(preselectedCustomer || portalAccounts[0].customerId)
  const selectedCustomer = getCustomer(customerId)
  const resellerProfile = customerId
    ? getResellerProfileForCustomer(customerId)
    : getResellerProfileForCustomer('')

  const [email, setEmail] = useState(() => {
    const account = portalAccounts.find((a) => a.customerId === (preselectedCustomer || portalAccounts[0].customerId))
    return account?.email ?? ''
  })
  const [error, setError] = useState('')

  const demoAccounts = portalAccounts.map((account) => ({
    ...account,
    customer: getCustomer(account.customerId),
  })).filter((a) => a.customer && a.customer.status !== 'suspended')

  const handleAccountSelect = (id: string) => {
    setCustomerId(id)
    const account = portalAccounts.find((a) => a.customerId === id)
    if (account) setEmail(account.email)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(customerId, email)) {
      navigate('/portal')
    } else {
      setError('Unable to sign in. Use a demo account below or check your email.')
    }
  }

  const handleQuickLogin = (id: string) => {
    if (loginAsDemo(id)) navigate('/portal')
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white lg:flex">
        <div>
          <Link to="/" className="flex items-center gap-2 text-emerald-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <Cloud className="h-8 w-8" />
            <span className="text-xl font-semibold">Customer portal</span>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            Manage your cloud services in one place
          </h1>
          <p className="mt-3 text-base text-emerald-100">
            View licenses, assigned products, and users across your organisation — managed by{' '}
            {selectedCustomer ? resellerProfile.name : 'your IT partner'}.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-emerald-100">
            <li>• View all cloud products in one place — Microsoft, Google Workspace, Google Cloud, and Acronis</li>
            <li>• See license usage across every vendor</li>
            <li>• Request new services from your IT partner in one click</li>
          </ul>
        </div>
        <p className="text-sm text-emerald-300">Demo environment — no real authentication required</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 lg:hidden">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mb-4 flex items-center gap-2 text-emerald-700 lg:hidden">
            <Cloud className="h-6 w-6" />
            <span className="font-semibold">Customer portal</span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Access your organisation&apos;s cloud services dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="customer" className="mb-1.5 block text-sm font-medium text-slate-700">
                Organisation
              </label>
              <select
                id="customer"
                value={customerId}
                onChange={(e) => handleAccountSelect(e.target.value)}
                className={inputClassName}
              >
                {demoAccounts.map((a) => (
                  <option key={a.customerId} value={a.customerId}>
                    {a.customer?.name}
                  </option>
                ))}
              </select>
            </div>

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
                placeholder="you@company.com"
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
                placeholder="Any password for demo"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              Quick demo login
            </p>
            <div className="space-y-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.customerId}
                  type="button"
                  onClick={() => handleQuickLogin(a.customerId)}
                  className="flex w-full items-center gap-3 rounded-lg border border-surface-border p-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <Building2 className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{a.customer?.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      Sign in as {a.name}
                      {a.customer?.resellerId === 'reseller-horizon' ? ' · Horizon' : ''}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            IT partner?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Go to reseller portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
