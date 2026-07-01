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

export const vendors: Record<CloudVendor, VendorConfig> = {
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    shortName: 'MS',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    description: 'M365, Azure, Dynamics, Power Platform',
  },
  aws: {
    id: 'aws',
    name: 'Amazon Web Services',
    shortName: 'AWS',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    description: 'Compute, storage, and cloud infrastructure',
  },
  google: {
    id: 'google',
    name: 'Google Cloud',
    shortName: 'GCP',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Workspace, GCP, and collaboration tools',
  },
  adobe: {
    id: 'adobe',
    name: 'Adobe',
    shortName: 'Ad',
    color: 'text-rose-700',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-200',
    description: 'Creative Cloud and document services',
  },
  crowdstrike: {
    id: 'crowdstrike',
    name: 'CrowdStrike',
    shortName: 'CS',
    color: 'text-slate-800',
    bgColor: 'bg-slate-200',
    borderColor: 'border-slate-300',
    description: 'Endpoint detection and response',
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    shortName: 'SF',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-200',
    description: 'CRM and customer experience cloud',
  },
}

export const vendorList = Object.values(vendors)

export function getVendor(id: CloudVendor): VendorConfig {
  return vendors[id]
}
