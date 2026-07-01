import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { resellerProfile } from '../data/mock'

export function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Manage your reseller profile and integrations" />
      <div className="mb-6">
        <Link to="/team">
          <Button variant="outline">Manage team & roles →</Button>
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-900">Reseller profile</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-slate-500">Company name</dt>
              <dd className="text-sm text-slate-900">{resellerProfile.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Partner tier</dt>
              <dd className="text-sm text-slate-900">{resellerProfile.tier}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Distributor</dt>
              <dd className="text-sm text-slate-900">{resellerProfile.distributor}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-900">Integrations</h2>
          <div className="space-y-3">
            {['Synnex Marketplace API', 'Microsoft Partner Center', 'AWS Partner Network', 'Google Cloud Reseller', 'ConnectWise PSA'].map((name) => (
              <div key={name} className="flex items-center justify-between rounded-lg border border-surface-border p-3">
                <span className="text-sm text-slate-700">{name}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  Connected
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

export function HelpPage() {
  return (
    <>
      <Header title="Help & Support" subtitle="Resources for getting the most out of PartnerHub" />
      <Card>
        <p className="text-sm text-slate-600">
          This is a demo POC. In production, this section would include documentation, distributor support contacts,
          and provisioning guides.
        </p>
      </Card>
    </>
  )
}
