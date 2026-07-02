import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  Package,
  Settings2,
  ClipboardCheck,
  FileSignature,
  Sparkles,
} from 'lucide-react'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SearchInput } from '../components/ui/SearchInput'
import { VendorBadge } from '../components/ui/VendorBadge'
import { listProducts } from '../services/repository'
import { getDataProvider } from '../services'
import { useCustomers } from '../context/CustomerContext'
import { useToast } from '../context/ToastContext'
import { categoryLabels, categoryColors, type BillingCycle, type CartItem, type ProductCategory } from '../types'
import { formatCurrencyPrecise, cn } from '../lib/utils'
import { getAgreementsForVendors } from '../data/vendorAgreements'
import { VendorAgreementsStep } from '../components/provision/VendorAgreementsStep'
import type { CloudVendor } from '../types'
import { vendorList } from '../lib/vendors'
import { FilterChip } from '../components/ui/FilterChip'

const allSteps = [
  { key: 'customer', label: 'Customer', icon: Building2 },
  { key: 'products', label: 'Plans & SKUs', icon: Package },
  { key: 'configure', label: 'Configure', icon: Settings2 },
  { key: 'agreements', label: 'Agreements', icon: FileSignature },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
] as const

const planCategories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'security', label: 'Security' },
  { value: 'business-apps', label: 'Business Apps' },
  { value: 'backup', label: 'Backup & recovery' },
]

type StepKey = (typeof allSteps)[number]['key']

function initialStepIndex(
  preselectedCustomer: string | null,
  hasProducts: boolean
): number {
  if (!preselectedCustomer) return 0
  if (hasProducts) return 2
  return 1
}

function buildInitialCart(
  productIds: string[],
  catalog: ReturnType<typeof listProducts>
): CartItem[] {
  return productIds
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((product) => ({
      product,
      seats: product.minSeats,
      billingCycle: 'monthly' as BillingCycle,
    }))
}

