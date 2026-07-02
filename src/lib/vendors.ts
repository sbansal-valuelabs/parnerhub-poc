import type { CloudVendor } from '../types'

export interface VendorConfig {
  id: CloudVendor
  name: string
  shortName: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}

/** Vendor lines available on the Synnex cloud marketplace (demo catalogue). */
export const vendors: Record<CloudVendor, VendorConfig> = {
  'microsoft-csp': {
    id: 'microsoft-csp',
    name: 'Microsoft CSP',
    shortName: 'CSP',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    description: 'Microsoft 365, Defender, and Dynamics via Cloud Solution Provider',
  },
  'microsoft-azure': {
    id: 'microsoft-azure',
    name: 'Microsoft Azure',
    shortName: 'Az',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-200',
    description: 'Azure consumption, reservations, and infrastructure services',
  },
  'google-workspace': {
    id: 'google-workspace',
    name: 'Google Workspace',
    shortName: 'GWS',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Gmail, Drive, Meet, and collaboration for organisations',
  },
  'google-cloud': {
    id: 'google-cloud',
    name: 'Google Cloud',
    shortName: 'GCP',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Compute, storage, and platform services on Google Cloud',
  },
  acronis: {
    id: 'acronis',
    name: 'Acronis',
    shortName: 'Ac',
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    description: 'Cyber Protect Cloud backup, disaster recovery, and security',
  },
}

export const vendorList = Object.values(vendors)

export function getVendor(id: CloudVendor): VendorConfig {
  return vendors[id]
}
