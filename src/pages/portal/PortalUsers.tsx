import { useState } from 'react'
import { PortalPageHeader } from '../../components/portal/PortalLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { getUsersForCustomer } from '../../data/portalMock'
import { formatRelativeTime } from '../../lib/utils'

export function PortalUsersPage() {
  const { session } = usePortalAuth()
  const [search, setSearch] = useState('')
  const users = session ? getUsersForCustomer(session.customerId) : []

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <PortalPageHeader
        title="Users"
        subtitle="People in your organisation and their assigned licenses"
      />

      <Card className="!p-0 overflow-hidden">
        <div className="border-b border-surface-border p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, or department..."
            className="sm:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Licenses</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last sign-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{user.department}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.licenses.map((lic) => (
                        <Badge key={lic} variant="neutral" className="text-[10px]">
                          {lic.replace('Microsoft 365 ', 'M365 ').replace('Microsoft ', '')}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {formatRelativeTime(user.lastSignIn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            {users.length === 0 ? 'No users in directory yet.' : 'No users match your search.'}
          </div>
        )}
      </Card>

      <p className="mt-4 text-xs text-slate-400">
        To add or remove users, contact your IT partner. Self-service user management can be enabled by your administrator.
      </p>
    </>
  )
}