export function ProvisionPage() {
  const products = listProducts()
  const [searchParams] = useSearchParams()
  const { customers, getCustomer } = useCustomers()
  const { toast } = useToast()
  const preselectedCustomer = searchParams.get('customer')
  const preselectedProduct = searchParams.get('product')
  const preselectedProductIds = useMemo(() => {
    const fromList = searchParams.get('products')?.split(',').map((s) => s.trim()).filter(Boolean) ?? []
    if (preselectedProduct) return [preselectedProduct]
    return fromList
  }, [searchParams, preselectedProduct])

  const [stepIndex, setStepIndex] = useState(() =>
    initialStepIndex(preselectedCustomer, preselectedProductIds.length > 0)
  )
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedCustomer ?? '')
  const [cart, setCart] = useState<CartItem[]>(() => buildInitialCart(preselectedProductIds, products))
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [planVendor, setPlanVendor] = useState<CloudVendor | 'all'>('all')
  const [planCategory, setPlanCategory] = useState<ProductCategory | 'all'>('all')
  const [completed, setCompleted] = useState(false)
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<Set<string>>(new Set())
  const [resellerAttestation, setResellerAttestation] = useState(false)

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) ??
    (selectedCustomerId ? getCustomer(selectedCustomerId) : undefined)

  const cartVendors = useMemo(
    () => [...new Set(cart.map((item) => item.product.vendor))] as CloudVendor[],
    [cart]
  )

  const requiredAgreements = useMemo(() => getAgreementsForVendors(cartVendors), [cartVendors])
  const hasAgreementStep = requiredAgreements.length > 0

  const wizardSteps = useMemo(
    () => allSteps.filter((s) => s.key !== 'agreements' || hasAgreementStep),
    [hasAgreementStep]
  )

  const currentStepKey: StepKey = wizardSteps[stepIndex]?.key ?? 'customer'
  const isLastStep = stepIndex === wizardSteps.length - 1

  useEffect(() => {
    if (stepIndex >= wizardSteps.length) {
      setStepIndex(Math.max(0, wizardSteps.length - 1))
    }
  }, [stepIndex, wizardSteps.length])

  useEffect(() => {
    setResellerAttestation(false)
  }, [selectedCustomerId, cartVendors.join(',')])

  useEffect(() => {
    const validIds = new Set(requiredAgreements.map((a) => a.id))
    setAcceptedAgreementIds((prev) => {
      const next = new Set([...prev].filter((id) => validIds.has(id)))
      return next.size === prev.size ? prev : next
    })
  }, [requiredAgreements])

  const filteredCustomers = customers.filter(
    (c) =>
      c.status !== 'suspended' &&
      (c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.domain.toLowerCase().includes(customerSearch.toLowerCase()))
  )

  const filteredPlans = products.filter((p) => {
    const q = productSearch.toLowerCase()
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.vendor.includes(q)
    const matchesVendor = planVendor === 'all' || p.vendor === planVendor
    const matchesCategory = planCategory === 'all' || p.category === planCategory
    const notInCart = !cart.some((item) => item.product.id === p.id)
    return matchesSearch && matchesVendor && matchesCategory && notInCart
  })

  const totalMonthly = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.billingCycle === 'monthly' ? item.product.priceMonthly : item.product.priceAnnual / 12
      return sum + price * item.seats
    }, 0)
  }, [cart])

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    setCart([...cart, { product, seats: product.minSeats, billingCycle: 'monthly' }])
  }

  const updateCartItem = (productId: string, updates: Partial<Pick<CartItem, 'seats' | 'billingCycle'>>) => {
    setCart(cart.map((item) => (item.product.id === productId ? { ...item, ...updates } : item)))
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const toggleAgreement = (agreementId: string, accepted: boolean) => {
    setAcceptedAgreementIds((prev) => {
      const next = new Set(prev)
      if (accepted) next.add(agreementId)
      else next.delete(agreementId)
      return next
    })
  }

  const allAgreementsAccepted =
    requiredAgreements.length > 0 &&
    requiredAgreements.every((a) => acceptedAgreementIds.has(a.id))

  const hasSelectedCustomer = !!selectedCustomerId && !!selectedCustomer

  const canProceed = () => {
    switch (currentStepKey) {
      case 'customer':
        return hasSelectedCustomer
      case 'products':
        return hasSelectedCustomer && cart.length > 0
      case 'configure':
        return (
          hasSelectedCustomer &&
          cart.every((item) => item.seats >= item.product.minSeats)
        )
      case 'agreements':
        return hasSelectedCustomer && allAgreementsAccepted
      case 'review':
        return hasSelectedCustomer && (hasAgreementStep ? allAgreementsAccepted : resellerAttestation)
      default:
        return true
    }
  }

  const handleSubmit = () => {
    getDataProvider().submitProvisionOrder({
      customerId: selectedCustomerId,
      lineItems: cart.map((item) => ({
        productId: item.product.id,
        seats: item.seats,
        billingCycle: item.billingCycle,
      })),
      acceptedAgreementIds: [...acceptedAgreementIds],
    })
    toast(`Provisioning started for ${selectedCustomer?.name}`)
    setCompleted(true)
  }

  const resetWizard = () => {
    setCompleted(false)
    setStepIndex(0)
    setSelectedCustomerId('')
    setCart([])
    setCustomerSearch('')
    setProductSearch('')
    setAcceptedAgreementIds(new Set())
    setResellerAttestation(false)
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Provisioning initiated</h1>
        <p className="mt-2 text-sm text-slate-500">
          {cart.length} service{cart.length > 1 ? 's' : ''} for {selectedCustomer?.name} will be active within a few minutes.
        </p>
        {requiredAgreements.length > 0 && (
          <p className="mt-2 text-xs text-slate-400">
            {requiredAgreements.length} vendor agreement{requiredAgreements.length !== 1 ? 's' : ''} recorded for audit.
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link to={`/customers/${selectedCustomerId}`}>
            <Button variant="outline">View customer</Button>
          </Link>
          <Button onClick={resetWizard}>Provision another</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header
        title="Provision Services"
        subtitle="Deploy cloud services to your end customers in a few steps"
      />

      {/* Step indicator */}
      <div className="mb-8">
        <p className="mb-3 text-center text-sm font-medium text-slate-700 lg:hidden">
          Step {stepIndex + 1} of {wizardSteps.length}: {wizardSteps[stepIndex]?.label}
        </p>
        <div className="-mx-2 overflow-x-auto pb-2 lg:mx-0 lg:overflow-visible lg:pb-0">
          <div className="flex min-w-[32rem] items-center justify-between px-2 lg:min-w-0">
          {wizardSteps.map((s, i) => {
            const Icon = s.icon
            const isActive = stepIndex === i
            const isDone = stepIndex > i
            return (
              <div key={s.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                      isDone && 'border-emerald-500 bg-emerald-500 text-white',
                      isActive && 'border-brand-600 bg-brand-600 text-white',
                      !isActive && !isDone && 'border-slate-200 bg-white text-slate-400'
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={cn(
                      'mt-2 hidden text-xs font-medium sm:block',
                      isActive ? 'text-brand-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < wizardSteps.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 flex-1',
                      stepIndex > i ? 'bg-emerald-500' : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
            )
          })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Step 1: Customer */}
          {currentStepKey === 'customer' && (
            <Card>
              <h2 className="mb-1 text-base font-semibold text-slate-900">Select customer</h2>
              <p className="mb-4 text-sm text-slate-500">Choose the end customer to provision services for.</p>
              <SearchInput
                value={customerSearch}
                onChange={setCustomerSearch}
                placeholder="Search customers..."
                className="mb-4"
              />
              <div className="max-h-96 space-y-2 overflow-y-auto scrollbar-thin">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                      selectedCustomerId === customer.id
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                        : 'border-surface-border hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.domain} · {customer.users} users</p>
                    </div>
                    {selectedCustomerId === customer.id && (
                      <Check className="h-5 w-5 shrink-0 text-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2: Plans & SKUs */}
          {currentStepKey === 'products' && (
            <Card>
              <h2 className="mb-1 text-base font-semibold text-slate-900">Select plans &amp; SKUs</h2>
              <p className="mb-4 text-sm text-slate-500">
                Choose distributor offers to provision. Each row is a billable plan (SKU) — the unit
                Microsoft Partner Center and Synnex use for ordering.
              </p>
              <SearchInput
                value={productSearch}
                onChange={setProductSearch}
                placeholder="Search plan name or SKU..."
                className="mb-3"
              />
              <div className="mb-3 flex flex-wrap gap-2">
                <FilterChip active={planVendor === 'all'} onClick={() => setPlanVendor('all')}>
                  All vendors
                </FilterChip>
                {vendorList.map((v) => (
                  <FilterChip
                    key={v.id}
                    active={planVendor === v.id}
                    onClick={() => setPlanVendor(v.id)}
                  >
                    {v.shortName}
                  </FilterChip>
                ))}
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {planCategories.map((cat) => (
                  <FilterChip
                    key={cat.value}
                    active={planCategory === cat.value}
                    onClick={() => setPlanCategory(cat.value)}
                  >
                    {cat.label}
                  </FilterChip>
                ))}
              </div>
              <p className="mb-2 text-xs text-slate-500">
                {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} available
              </p>
              <div className="max-h-96 space-y-2 overflow-y-auto scrollbar-thin">
                {filteredPlans.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No plans match your filters, or all matching plans are already in the order.
                  </p>
                ) : (
                  filteredPlans.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-surface-border p-3 hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <VendorBadge vendor={product.vendor} size="sm" showName={false} />
                        <span
                          className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline ${categoryColors[product.category]}`}
                        >
                          {categoryLabels[product.category]}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{product.name}</p>
                          <p className="truncate text-xs text-slate-500">
                            SKU: {product.sku}
                            {product.priceMonthly > 0
                              ? ` · ${formatCurrencyPrecise(product.priceMonthly)}/seat/mo`
                              : ' · Consumption-based'}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0" onClick={() => addToCart(product.id)}>
                        Add plan
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* Step 3: Configure */}
          {currentStepKey === 'configure' && (
            <Card>
              <h2 className="mb-1 text-base font-semibold text-slate-900">Configure plan quantities</h2>
              <p className="mb-4 text-sm text-slate-500">Set seat counts and billing cycle for each selected plan.</p>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="rounded-lg border border-surface-border p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-500">SKU: {item.product.sku}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">Seats</label>
                        <input
                          type="number"
                          min={item.product.minSeats}
                          value={item.seats}
                          onChange={(e) =>
                            updateCartItem(item.product.id, {
                              seats: Math.max(item.product.minSeats, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">Billing cycle</label>
                        <select
                          value={item.billingCycle}
                          onChange={(e) =>
                            updateCartItem(item.product.id, {
                              billingCycle: e.target.value as BillingCycle,
                            })
                          }
                          className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="annual">Annual (save ~5%)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 4: Vendor agreements */}
          {currentStepKey === 'agreements' && hasSelectedCustomer && (
            <VendorAgreementsStep
              agreements={requiredAgreements}
              customerName={selectedCustomer!.name}
              acceptedIds={acceptedAgreementIds}
              onToggle={toggleAgreement}
            />
          )}

          {currentStepKey === 'agreements' && !hasSelectedCustomer && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900">Select a customer first</h2>
              <p className="mt-2 text-sm text-slate-500">
                Vendor agreements are tied to the end customer. Go back and choose who you are provisioning for.
              </p>
              <Button className="mt-4" variant="outline" onClick={() => setStepIndex(0)}>
                <ChevronLeft className="h-4 w-4" />
                Back to customer
              </Button>
            </Card>
          )}

          {/* Review */}
          {currentStepKey === 'review' && (
            <Card>
              <h2 className="mb-1 text-base font-semibold text-slate-900">Review & confirm</h2>
              <p className="mb-4 text-sm text-slate-500">Verify the provisioning details before submitting.</p>

              <div className="mb-4 rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Customer</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{selectedCustomer?.name}</p>
                <p className="text-xs text-slate-500">{selectedCustomer?.domain}</p>
              </div>

              <div className="divide-y divide-surface-border rounded-lg border border-surface-border">
                {cart.map((item) => {
                  const unitPrice =
                    item.billingCycle === 'monthly'
                      ? item.product.priceMonthly
                      : item.product.priceAnnual / 12
                  return (
                    <div key={item.product.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.seats} seats · {item.billingCycle}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {unitPrice > 0 ? formatCurrencyPrecise(unitPrice * item.seats) : 'Usage-based'}/mo
                      </p>
                    </div>
                  )
                })}
              </div>

              {hasAgreementStep && requiredAgreements.length > 0 && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-800">
                    Vendor agreements
                  </p>
                  <ul className="mt-2 space-y-1">
                    {requiredAgreements.map((a) => (
                      <li key={a.id} className="flex items-center gap-2 text-sm text-emerald-900">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                        {a.title} (v{a.version})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!hasAgreementStep && selectedCustomer && (
                <div className="mt-4 rounded-lg border border-surface-border p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={resellerAttestation}
                      onChange={(e) => setResellerAttestation(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-slate-700">
                      I confirm I have authority to provision these services on behalf of{' '}
                      <strong>{selectedCustomer.name}</strong>.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
                <Sparkles className="h-4 w-4 shrink-0" />
                Provisioning is typically completed within 2–5 minutes. You'll receive a confirmation email.
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="mt-4 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStepIndex(stepIndex - 1)}
              disabled={stepIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {!isLastStep ? (
              <Button onClick={() => setStepIndex(stepIndex + 1)} disabled={!canProceed()}>
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed()}>
                Confirm & provision
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div>
          <Card className="sticky top-8">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Order summary</h3>

            {selectedCustomer ? (
              <div className="mb-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Customer</p>
                <p className="text-sm font-medium text-slate-900">{selectedCustomer.name}</p>
              </div>
            ) : (
              <p className="mb-4 text-sm text-slate-400">No customer selected</p>
            )}

            {cart.length > 0 ? (
              <div className="mb-4 space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="truncate pr-2 text-slate-600">{item.product.name}</span>
                    <span className="shrink-0 text-slate-900">×{item.seats}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-sm text-slate-400">No plans added</p>
            )}

            {currentStepKey === 'agreements' && requiredAgreements.length > 0 && (
              <div className="mb-4 rounded-lg border border-surface-border p-3">
                <p className="text-xs font-medium text-slate-500">Agreements</p>
                <p className="mt-1 text-sm text-slate-900">
                  {acceptedAgreementIds.size}/{requiredAgreements.length} accepted
                </p>
                {!allAgreementsAccepted && (
                  <p className="mt-1 text-xs text-amber-600">Accept all to continue</p>
                )}
              </div>
            )}

            <div className="border-t border-surface-border pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Est. monthly total</span>
                <span className="text-lg font-semibold text-slate-900">
                  {totalMonthly > 0 ? formatCurrencyPrecise(totalMonthly) : '—'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Excludes taxes and Azure consumption</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
