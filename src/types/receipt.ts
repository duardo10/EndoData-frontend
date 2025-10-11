/**
 * Tipos TypeScript para Receitas Médicas - EndoData Frontend
 * 
 * @description Tipos baseados na API de receipts do backend,
 * adaptados para uso no frontend React/TypeScript.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

/**
 * Status possíveis de uma receita
 */
export enum ReceiptStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

/**
 * Mapeamento de status para exibição em português
 */
export const StatusDisplayMap = {
  [ReceiptStatus.PENDING]: 'Pendente',
  [ReceiptStatus.PAID]: 'Pago',
  [ReceiptStatus.CANCELLED]: 'Cancelado'
} as const

/**
 * Cores dos badges de status
 */
export const StatusColorMap = {
  [ReceiptStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ReceiptStatus.PAID]: 'bg-green-100 text-green-800',
  [ReceiptStatus.CANCELLED]: 'bg-red-100 text-red-800'
} as const

/**
 * Dados básicos de um paciente (para relacionamento)
 */
export interface PatientBasic {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  cpf?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Dados básicos de um usuário (para relacionamento)
 */
export interface UserBasic {
  id: string
  name: string
  email: string
  crm?: string
  specialty?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Item de uma receita médica
 */
export interface ReceiptItem {
  id: string
  receiptId: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Input para criar um novo item de receita
 */
export interface CreateReceiptItemInput {
  description: string
  quantity: number
  unitPrice: number
}

/**
 * Receita médica completa
 */
export interface Receipt {
  id: string
  patientId: string
  userId: string
  status: ReceiptStatus
  totalAmount: number
  date: string
  items: ReceiptItem[]
  patient: PatientBasic
  user?: UserBasic
  createdAt?: string
  updatedAt?: string
}

/**
 * Input para criar uma nova receita
 */
export interface CreateReceiptInput {
  patientId: string
  status?: ReceiptStatus
  items: CreateReceiptItemInput[]
}

/**
 * Input para atualizar uma receita existente
 */
export interface UpdateReceiptInput {
  status?: ReceiptStatus
  items?: CreateReceiptItemInput[]
}

/**
 * Filtros para busca de receitas
 */
export interface ReceiptFilters {
  period?: 'day' | 'week' | 'month' | 'year' | 'custom'
  startDate?: string // YYYY-MM-DD
  endDate?: string   // YYYY-MM-DD
  status?: ReceiptStatus
  patientId?: string
  page?: number
  limit?: number
}

/**
 * Resposta paginada da API de receitas
 */
export interface ReceiptsPaginatedResponse {
  data: Receipt[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Relatório mensal de receitas
 */
export interface MonthlyReceiptReport {
  month: number
  year: number
  totalRevenue: number
  totalReceipts: number
  pendingReceipts: number
  paidReceipts: number
  cancelledReceipts: number
  averageReceiptValue: number
}

/**
 * Parâmetros para gerar relatório mensal
 */
export interface MonthlyReportParams {
  month: number // 1-12
  year: number
}

/**
 * Relatório mensal de receitas
 */
export interface MonthlyReceiptReport {
  month: number
  year: number
  totalRevenue: number
  totalReceipts: number
  pendingReceipts: number
  paidReceipts: number
  cancelledReceipts: number
  averageReceiptValue: number
}

/**
 * Estado de loading para diferentes operações
 */
export interface ReceiptLoadingState {
  fetching: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
}

/**
 * Estado de erro para operações
 */
export interface ReceiptErrorState {
  fetch?: string
  create?: string
  update?: string
  delete?: string
}

/**
 * Hook state completo para receitas
 */
export interface ReceiptHookState {
  receipts: Receipt[]
  currentReceipt: Receipt | null
  filters: ReceiptFilters
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  loading: ReceiptLoadingState
  error: ReceiptErrorState
}