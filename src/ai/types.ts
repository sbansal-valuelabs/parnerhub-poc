export type AiMessageRole = 'user' | 'assistant'

export interface AiAction {
  id: string
  label: string
  href?: string
  variant?: 'primary' | 'outline'
}

export interface AiMessage {
  id: string
  role: AiMessageRole
  content: string
  actions?: AiAction[]
  createdAt: string
}

export interface AiInsight {
  id: string
  severity: 'info' | 'warning' | 'success'
  title: string
  description: string
  customerId?: string
  href?: string
  actionLabel?: string
}

export interface ProvisionSuggestion {
  customerId: string
  customerName: string
  productIds: string[]
  rationale: string
  estimatedMrr?: number
}

export interface AgentResponse {
  content: string
  actions?: AiAction[]
  suggestions?: ProvisionSuggestion[]
}
