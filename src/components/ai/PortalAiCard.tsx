import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { usePortalAuth } from '../../context/PortalAuthContext'
import { answerPortalQuestion } from '../../ai/portalAssistant'
import { Button } from '../ui/Button'

const STARTERS = ['How many licenses are available?', 'What is our monthly spend?']

export function PortalAiCard() {
  const { session } = usePortalAuth()
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)

  if (!session) return null

  const ask = (text: string) => {
    const q = text.trim()
    if (!q) return
    setInput('')
    const result = answerPortalQuestion(q, session.customerId)
    setAnswer(
      result ??
        "I can help with **license availability** and **monthly spend** in this demo. For other requests, use **Support** to contact your IT partner."
    )
  }

  return (
    <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 to-sky-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">License assistant</p>
          <p className="text-xs text-slate-500">Ask about seats and services (demo)</p>
        </div>
      </div>
      {answer && (
        <p className="mb-3 whitespace-pre-wrap rounded-lg bg-white/80 p-3 text-sm text-slate-700">{answer}</p>
      )}
      <div className="mb-2 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-800 hover:bg-emerald-50"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Do we have spare M365 licenses?"
          className="flex-1 rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
