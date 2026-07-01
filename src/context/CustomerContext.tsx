import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { customers as initialCustomers } from '../data/mock'
import type { Customer } from '../types'

export interface NewCustomerInput {
  name: string
  domain: string
  contactName: string
  contactEmail: string
  industry: string
  users: number
  linkExistingTenant: boolean
}

interface CustomerContextValue {
  customers: Customer[]
  addCustomer: (input: NewCustomerInput) => Customer
  getCustomer: (id: string) => Customer | undefined
}

const CustomerContext = createContext<CustomerContextValue | null>(null)

function generateId(): string {
  return `cust-${Date.now().toString(36)}`
}

function generateTenantId(): string {
  const segment = () => Math.random().toString(16).slice(2, 6)
  return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)

  const addCustomer = useCallback((input: NewCustomerInput): Customer => {
    const customer: Customer = {
      id: generateId(),
      name: input.name.trim(),
      domain: input.domain.trim().toLowerCase(),
      contactName: input.contactName.trim(),
      contactEmail: input.contactEmail.trim().toLowerCase(),
      industry: input.industry,
      users: input.users,
      status: input.linkExistingTenant ? 'active' : 'onboarding',
      tenantId: generateTenantId(),
      mrr: 0,
      subscriptions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setCustomers((prev) => [customer, ...prev])
    return customer
  }, [])

  const getCustomer = useCallback(
    (id: string) => customers.find((c) => c.id === id),
    [customers]
  )

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, getCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider')
  return ctx
}
