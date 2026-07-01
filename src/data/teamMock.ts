import type { ResellerStaff } from '../types'

export const resellerTeam: ResellerStaff[] = [
  {
    id: 'staff-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@nexusit.com.au',
    role: 'admin',
    status: 'active',
    department: 'Management',
    lastActive: '2025-06-24T09:30:00',
  },
  {
    id: 'staff-002',
    name: 'Jordan Lee',
    email: 'jordan.lee@nexusit.com.au',
    role: 'provisioning',
    status: 'active',
    department: 'Cloud Services',
    lastActive: '2025-06-24T08:15:00',
  },
  {
    id: 'staff-003',
    name: 'Sam Patel',
    email: 'sam.patel@nexusit.com.au',
    role: 'provisioning',
    status: 'active',
    department: 'Cloud Services',
    lastActive: '2025-06-23T17:45:00',
  },
  {
    id: 'staff-004',
    name: 'Taylor Brooks',
    email: 'taylor.brooks@nexusit.com.au',
    role: 'sales',
    status: 'active',
    department: 'Sales',
    lastActive: '2025-06-24T07:00:00',
  },
  {
    id: 'staff-005',
    name: 'Casey Nguyen',
    email: 'casey.nguyen@nexusit.com.au',
    role: 'finance',
    status: 'active',
    department: 'Finance',
    lastActive: '2025-06-22T14:30:00',
  },
  {
    id: 'staff-006',
    name: 'Morgan Wright',
    email: 'm.wright@nexusit.com.au',
    role: 'read-only',
    status: 'invited',
    department: 'Support',
    lastActive: '',
    invitedAt: '2025-06-20T10:00:00',
  },
]

export const currentResellerUser = {
  staffId: 'staff-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@nexusit.com.au',
  role: 'admin' as const,
}
