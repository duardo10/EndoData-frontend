/**
 * Serviço de Prescrições Médicas - EndoData Frontend
 *
 * @description Serviço para comunicação com a API de prescrições médicas, incluindo operações CRUD, filtros, paginação e integração com backend NestJS.
 * Oferece tratamento de erros, validação de dados e integração segura.
 *
 * @author EndoData Team
 * @since 1.0.0
 *
 * @example
 * const prescricoes = await PrescriptionService.getAllPrescriptions();
 *
 * @see https://docs.endodata.com/services/prescriptionService
 * @remarks
 * Ideal para telas de listagem, cadastro, edição e busca de prescrições médicas.
 */

import api from '@/lib/api'
import {
  Prescription,
  PrescriptionStatus,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
  PrescriptionFilters,
  PrescriptionsPaginatedResponse
} from '@/types/prescription'

/**
 * Serviço de Prescrições
 */
export class PrescriptionService {
  /**
   * Busca todas as prescrições (método simples)
   * @returns Promise<Prescription[]>
   */
  static async getAllPrescriptions(): Promise<Prescription[]> {
    const response = await api.get('/prescriptions')
    return response.data as Prescription[]
  }

  /**
   * Busca todas as prescrições
   * @param filters - Filtros opcionais para busca
   * @returns Promise<PrescriptionsPaginatedResponse>
   */
  static async getPrescriptions(filters?: PrescriptionFilters): Promise<PrescriptionsPaginatedResponse> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.patientId) params.append('patientId', filters.patientId)
    if (filters?.userId) params.append('userId', filters.userId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    
    const response = await api.get(`/prescriptions?${params.toString()}`)
    
    // O backend retorna um array direto, vamos adaptar para o formato esperado
    const prescriptions = response.data as Prescription[]
    
    return {
      data: prescriptions,
      total: prescriptions.length,
      totalPages: 1,
      currentPage: 1
    }
  }

  /**
   * Busca uma prescrição específica por ID
   * @param id - ID da prescrição
   * @returns Promise<Prescription>
   */
  static async getPrescriptionById(id: string): Promise<Prescription> {
    const response = await api.get(`/prescriptions/${id}`)
    return response.data
  }

  /**
   * Busca prescrições por paciente
   * @param patientId - ID do paciente
   * @returns Promise<Prescription[]>
   */
  static async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    const response = await api.get(`/prescriptions/patient/${patientId}`)
    return response.data
  }

  /**
   * Cria uma nova prescrição
   * @param prescription - Dados da prescrição
   * @returns Promise<Prescription>
   */
  static async createPrescription(prescription: CreatePrescriptionInput): Promise<Prescription> {
    const response = await api.post('/prescriptions', prescription)
    return response.data
  }

  /**
   * Atualiza uma prescrição existente
   * @param id - ID da prescrição
   * @param prescription - Dados atualizados
   * @returns Promise<Prescription>
   */
  static async updatePrescription(id: string, prescription: UpdatePrescriptionInput): Promise<Prescription> {
    const response = await api.put(`/prescriptions/${id}`, prescription)
    return response.data
  }

  /**
   * Atualiza apenas o status de uma prescrição
   * @param id - ID da prescrição
   * @param status - Novo status
   * @returns Promise<Prescription>
   */
  static async updatePrescriptionStatus(id: string, status: PrescriptionStatus): Promise<Prescription> {
    const response = await api.patch(`/prescriptions/${id}/status`, { status })
    return response.data
  }

  /**
   * Remove uma prescrição
   * @param id - ID da prescrição
   * @returns Promise<void>
   */
  static async deletePrescription(id: string): Promise<void> {
    await api.delete(`/prescriptions/${id}`)
  }
}