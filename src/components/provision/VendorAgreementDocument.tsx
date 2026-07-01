import { Modal } from '../ui/Modal'
import { VendorBadge } from '../ui/VendorBadge'
import type { VendorAgreement } from '../../data/vendorAgreements'
import { getVendor } from '../../lib/vendors'

interface VendorAgreementDocumentProps {
  agreement: VendorAgreement | null
  customerName: string
  open: boolean
  onClose: () => void
}

export function VendorAgreementDocument({
  agreement,
  customerName,
  open,
  onClose,
}: VendorAgreementDocumentProps) {
  if (!agreement) return null

  const vendor = getVendor(agreement.vendor)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={agreement.title}
      description={`${vendor.name} · Version ${agreement.version} · Effective ${agreement.effectiveDate}`}
      size="xl"
    >
      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <VendorBadge vendor={agreement.vendor} size="sm" />
            <span className="text-xs text-slate-500">Document ID: {agreement.id}</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">
            Prepared for: <strong>{customerName}</strong>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
            Sample agreement for demonstration — not legally binding
          </p>
        </div>

        <article className="space-y-6 px-1 font-serif text-sm leading-relaxed text-slate-800">
          {agreement.documentBody.map((section) => (
            <section key={section.heading}>
              <h3 className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-slate-900">
                {section.heading}
              </h3>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="mb-3 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        <div className="mt-6 border-t border-surface-border pt-4">
          <p className="font-sans text-xs text-slate-500">
            In production, this document is sourced from Synnex and vendor agreement repositories.
            Acceptance is timestamped and stored with the order record.
          </p>
        </div>
      </div>
    </Modal>
  )
}
