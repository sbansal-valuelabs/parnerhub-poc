import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { PortalPageHeader } from '../../components/portal/PortalLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { FormField, inputClassName, selectClassName } from '../../components/ui/Modal'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { useCustomers } from '../../context/CustomerContext'
import { getResellerProfile } from '../../services/repository'

export function PortalSupportPage() {
  const resellerProfile = getResellerProfile()
  const { session } = usePortalAuth()
  const { getCustomer } = useCustomers()
  const customer = session ? getCustomer(session.customerId) : undefined

  const [type, setType] = useState('licenses')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <PortalPageHeader title="Support" />
        <Card className="py-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Request submitted</h2>
          <p className="mt-2 text-sm text-slate-500">
            {resellerProfile.name} will review your request and respond within 1 business day.
          </p>
          <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={() => setSubmitted(false)}>
            Submit another request
          </Button>
        </Card>
      </>
    )
  }

  return (
    <>
      <PortalPageHeader
        title="Support & requests"
        subtitle={`Contact ${resellerProfile.name} for license changes, new products, or help`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Request type" htmlFor="type">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectClassName}
              >
                <option value="licenses">Request additional licenses</option>
                <option value="product">Add new product / service</option>
                <option value="user">User onboarding / offboarding</option>
                <option value="billing">Billing question</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Details" htmlFor="message">
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="Describe what you need — e.g. 10 additional Business Premium licenses for the sales team..."
                className={inputClassName}
              />
            </FormField>

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Submit request to {resellerProfile.name}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900">Your IT partner</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Company</dt>
                <dd className="text-slate-900">{resellerProfile.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Your organisation</dt>
                <dd className="text-slate-900">{customer?.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Support email</dt>
                <dd className="text-emerald-600">support@nexusit.com.au</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900">Common requests</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Add licenses to existing subscription</li>
              <li>• Provision Microsoft 365 for new hires</li>
              <li>• Add Azure or security services</li>
              <li>• Offboard leaver and reclaim license</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
