import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getDataProvider } from '../services'
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

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() =>
    getDataProvider().listCustomers()
  )

  const addCustomer = useCallback((input: NewCustomerInput): Customer => {
    const customer = getDataProvider().createCustomer(input)
    setCustomers(getDataProvider().listCustomers())
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
