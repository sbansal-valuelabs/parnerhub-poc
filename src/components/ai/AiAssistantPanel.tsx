import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Send, Sparkles, Loader2 } from 'lucide-react'
import { useAiAssistant } from '../../context/AiAssistantContext'
import { QUICK_PROMPTS } from '../../context/AiAssistantContext'
import { Button } from '../ui/Button'
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

export function AiAssistantPanel() {
  const { isOpen, close, messages, isThinking, sendMessage } = useAiAssistant()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return
    const text = input
    setInput('')
    void sendMessage(text)
  }

  const handleAction = (actionId: string, href?: string) => {
    const prompt = QUICK_PROMPTS[actionId]
    if (prompt) {
      void sendMessage(prompt)
      return
    }
    if (href) close()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px] lg:hidden" onClick={close} />
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-surface-border bg-white shadow-elevated transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <header className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-brand-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">PartnerHub AI</p>
              <p className="text-[10px] text-slate-500">Demo agent · human approval required</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[90%] rounded-xl px-3 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  )}
                >
                  <div className="whitespace-pre-wrap">{renderMarkdownLite(msg.content)}</div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.actions.map((action) =>
                        action.href ? (
                          <Link key={action.id} to={action.href} onClick={() => close()}>
                            <Button
                              size="sm"
                              variant={action.variant === 'primary' ? 'primary' : 'outline'}
                              className={msg.role === 'user' ? '' : ''}
                            >
                              {action.label}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            key={action.id}
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(action.id, action.href)}
                          >
                            {action.label}
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                Analysing portfolio…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-surface-border p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about customers, provisioning, agreements…"
              className="flex-1 rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              disabled={isThinking}
            />
            <Button type="submit" disabled={!input.trim() || isThinking} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </aside>
    </>
  )
}

export function AiAssistantFab() {
  const { toggle, isOpen } = useAiAssistant()

  if (isOpen) return null

  return (
    <button
      type="button"
      onClick={toggle}
      title="PartnerHub AI"
      aria-label="Open PartnerHub AI"
      className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-brand-600 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
    >
      <Sparkles className="h-5 w-5" />
    </button>
  )
}
