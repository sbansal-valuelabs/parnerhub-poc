import { useState } from 'react'
import { UserPlus, Shield } from 'lucide-react'
import { Modal, FormField, inputClassName, selectClassName } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useTeam, type NewStaffInput } from '../../context/TeamContext'
import { resellerRoleLabels, resellerRoleDescriptions, type ResellerRole } from '../../types'

const departments = ['Management', 'Cloud Services', 'Sales', 'Finance', 'Support', 'Other']

const roles: ResellerRole[] = ['admin', 'provisioning', 'sales', 'finance', 'read-only']

interface AddTeamMemberModalProps {
  open: boolean
  onClose: () => void
}

export function AddTeamMemberModal({ open, onClose }: AddTeamMemberModalProps) {
  const { addStaff } = useTeam()
  const [form, setForm] = useState<NewStaffInput>({
    name: '',
    email: '',
    role: 'provisioning',
    department: 'Cloud Services',
  })
  const [sent, setSent] = useState(false)

  const handleClose = () => {
    setForm({ name: '', email: '', role: 'provisioning', department: 'Cloud Services' })
    setSent(false)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addStaff(form)
    setSent(true)
    setTimeout(handleClose, 1500)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Invite team member"
      description="Send an invite to join your reseller organisation on PartnerHub."
    >
      {sent ? (
        <div className="py-6 text-center">
          <p className="text-sm font-medium text-emerald-700">Invite sent to {form.email}</p>
          <p className="mt-1 text-xs text-slate-500">They'll receive an email to set up their account.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full name" htmlFor="staff-name">
            <input
              id="staff-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClassName}
              placeholder="Jordan Lee"
            />
          </FormField>

          <FormField label="Work email" htmlFor="staff-email">
            <input
              id="staff-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClassName}
              placeholder="jordan.lee@nexusit.com.au"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Department" htmlFor="staff-dept">
              <select
                id="staff-dept"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={selectClassName}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Role" htmlFor="staff-role">
              <select
                id="staff-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as ResellerRole })}
                className={selectClassName}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{resellerRoleLabels[r]}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Shield className="h-3.5 w-3.5" />
              {resellerRoleLabels[form.role]}
            </span>
            <p className="mt-1">{resellerRoleDescriptions[form.role]}</p>
          </div>

          <div className="flex justify-end gap-3 border-t border-surface-border pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="submit">
              <UserPlus className="h-4 w-4" />
              Send invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
