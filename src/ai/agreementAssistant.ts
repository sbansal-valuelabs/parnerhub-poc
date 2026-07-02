import { vendorAgreements } from '../data/vendorAgreements'
import type { CloudVendor } from '../types'

export function summarizeAgreementsForVendors(vendors: CloudVendor[]): string {
  const agreements = vendorAgreements.filter((a) => vendors.includes(a.vendor))
  if (agreements.length === 0) {
    return 'No agreement documents are loaded for the vendors in this order. In production, Synnex and Partner Center supply the current versions.'
  }

  const lines = agreements.map((a) => {
    const bullets = a.highlights?.slice(0, 2).join('; ') ?? a.summary
    return `**${a.title}** (v${a.version}): ${bullets}`
  })

  return [
    'Before submitting, you must accept:',
    '',
    ...lines,
    '',
    'As reseller you attest the customer has delegated authority. Microsoft MCA may also be sent to the customer contact for direct acceptance.',
  ].join('\n')
}

export function explainAgreementById(agreementId: string, customerName: string): string {
  const agreement = vendorAgreements.find((a) => a.id === agreementId)
  if (!agreement) {
    return 'Agreement not found.'
  }

  const points = agreement.highlights.map((h) => `• ${h}`).join('\n')
  return [
    `**${agreement.title}** (v${agreement.version})`,
    '',
    agreement.summary,
    '',
    'Key points:',
    points,
    '',
    `For **${customerName}**, you confirm you have authority to accept on the customer's behalf. The full document should be reviewed before checking the acceptance box.`,
  ].join('\n')
}

export function explainAgreementTopic(query: string): string | null {
  const q = query.toLowerCase()
  if (!/agreement|mca|terms|accept|legal|compliance/.test(q)) return null

  if (/microsoft|mca|m365|csp/.test(q)) {
    return 'The **Microsoft Customer Agreement (MCA)** confirms the end customer accepts Microsoft product terms and billing via your CSP partnership. You also need **CSP Partner Authorisation** so Synnex can place orders on the tenant. Both are recorded at provisioning time.'
  }
  if (/azure/.test(q)) {
    return 'The **Microsoft Azure Subscription Agreement** covers consumption billing, acceptable use, and the shared responsibility model. Azure enrollments are billed via your Synnex distributor credit line.'
  }
  if (/workspace|gmail|gws/.test(q)) {
    return '**Google Workspace terms** include domain verification before activation and data processing for AU tenants. Super-admin may be delegated to you for provisioning.'
  }
  if (/google cloud|gcp/.test(q)) {
    return '**Google Cloud Platform terms** govern consumption billing and project security. Billing accounts are linked through the Synnex reseller channel.'
  }
  if (/acronis|backup|cyber protect/.test(q)) {
    return 'The **Acronis Cyber Protect Cloud Service Agreement** covers backup, disaster recovery, and security modules. Agent deployment and Microsoft 365 tenant authorisation may be required.'
  }
  return summarizeAgreementsForVendors([
    'microsoft-csp',
    'microsoft-azure',
    'google-workspace',
    'google-cloud',
    'acronis',
  ])
}
