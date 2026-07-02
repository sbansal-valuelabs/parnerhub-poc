import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import {
  summarizeAgreementsForVendors,
  explainAgreementById,
} from '../../ai/agreementAssistant'
import type { CloudVendor } from '../../types'
import type { VendorAgreement } from '../../data/vendorAgreements'
import { cn } from '../../lib/utils'

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

interface AgreementAiPanelProps {
  vendors: CloudVendor[]
  customerName: string
  agreements: VendorAgreement[]
}

export function AgreementAiPanel({ vendors, customerName, agreements }: AgreementAiPanelProps) {
  const [open, setOpen] = useState(true)
  const [summary, setSummary] = useState(() => summarizeAgreementsForVendors(vendors))
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const focusedText = focusedId ? explainAgreementById(focusedId, customerName) : null

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50/90 to-brand-50/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-brand-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI agreement assistant</p>
            <p className="text-xs text-slate-500">
              Plain-language summary for {agreements.length} document{agreements.length !== 1 ? 's' : ''} in this order
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-violet-200/80 px-4 pb-4 pt-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {renderMarkdownLite(summary)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setFocusedId(null)
                setSummary(summarizeAgreementsForVendors(vendors))
              }}
              className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-800 hover:bg-violet-50"
            >
              Summarise full order
            </button>
            {agreements.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setFocusedId(a.id)
                  setSummary(explainAgreementById(a.id, customerName))
                }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  focusedId === a.id
                    ? 'border-brand-500 bg-brand-50 text-brand-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                Explain {a.vendor === 'microsoft-csp' && a.id.includes('mca') ? 'MCA' : a.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {focusedText && (
            <p className="mt-3 text-[10px] text-slate-400">
              Demo AI summary — not legal advice. Accept only after reading the full document.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** Inline explain control on a single agreement card */
export function AgreementAiExplainButton({
  agreement,
  customerName,
  onExplain,
}: {
  agreement: VendorAgreement
  customerName: string
  onExplain?: (text: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onExplain?.(explainAgreementById(agreement.id, customerName))}
      className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 hover:text-violet-900"
    >
      <Sparkles className="h-3 w-3" />
      AI explain
    </button>
  )
}
