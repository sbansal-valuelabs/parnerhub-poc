import { useState } from 'react'
import { FileText, ShieldCheck } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { VendorBadge } from '../ui/VendorBadge'
import type { VendorAgreement } from '../../data/vendorAgreements'
import { formatAcceptanceLabel } from '../../data/vendorAgreements'
import { VendorAgreementDocument } from './VendorAgreementDocument'
import { AgreementAiPanel } from '../ai/AgreementAiPanel'
import type { CloudVendor } from '../../types'
import { cn } from '../../lib/utils'

interface VendorAgreementsStepProps {
  agreements: VendorAgreement[]
  customerName: string
  acceptedIds: Set<string>
  onToggle: (agreementId: string, accepted: boolean) => void
}

export function VendorAgreementsStep({
  agreements,
  customerName,
  acceptedIds,
  onToggle,
}: VendorAgreementsStepProps) {
  const [viewingAgreement, setViewingAgreement] = useState<VendorAgreement | null>(null)
  const acceptedCount = agreements.filter((a) => acceptedIds.has(a.id)).length
  const vendors = [...new Set(agreements.map((a) => a.vendor))] as CloudVendor[]

  return (
    <>
      <Card>
        <AgreementAiPanel
          vendors={vendors}
          customerName={customerName}
          agreements={agreements}
        />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Vendor agreements</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review each agreement document and accept required terms before submitting this order.
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {acceptedCount}/{agreements.length}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Accepted</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              As an authorised reseller, you attest that <strong>{customerName}</strong> has delegated
              authority to you for cloud provisioning. Microsoft MCA may also be sent to the customer
              contact for direct acceptance.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {agreements.map((agreement) => {
            const isAccepted = acceptedIds.has(agreement.id)

            return (
              <div
                key={agreement.id}
                className={cn(
                  'rounded-lg border p-4 transition-colors',
                  isAccepted ? 'border-emerald-200 bg-emerald-50/40' : 'border-surface-border bg-white'
                )}
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <VendorBadge vendor={agreement.vendor} size="sm" showName={false} />
                      <p className="text-sm font-medium text-slate-900">{agreement.title}</p>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        v{agreement.version}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{agreement.summary}</p>
                    <ul className="mt-2 ml-4 list-disc space-y-0.5 text-xs text-slate-600">
                      {agreement.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setViewingAgreement(agreement)}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View full agreement
                    </Button>
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border bg-white p-3 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isAccepted}
                    onChange={(e) => onToggle(agreement.id, e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">
                    {formatAcceptanceLabel(agreement.acceptanceLabel, customerName)}
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </Card>

      <VendorAgreementDocument
        agreement={viewingAgreement}
        customerName={customerName}
        open={viewingAgreement !== null}
        onClose={() => setViewingAgreement(null)}
      />
    </>
  )
}
