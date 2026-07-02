import type { CloudVendor } from '../types'

export interface AgreementSection {
  heading: string
  paragraphs: string[]
}

export interface VendorAgreement {
  id: string
  vendor: CloudVendor
  title: string
  version: string
  effectiveDate: string
  summary: string
  highlights: string[]
  acceptanceLabel: string
  /** Full agreement text shown in the document viewer (demo sample — not legally binding). */
  documentBody: AgreementSection[]
}

export const vendorAgreements: VendorAgreement[] = [
  {
    id: 'microsoft-mca',
    vendor: 'microsoft-csp',
    title: 'Microsoft Customer Agreement (MCA)',
    version: '2024.1',
    effectiveDate: '1 January 2024',
    summary:
      'Confirms the end customer accepts Microsoft product terms, data location policies, and billing through an authorised CSP partner.',
    highlights: [
      'Customer attestation recorded in Partner Center',
      'Required for all new Microsoft cloud subscriptions',
      'Reseller confirms authority to accept on behalf of customer',
    ],
    acceptanceLabel:
      'I confirm {customer} has accepted (or will accept via email) the Microsoft Customer Agreement for this order.',
    documentBody: [
      {
        heading: '1. Parties',
        paragraphs: [
          'This Microsoft Customer Agreement ("Agreement") is entered into between Microsoft Corporation ("Microsoft") and the Customer identified in the provisioning order, for cloud services ordered through an authorised Cloud Solution Provider ("Partner") and distributor.',
          'Partner: Synnex Australia Pty Ltd · Reseller: Authorised CSP Partner · Customer: As named in order details.',
        ],
      },
      {
        heading: '2. Scope of services',
        paragraphs: [
          'Customer orders Microsoft online services including Microsoft 365, Defender, and Dynamics 365 subscriptions as specified in the order. Services are subject to the applicable Microsoft Product Terms and Online Services Terms incorporated by reference.',
          'Licences are user- or capacity-based as defined per SKU. Services are provisioned under the Microsoft Cloud Solution Provider programme.',
        ],
      },
      {
        heading: '3. Customer responsibilities',
        paragraphs: [
          'Customer must maintain accurate tenant and billing contact information, comply with acceptable use policies, and ensure only entitled users consume licensed services.',
          'Customer acknowledges that Partner may hold delegated administrator rights to provision and manage subscriptions on Customer\'s behalf under the CSP programme.',
        ],
      },
      {
        heading: '4. Data protection & location',
        paragraphs: [
          'Microsoft processes Customer data in accordance with the Microsoft Products and Services Data Protection Addendum (DPA). Customer may select data residency options where available for applicable workloads.',
          'For Australian customers, core Microsoft 365 services are hosted in Australian datacentres unless Customer configures otherwise.',
        ],
      },
      {
        heading: '5. Billing & term',
        paragraphs: [
          'Subscriptions renew automatically unless cancelled per CSP cancellation policies. Monthly subscriptions may be adjusted for seat changes; annual commitments are subject to Microsoft NCE rules.',
          'Invoices are issued by the distributor to Partner; Partner bills Customer according to their commercial agreement.',
        ],
      },
      {
        heading: '6. Acceptance',
        paragraphs: [
          'By accepting this Agreement, Customer confirms they have read and agree to the Microsoft Customer Agreement, Product Terms, and Privacy Statement. Acceptance may be recorded electronically via PartnerHub and synchronised to Microsoft Partner Center.',
        ],
      },
    ],
  },
  {
    id: 'microsoft-csp-auth',
    vendor: 'microsoft-csp',
    title: 'CSP Partner Authorisation',
    version: '1.0',
    effectiveDate: '1 January 2024',
    summary:
      'Authorises Synnex and the reseller to provision and manage Microsoft CSP subscriptions for this tenant.',
    highlights: [
      'Delegated admin relationship required',
      'Billing via distributor credit line',
      'Aligns with Microsoft CSP programme rules',
    ],
    acceptanceLabel:
      'I authorise provisioning under our active Microsoft CSP partnership and delegated admin access.',
    documentBody: [
      {
        heading: '1. Authorisation',
        paragraphs: [
          'Customer hereby authorises the Reseller, as a Microsoft Cloud Solution Provider, and Synnex Australia Pty Ltd as distributor, to place orders, modify seat counts, and manage subscriptions in Microsoft Partner Center on Customer\'s tenant.',
        ],
      },
      {
        heading: '2. Delegated administration',
        paragraphs: [
          'Reseller is granted delegated admin privileges limited to subscription management, licence assignment support, and tenant configuration required for ordered services. Reseller shall not access Customer content except as necessary for support with Customer consent.',
        ],
      },
      {
        heading: '3. Partner obligations',
        paragraphs: [
          'Reseller warrants it holds a valid Microsoft CSP authorisation and will provision only SKUs Customer is entitled to order. Reseller will notify Customer of material changes to subscriptions, renewals, and price adjustments.',
        ],
      },
      {
        heading: '4. Distributor role',
        paragraphs: [
          'Synnex acts as billing aggregator and order fulfilment channel. Orders submitted via PartnerHub are transmitted to Synnex for credit validation and submission to Microsoft.',
        ],
      },
    ],
  },
  {
    id: 'microsoft-azure-enrollment',
    vendor: 'microsoft-azure',
    title: 'Microsoft Azure Subscription Agreement',
    version: '2024.2',
    effectiveDate: '1 February 2024',
    summary:
      'Governs Azure consumption services, billing, and the shared responsibility model for infrastructure workloads.',
    highlights: [
      'Pay-as-you-go consumption billed monthly in arrears',
      'Customer owns data; Microsoft shared responsibility model applies',
      'Billing aggregated via Synnex distributor credit line',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts the Microsoft Azure subscription terms and Online Services Terms for this enrollment.',
    documentBody: [
      {
        heading: '1. Agreement overview',
        paragraphs: [
          'This agreement governs Customer\'s use of Microsoft Azure services ordered through the Partner and Synnex. Microsoft Online Services Terms, Acceptable Use Policy, and Product Terms are incorporated by reference.',
        ],
      },
      {
        heading: '2. Enrollment & accounts',
        paragraphs: [
          'Customer receives an Azure enrollment linked to their organisation. Reseller may hold appropriate RBAC roles for provisioning, cost management, and support within the Azure Channel Partner programme.',
        ],
      },
      {
        heading: '3. Pricing & billing',
        paragraphs: [
          'Services are billed on consumption. Estimated spend may be shown at order time; actual charges depend on usage. Billing currency is AUD unless otherwise configured. Invoices flow: Microsoft → Synnex → Reseller → Customer.',
        ],
      },
      {
        heading: '4. Shared responsibility',
        paragraphs: [
          'Microsoft is responsible for security of the cloud platform. Customer is responsible for security in the cloud, including identity configuration, encryption choices, and network controls.',
        ],
      },
    ],
  },
  {
    id: 'google-workspace-terms',
    vendor: 'google-workspace',
    title: 'Google Workspace Terms of Service',
    version: '2024.2',
    effectiveDate: '1 February 2024',
    summary:
      'Covers Google Workspace licensing, domain verification, admin delegation, and data processing.',
    highlights: [
      'Domain verification required before activation',
      'Super-admin may be delegated to partner for provisioning',
      'Data processing terms included for AU region',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts Google Workspace Terms of Service and Data Processing Amendment.',
    documentBody: [
      {
        heading: '1. Services',
        paragraphs: [
          'Google Workspace subscriptions include Gmail, Drive, Meet, Calendar, and Admin console as per ordered edition. Services are provisioned under Google\'s reseller programme via Synnex.',
        ],
      },
      {
        heading: '2. Domain verification',
        paragraphs: [
          'Customer must verify domain ownership before service activation. Partner may assist with DNS record configuration. Until verification completes, provisioning remains in pending state.',
        ],
      },
      {
        heading: '3. Admin delegation',
        paragraphs: [
          'Customer may delegate reseller as a partial or full admin for licence management. Customer retains ultimate control of super-admin accounts and organisation policies.',
        ],
      },
      {
        heading: '4. Data processing',
        paragraphs: [
          'Google processes data in accordance with the Google Workspace Data Processing Amendment. Customer data for AU tenants is stored in Google\'s Sydney region unless Customer configures multi-region policies.',
        ],
      },
    ],
  },
  {
    id: 'google-cloud-terms',
    vendor: 'google-cloud',
    title: 'Google Cloud Platform Terms of Service',
    version: '2024.1',
    effectiveDate: '1 January 2024',
    summary:
      'Governs Google Cloud consumption billing, acceptable use, and platform service terms.',
    highlights: [
      'Consumption billed monthly in arrears',
      'Billing account linked via Synnex reseller channel',
      'Shared responsibility for cloud security applies',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts Google Cloud Platform Terms of Service for linked billing accounts.',
    documentBody: [
      {
        heading: '1. Platform services',
        paragraphs: [
          'Customer orders Google Cloud Platform services including Compute Engine, Cloud Storage, and related platform SKUs. Services are subject to the Google Cloud Platform Terms of Service and Service Specific Terms.',
        ],
      },
      {
        heading: '2. Billing account',
        paragraphs: [
          'A Google Cloud billing account is created or linked under the reseller channel. Consumption charges are aggregated and invoiced through Synnex to the Partner and Customer.',
        ],
      },
      {
        heading: '3. Acceptable use & security',
        paragraphs: [
          'Customer must comply with Google Cloud Acceptable Use Policy. Customer is responsible for IAM configuration, data classification, and workload security within their projects.',
        ],
      },
    ],
  },
  {
    id: 'acronis-msa',
    vendor: 'acronis',
    title: 'Acronis Cyber Protect Cloud Service Agreement',
    version: '2024.1',
    effectiveDate: '1 January 2024',
    summary:
      'Backup, disaster recovery, and cyber protection subscription terms for Acronis Cyber Protect Cloud.',
    highlights: [
      'Agent deployment required on protected workloads',
      'Microsoft 365 backup requires tenant authorisation',
      'Telemetry processed per Acronis privacy policy',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts the Acronis Cyber Protect Cloud service terms and deployment requirements.',
    documentBody: [
      {
        heading: '1. Subscription',
        paragraphs: [
          'Acronis Cyber Protect Cloud modules are licensed per workload as specified in the order. Customer must deploy the Acronis agent to entitled endpoints and servers within thirty (30) days of activation.',
        ],
      },
      {
        heading: '2. Microsoft 365 protection',
        paragraphs: [
          'Where Microsoft 365 backup is ordered, Customer grants Acronis appropriate API access to mailboxes, OneDrive, and SharePoint as defined in the setup wizard. Customer retains data ownership.',
        ],
      },
      {
        heading: '3. Security & updates',
        paragraphs: [
          'Acronis delivers continuous cloud updates for protection modules. Customer is responsible for maintaining agent connectivity and compatible operating system versions on protected workloads.',
        ],
      },
    ],
  },
]

export function getAgreementsForVendors(vendors: CloudVendor[]): VendorAgreement[] {
  const unique = [...new Set(vendors)]
  return vendorAgreements.filter((a) => unique.includes(a.vendor))
}

export function formatAcceptanceLabel(label: string, customerName: string): string {
  return label.replace(/\{customer\}/g, customerName)
}
