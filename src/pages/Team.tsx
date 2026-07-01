import { useState } from 'react'
import { UserPlus, Shield, Mail, MoreHorizontal } from 'lucide-react'
import { Header } from '../components/layout/Sidebar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { SearchInput } from '../components/ui/SearchInput'
import { AddTeamMemberModal } from '../components/team/AddTeamMemberModal'
import { useTeam } from '../context/TeamContext'
import { useToast } from '../context/ToastContext'
import { resellerRoleLabels, resellerRoleDescriptions, type ResellerRole } from '../types'
import { formatRelativeTime } from '../lib/utils'
import { cn } from '../lib/utils'
import { EmptyState } from '../components/ui/EmptyState'

const roleBadgeVariant: Record<ResellerRole, 'default' | 'success' | 'info' | 'warning' | 'neutral'> = {
  admin: 'default',
  provisioning: 'success',
  sales: 'info',
  finance: 'warning',
  'read-only': 'neutral',
}

const permissions = [
  { label: 'Manage team', admin: true, provisioning: false, sales: false, finance: false, 'read-only': false },
  { label: 'Add customers', admin: true, provisioning: true, sales: false, finance: false, 'read-only': false },
  { label: 'Provision services', admin: true, provisioning: true, sales: false, finance: false, 'read-only': false },
  { label: 'View marketplace', admin: true, provisioning: true, sales: true, finance: true, 'read-only': true },
  { label: 'View subscriptions', admin: true, provisioning: true, sales: true, finance: true, 'read-only': true },
  { label: 'Manage billing / credit', admin: true, provisioning: false, sales: false, finance: true, 'read-only': false },
  { label: 'Integrations & settings', admin: true, provisioning: false, sales: false, finance: false, 'read-only': false },
]

export function TeamPage() {
  const { team, currentUser, isAdmin, deactivateStaff, resendInvite } = useTeam()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const activeTeam = team.filter((m) => m.status !== 'deactivated')
  const filtered = activeTeam.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header
        title="Team"
        subtitle="Manage your reseller staff, roles, and access permissions"
        action={
          isAdmin ? (
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4" />
              Invite member
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 rounded-lg border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm text-slate-700">
        Signed in as <strong>{currentUser.name}</strong> ({resellerRoleLabels[currentUser.role]}).
        {isAdmin
          ? ' You can invite staff and assign roles below.'
          : ' Contact an administrator to change team access.'}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-surface-border p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search team members..."
                className="sm:w-80"
              />
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={<Shield className="h-6 w-6" />}
                title={search ? 'No team members match your search' : 'No team members'}
                description={isAdmin ? 'Invite your first colleague to collaborate on provisioning.' : undefined}
                action={
                  isAdmin && !search ? (
                    <Button size="sm" onClick={() => setShowAddModal(true)}>
                      <UserPlus className="h-4 w-4" />
                      Invite member
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Last active</th>
                    {isAdmin && <th className="px-5 py-3"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filtered.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {member.name}
                              {member.id === currentUser.staffId && (
                                <span className="ml-2 text-xs text-slate-400">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={roleBadgeVariant[member.role]}>
                          {resellerRoleLabels[member.role]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{member.department}</td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            member.status === 'active'
                              ? 'success'
                              : member.status === 'invited'
                                ? 'warning'
                                : 'neutral'
                          }
                        >
                          {member.status === 'active' ? 'Active' : member.status === 'invited' ? 'Invited' : 'Deactivated'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {member.lastActive ? formatRelativeTime(member.lastActive) : '—'}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-4">
                          {member.id !== currentUser.staffId && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {openMenu === member.id && (
                                <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-surface-border bg-white py-1 shadow-elevated">
                                  {member.status === 'invited' && (
                                    <button
                                      onClick={() => {
                                        resendInvite(member.id)
                                        setOpenMenu(null)
                                        toast(`Invite resent to ${member.email}`, 'info')
                                      }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      <Mail className="h-3.5 w-3.5" />
                                      Resend invite
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      deactivateStaff(member.id)
                                      setOpenMenu(null)
                                      toast(`${member.name} deactivated`)
                                    }}
                                    className="flex w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  >
                                    Deactivate
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-surface-border md:hidden">
              {filtered.map((member) => (
                <div key={member.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {member.name}
                        {member.id === currentUser.staffId && (
                          <span className="ml-1 text-xs text-slate-400">(you)</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{member.department}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant={roleBadgeVariant[member.role]}>
                          {resellerRoleLabels[member.role]}
                        </Badge>
                        <Badge
                          variant={
                            member.status === 'active'
                              ? 'success'
                              : member.status === 'invited'
                                ? 'warning'
                                : 'neutral'
                          }
                        >
                          {member.status === 'active' ? 'Active' : member.status === 'invited' ? 'Invited' : 'Deactivated'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              </>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Shield className="h-4 w-4 text-brand-600" />
              Role permissions
            </h2>
            <div className="space-y-3">
              {(Object.keys(resellerRoleLabels) as ResellerRole[]).map((role) => (
                <div key={role} className="rounded-lg border border-surface-border p-3">
                  <p className="text-sm font-medium text-slate-900">{resellerRoleLabels[role]}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{resellerRoleDescriptions[role]}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-semibold text-slate-900">Permission matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="pb-2 pr-2">Action</th>
                    <th className="pb-2 px-1 text-center">Admin</th>
                    <th className="pb-2 px-1 text-center">Prov.</th>
                    <th className="pb-2 px-1 text-center">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.slice(0, 5).map((p) => (
                    <tr key={p.label} className="border-t border-surface-border">
                      <td className="py-2 pr-2 text-slate-700">{p.label}</td>
                      {(['admin', 'provisioning', 'sales'] as const).map((role) => (
                        <td key={role} className="py-2 px-1 text-center">
                          <span className={cn(p[role] ? 'text-emerald-600' : 'text-slate-300')}>
                            {p[role] ? '✓' : '—'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {isAdmin && (
        <AddTeamMemberModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      )}
    </>
  )
}
