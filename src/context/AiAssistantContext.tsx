import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { runAgent } from '../ai/agent'
import type { AiMessage } from '../ai/types'

interface AiAssistantContextValue {
  isOpen: boolean
  isThinking: boolean
  messages: AiMessage[]
  open: () => void
  close: () => void
  toggle: () => void
  sendMessage: (text: string) => Promise<void>
  openWithPrompt: (text: string) => void
}

const AiAssistantContext = createContext<AiAssistantContextValue | null>(null)

const WELCOME: AiMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi — I'm **PartnerHub AI**. I can surface portfolio insights, suggest provisioning carts, and explain vendor agreements. What would you like to do?",
  createdAt: new Date().toISOString(),
  actions: [
    { id: 'prompt-health', label: 'What needs attention?', variant: 'outline' },
    { id: 'prompt-coastal', label: 'Provision Coastal Health', variant: 'outline' },
    { id: 'prompt-mca', label: 'Explain Microsoft MCA', variant: 'outline' },
  ],
}

const QUICK_PROMPTS: Record<string, string> = {
  'prompt-health': 'What needs attention in my portfolio?',
  'prompt-coastal': 'Provision Coastal Health with Microsoft 365 and Azure',
  'prompt-mca': 'Explain Microsoft MCA requirements',
}

function makeId() {
  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState<AiMessage[]>([WELCOME])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: AiMessage = {
      id: makeId(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsThinking(true)

    try {
      const response = await runAgent(trimmed)
      const assistantMsg: AiMessage = {
        id: makeId(),
        role: 'assistant',
        content: response.content,
        actions: response.actions,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setIsThinking(false)
    }
  }, [])

  const openWithPrompt = useCallback(
    (text: string) => {
      setIsOpen(true)
      void sendMessage(text)
    },
    [sendMessage]
  )

  return (
    <AiAssistantContext.Provider
      value={{
        isOpen,
        isThinking,
        messages,
        open,
        close,
        toggle,
        sendMessage,
        openWithPrompt,
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  )
}

export function useAiAssistant() {
  const ctx = useContext(AiAssistantContext)
  if (!ctx) throw new Error('useAiAssistant must be used within AiAssistantProvider')
  return ctx
}

export { QUICK_PROMPTS }
