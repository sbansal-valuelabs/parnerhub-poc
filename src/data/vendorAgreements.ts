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
    vendor: 'microsoft',
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
          'Customer orders Microsoft online services including Microsoft 365, Azure, Dynamics 365, and Power Platform subscriptions as specified in the order. Services are subject to the applicable Microsoft Product Terms and Online Services Terms incorporated by reference.',
          'Licences are user- or capacity-based as defined per SKU. Consumption services (e.g. Azure) are billed on actual usage in arrears.',
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
    vendor: 'microsoft',
    title: 'CSP Partner Authorisation',
    version: '1.0',
    effectiveDate: '1 January 2024',
    summary:
      'Authorises Synnex and the reseller to provision and manage Microsoft subscriptions for this tenant.',
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
    id: 'aws-customer-agreement',
    vendor: 'aws',
    title: 'AWS Customer Agreement',
    version: '2024.3',
    effectiveDate: '15 March 2024',
    summary:
      'Governs use of AWS services, including acceptable use, data processing, and consumption billing.',
    highlights: [
      'Pay-as-you-go consumption billed monthly',
      'Customer owns data; AWS shared responsibility model applies',
      'Reseller acts as billing partner via distributor',
    ],
    acceptanceLabel:
      'I confirm {customer} agrees to the AWS Customer Agreement and Service Terms for linked accounts.',
    documentBody: [
      {
        heading: '1. Agreement overview',
        paragraphs: [
          'This AWS Customer Agreement governs Customer\'s use of Amazon Web Services offered under the linked AWS account(s) created or managed through the Partner order. The AWS Service Terms, Acceptable Use Policy, and Privacy Notice are incorporated by reference.',
        ],
      },
      {
        heading: '2. Account structure',
        paragraphs: [
          'Customer receives a dedicated AWS account (or organisation member account) for isolation and billing. Reseller may assume a cross-account IAM role for provisioning and support as defined in the AWS Channel Partner programme.',
        ],
      },
      {
        heading: '3. Pricing & billing',
        paragraphs: [
          'Services are billed on consumption. Estimated spend is shown at order time; actual charges depend on usage. Billing currency is AUD unless otherwise configured. Invoices flow: AWS → Synnex → Reseller → Customer.',
        ],
      },
      {
        heading: '4. Shared responsibility',
        paragraphs: [
          'AWS is responsible for security of the cloud infrastructure. Customer is responsible for security in the cloud, including IAM configuration, encryption choices, and network controls.',
        ],
      },
      {
        heading: '5. Termination',
        paragraphs: [
          'Customer may close the account subject to settlement of outstanding charges. Reseller will assist with de-provisioning and data export where applicable.',
        ],
      },
    ],
  },
  {
    id: 'google-workspace-terms',
    vendor: 'google',
    title: 'Google Workspace / Cloud Terms',
    version: '2024.2',
    effectiveDate: '1 February 2024',
    summary:
      'Covers Google Workspace licensing, admin console access, and Google Cloud Platform where applicable.',
    highlights: [
      'Domain verification required before activation',
      'Super-admin delegated to partner for provisioning',
      'Data processing terms included for AU region',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts Google Workspace Terms of Service and Data Processing Amendment.',
    documentBody: [
      {
        heading: '1. Services',
        paragraphs: [
          'Google Workspace subscriptions include Gmail, Drive, Meet, Calendar, and Admin console as per ordered edition. Google Cloud Platform services, if ordered, are subject to separate GCP Service Terms.',
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
          'Customer may delegate reseller as a partial or full admin for licence management. Customer retains ultimate control of super-admin accounts and org policies.',
        ],
      },
      {
        heading: '4. Data processing',
        paragraphs: [
          'Google processes data in accordance with the Google Workspace/Data Processing Amendment. Customer data for AU tenants is stored in Google\'s Sydney region unless Customer configures multi-region policies.',
        ],
      },
    ],
  },
  {
    id: 'adobe-enterprise-terms',
    vendor: 'adobe',
    title: 'Adobe Enterprise Terms & VIP',
    version: '2024.1',
    effectiveDate: '1 January 2024',
    summary:
      'Enterprise licensing terms for Adobe Acrobat Sign and Creative Cloud products ordered via distributor.',
    highlights: [
      'Named-user or device licensing per SKU',
      'Renewal aligned to anniversary date',
      'Adobe DPA applies to document workflows',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts Adobe Enterprise Subscription Terms for the selected products.',
    documentBody: [
      {
        heading: '1. Licence model',
        paragraphs: [
          'Adobe subscriptions are granted on a named-user basis unless a device-based SKU is specified. Users must be uniquely identified and may not share credentials.',
        ],
      },
      {
        heading: '2. VIP / distributor fulfilment',
        paragraphs: [
          'Orders are fulfilled through Adobe\'s Value Incentive Plan channel via Synnex. Anniversary dates and true-ups follow Adobe commercial calendar rules.',
        ],
      },
      {
        heading: '3. Document services',
        paragraphs: [
          'For Acrobat Sign and PDF services, Customer data is processed under the Adobe Data Processing Agreement. Customer is data controller for documents uploaded by end users.',
        ],
      },
    ],
  },
  {
    id: 'crowdstrike-msa',
    vendor: 'crowdstrike',
    title: 'CrowdStrike Master Subscription Agreement',
    version: '2023.4',
    effectiveDate: '1 October 2023',
    summary:
      'Endpoint protection subscription terms, deployment requirements, and data collection for threat detection.',
    highlights: [
      'Agent deployment required within 30 days',
      'Minimum term applies to annual billing',
      'Telemetry processed per CrowdStrike privacy policy',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts the CrowdStrike Falcon subscription terms and deployment requirements.',
    documentBody: [
      {
        heading: '1. Subscription',
        paragraphs: [
          'CrowdStrike Falcon platform modules are licensed per endpoint or per sensor as specified. Customer must deploy the Falcon agent to entitled endpoints within thirty (30) days of activation.',
        ],
      },
      {
        heading: '2. Telemetry & privacy',
        paragraphs: [
          'The Falcon agent collects endpoint telemetry necessary for threat detection and response. Data is processed according to CrowdStrike\'s privacy policy and Customer\'s data processing settings.',
        ],
      },
      {
        heading: '3. Support & updates',
        paragraphs: [
          'CrowdStrike provides continuous cloud-delivered updates. Customer is responsible for maintaining agent connectivity and compatible operating system versions.',
        ],
      },
    ],
  },
  {
    id: 'salesforce-msa',
    vendor: 'salesforce',
    title: 'Salesforce Master Subscription Agreement',
    version: '2024.1',
    effectiveDate: '1 January 2024',
    summary:
      'CRM cloud service terms including user licensing, sandbox usage, and Trust & Compliance documentation.',
    highlights: [
      'Per-user licensing; true-up on overage',
      'Org created under partner referral where applicable',
      'Data hosted in Salesforce AU pod when selected',
    ],
    acceptanceLabel:
      'I confirm {customer} accepts the Salesforce Master Subscription Agreement for this org.',
    documentBody: [
      {
        heading: '1. Subscription services',
        paragraphs: [
          'Salesforce grants Customer a non-exclusive right to use ordered cloud services for internal business purposes. User licences are counted by named users with access to production orgs.',
        ],
      },
      {
        heading: '2. Org provisioning',
        paragraphs: [
          'Partner may create or link a Salesforce org under Customer\'s identity. Customer admin accepts org ownership and security configuration responsibilities upon first login.',
        ],
      },
      {
        heading: '3. Data & hosting',
        paragraphs: [
          'Production data for AU customers is hosted in Salesforce\'s Australian infrastructure (Hyperforce AU) when selected at provisioning. Backup and disaster recovery follow Salesforce Trust documentation.',
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
