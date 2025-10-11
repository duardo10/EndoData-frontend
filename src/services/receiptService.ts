import api from '@/lib/api'
import { Receipt, ReceiptFilters, MonthlyReceiptReport, CreateReceiptInput, UpdateReceiptInput } from '@/types/receipt'

/**
 * Service para gerenciar operações com receitas (receipts)
 * Integra com o backend NestJS para todas as operações CRUD
 */
export class ReceiptService {
  
  /**
   * Cria uma nova receita
   * @param receiptData - Dados da nova receita
   * @returns Promise<Receipt>
   */
  static async createReceipt(receiptData: CreateReceiptInput): Promise<Receipt> {
    const response = await api.post('/receipts', receiptData)
    return response.data
  }

  /**
   * Busca todas as receitas com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise<{data: Receipt[], total: number, page: number, limit: number, totalPages: number}>
   */
  static async getReceipts(filters?: ReceiptFilters): Promise<{data: Receipt[], total: number, page: number, limit: number, totalPages: number}> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.patientId) params.append('patientId', filters.patientId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.period) params.append('period', filters.period)
    
    const response = await api.get(`/receipts?${params.toString()}`)
    return response.data
  }

  /**
   * Busca uma receita específica por ID
   * @param id - ID da receita
   * @returns Promise<Receipt>
   */
  static async getReceiptById(id: string): Promise<Receipt> {
    const response = await api.get(`/receipts/${id}`)
    return response.data
  }

  /**
   * Busca receitas de um paciente específico
   * @param patientId - ID do paciente
   * @returns Promise<Receipt[]>
   */
  static async getReceiptsByPatient(patientId: string): Promise<Receipt[]> {
    const response = await api.get(`/receipts/patient/${patientId}`)
    return response.data
  }

  /**
   * Atualiza uma receita existente
   * @param id - ID da receita
   * @param receiptData - Dados atualizados da receita
   * @returns Promise<Receipt>
   */
  static async updateReceipt(id: string, receiptData: UpdateReceiptInput): Promise<Receipt> {
    const response = await api.put(`/receipts/${id}`, receiptData)
    return response.data
  }

  /**
   * Remove uma receita
   * @param id - ID da receita a ser removida
   * @returns Promise<void>
   */
  static async deleteReceipt(id: string): Promise<void> {
    await api.delete(`/receipts/${id}`)
  }

  /**
   * Busca relatório mensal de receitas
   * @param year - Ano do relatório
   * @param month - Mês do relatório
   * @returns Promise<MonthlyReceiptReport>
   */
  static async getMonthlyReport(year: number, month: number): Promise<MonthlyReceiptReport> {
    const response = await api.get(`/receipts/reports/monthly?year=${year}&month=${month}`)
    return response.data
  }

  /**
   * Exporta receitas para CSV
   * @param filters - Filtros para exportação
   * @returns Promise<Blob>
   */
  static async exportToCSV(filters?: ReceiptFilters): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.patientId) params.append('patientId', filters.patientId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.period) params.append('period', filters.period)
    
    const response = await api.get(`/receipts/export/csv?${params.toString()}`, {
      responseType: 'blob'
    })
    return response.data
  }

  /**
   * Exporta receitas para PDF
   * @param filters - Filtros para exportação
   * @returns Promise<Blob>
   */
  static async exportToPDF(filters?: ReceiptFilters): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.patientId) params.append('patientId', filters.patientId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.period) params.append('period', filters.period)
    
    const response = await api.get(`/receipts/export/pdf?${params.toString()}`, {
      responseType: 'blob'
    })
    return response.data
  }
}