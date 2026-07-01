import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Link2, Sparkles } from 'lucide-react'
import { Modal, FormField, inputClassName, selectClassName } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useCustomers, type NewCustomerInput } from '../../context/CustomerContext'

const industries = [
  'Manufacturing',
  'Legal',
  'Healthcare',
  'Retail',
  'Finance',
  'Technology',
  'Education',
  'Government',
  'Other',
]

interface AddCustomerModalProps {
  open: boolean
  onClose: () => void
}

type FormErrors = Partial<Record<keyof NewCustomerInput, string>>

function validate(form: NewCustomerInput): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Company name is required'
  if (!form.domain.trim()) {
    errors.domain = 'Domain is required'
  } else if (!/^[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)+$/i.test(form.domain.trim())) {
    errors.domain = 'Enter a valid domain (e.g. acme.com.au)'
  }
  if (!form.contactName.trim()) errors.contactName = 'Contact name is required'
  if (!form.contactEmail.trim()) {
    errors.contactEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid email address'
  }
  if (form.users < 0) errors.users = 'User count cannot be negative'
  return errors
}

const emptyForm: NewCustomerInput = {
  name: '',
  domain: '',
  contactName: '',
  contactEmail: '',
  industry: 'Technology',
  users: 0,
  linkExistingTenant: false,
}

export function AddCustomerModal({ open, onClose }: AddCustomerModalProps) {
  const navigate = useNavigate()
  const { addCustomer } = useCustomers()
  const [form, setForm] = useState<NewCustomerInput>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const update = <K extends keyof NewCustomerInput>(key: K, value: NewCustomerInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleClose = () => {
    setForm(emptyForm)
    setErrors({})
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const customer = addCustomer(form)
      setSubmitting(false)
      handleClose()
      navigate(`/customers/${customer.id}`)
    }, 600)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add customer"
      description="Register a new end customer and link their cloud accounts across vendors."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Acme Pty Ltd"
              className={inputClassName}
              autoFocus
            />
          </FormField>

          <FormField label="Primary domain" htmlFor="domain" error={errors.domain}>
            <input
              id="domain"
              type="text"
              value={form.domain}
              onChange={(e) => update('domain', e.target.value)}
              placeholder="acme.com.au"
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Primary contact" htmlFor="contactName" error={errors.contactName}>
            <input
              id="contactName"
              type="text"
              value={form.contactName}
              onChange={(e) => update('contactName', e.target.value)}
              placeholder="Jane Smith"
              className={inputClassName}
            />
          </FormField>

          <FormField label="Contact email" htmlFor="contactEmail" error={errors.contactEmail}>
            <input
              id="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => update('contactEmail', e.target.value)}
              placeholder="jane.smith@acme.com.au"
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Industry" htmlFor="industry">
            <select
              id="industry"
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
              className={selectClassName}
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Expected users" htmlFor="users" error={errors.users}>
            <input
              id="users"
              type="number"
              min={0}
              value={form.users}
              onChange={(e) => update('users', parseInt(e.target.value) || 0)}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="rounded-lg border border-surface-border p-4">
          <p className="mb-3 text-sm font-medium text-slate-900">Cloud account setup</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border p-3 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="tenantOption"
              checked={!form.linkExistingTenant}
              onChange={() => update('linkExistingTenant', false)}
              className="mt-0.5 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="h-4 w-4 text-brand-600" />
                Create new cloud tenant
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Provision a new tenant via Synnex (Microsoft, Google, or AWS). Status will be Onboarding.
              </p>
            </div>
          </label>

          <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border p-3 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="tenantOption"
              checked={form.linkExistingTenant}
              onChange={() => update('linkExistingTenant', true)}
              className="mt-0.5 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Link2 className="h-4 w-4 text-brand-600" />
                Link existing cloud account
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Customer already has vendor accounts. Link via partner delegation (GDAP, AWS Org, etc.).
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            <Building2 className="h-4 w-4" />
            {submitting ? 'Creating...' : 'Create customer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
