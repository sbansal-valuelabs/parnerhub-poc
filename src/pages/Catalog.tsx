import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Check, Zap, Clock, TrendingUp, LayoutGrid } from 'lucide-react'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SearchInput } from '../components/ui/SearchInput'
import { VendorBadge } from '../components/ui/VendorBadge'
import { listProducts, getMarketplaceStats } from '../services/repository'
import { categoryLabels, categoryColors, type ProductCategory, type CloudVendor } from '../types'
import { vendorList } from '../lib/vendors'
import { FilterChip } from '../components/ui/FilterChip'
import { formatCurrencyPrecise } from '../lib/utils'

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'security', label: 'Security' },
  { value: 'business-apps', label: 'Business Apps' },
  { value: 'backup', label: 'Backup & recovery' },
]

const painPoints = [
  { icon: LayoutGrid, label: 'One catalog', desc: 'Plans & SKUs from every vendor in one search' },
  { icon: Zap, label: 'Fast provision', desc: 'Guided wizard — no switching between vendor portals' },
  { icon: TrendingUp, label: 'Margin visible', desc: 'See your margin before you provision' },
  { icon: Clock, label: 'Live ETA', desc: 'Estimated activation time on every SKU' },
]

export function CatalogPage() {
  const products = listProducts()
  const marketplaceStats = getMarketplaceStats()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [vendor, setVendor] = useState<CloudVendor | 'all'>('all')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor.includes(search.toLowerCase())
      const matchesCategory = category === 'all' || p.category === category
      const matchesVendor = vendor === 'all' || p.vendor === vendor
      return matchesSearch && matchesCategory && matchesVendor
    })
  }, [search, category, vendor])

  const vendorCounts = useMemo(() => {
    const counts: Partial<Record<CloudVendor, number>> = {}
    products.forEach((p) => {
      counts[p.vendor] = (counts[p.vendor] ?? 0) + 1
    })
    return counts
  }, [])

  return (
    <>
      <Header
        title="Cloud Marketplace"
        subtitle={`${marketplaceStats.totalProducts} service plans & SKUs · ${marketplaceStats.vendors} vendors · powered by Synnex`}
        action={
          <Link to="/provision">
            <Button>
              <ShoppingCart className="h-4 w-4" />
              Provision for customer
            </Button>
          </Link>
        }
      />

      {/* Value prop vs legacy Synnex portal */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {painPoints.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100">
              <Icon className="h-4 w-4 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vendor filter — primary navigation */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Filter by vendor</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setVendor('all')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              vendor === 'all'
                ? 'bg-slate-900 text-white'
                : 'border border-surface-border bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All vendors
            <span className="ml-1.5 opacity-70">({products.length})</span>
          </button>
          {vendorList.map((v) => (
            <button
              key={v.id}
              onClick={() => setVendor(v.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                vendor === v.id
                  ? `${v.bgColor} ${v.color} ring-2 ring-offset-1 ring-current`
                  : 'border border-surface-border bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${v.bgColor} ${v.color}`}>
                {v.shortName}
              </span>
              {v.name}
              <span className="opacity-70">({vendorCounts[v.id] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <FilterChip
              key={cat.value}
              active={category === cat.value}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </FilterChip>
          ))}
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by product, SKU, or vendor..."
          className="sm:w-80"
        />
      </div>

      <p className="mb-4 text-sm text-slate-500">
        Showing {filtered.length} plan{filtered.length !== 1 ? 's' : ''}
        {vendor !== 'all' && ` from ${vendorList.find((v) => v.id === vendor)?.name}`}
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <Card key={product.id} className="flex flex-col !p-0 overflow-hidden transition-shadow hover:shadow-elevated">
            <div className="border-b border-surface-border p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <VendorBadge vendor={product.vendor} size="md" />
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[product.category]}`}>
                    {categoryLabels[product.category]}
                  </span>
                </div>
                {product.popular && (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    Popular
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
              <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <ul className="mb-4 space-y-1.5">
                {product.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3 border-t border-surface-border pt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  {product.provisioningMins && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      ~{product.provisioningMins} min activation
                    </span>
                  )}
                  {product.marginPercent && (
                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {product.marginPercent}% margin
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    {product.priceMonthly > 0 ? (
                      <>
                        <span className="text-xl font-semibold text-slate-900">
                          {formatCurrencyPrecise(product.priceMonthly)}
                        </span>
                        <span className="text-sm text-slate-500">/user/mo</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-slate-700">Consumption-based</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Min {product.minSeats} seat{product.minSeats > 1 ? 's' : ''}
                  </span>
                </div>

                <Link to={`/provision?product=${product.id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    Provision for customer
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="py-12 text-center">
          <p className="text-sm text-slate-500">No products match your filters. Try a different vendor or category.</p>
        </Card>
      )}
    </>
  )
}
