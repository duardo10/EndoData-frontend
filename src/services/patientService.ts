/**
 * Serviço de Pacientes - EndoData Frontend
 *
 * @description Serviço para comunicação com a API de pacientes, incluindo operações CRUD, busca, filtros e paginação.
 * Oferece integração completa com backend, tratamento de erros e validação de dados.
 *
 * @author EndoData Team
 * @since 1.0.0
 *
 * @example
 * const pacientes = await PatientService.getAllPatients();
 *
 * // Edge case: Se o backend retornar erro 404, o hook exibe lista vazia.
 * // Limitação: Não há suporte a busca por pacientes inativos.
 * // Sugestão de melhoria: Adicionar filtro para pacientes inativos e exportação em CSV.
 *
 * @see https://docs.endodata.com/services/patientService
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 * @remarks
 * Ideal para telas de listagem, cadastro, edição e busca de pacientes.
 *
 * @todo Adicionar suporte a busca por pacientes inativos e exportação de dados.
 */

import api from '@/lib/api'

/**
 * Interface básica de paciente
 */
export interface Patient {
  id: string
  name: string
  email: string
  cpf: string
  phone?: string
  birthDate?: string
  gender?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Resposta da API de pacientes
 */
export interface PatientsResponse {
  patients: Patient[]
  total: number
  page: number
  limit: number
}

/**
 * Serviço de Pacientes
 */
export class PatientService {
  /**
   * Busca todos os pacientes
   * @returns Promise<PatientsResponse>
   */
  static async getPatients(): Promise<PatientsResponse> {
    const response = await api.get('/patients')
    return response.data
  }

  /**
   * Busca pacientes por texto (nome ou CPF)
   * @param searchText - Texto para busca
   * @param limit - Limite de resultados (padrão: 10)
   * @returns Promise<PatientsResponse>
   */
  static async searchPatients(searchText: string, limit: number = 10): Promise<PatientsResponse> {
    const params = new URLSearchParams()
    
    if (searchText) {
      // Verificar se é um CPF (apenas dígitos)
      const cleanText = searchText.replace(/\D/g, '')
      if (cleanText.length >= 3 && /^\d+$/.test(cleanText)) {
        // Se parece com CPF (3+ dígitos), usar parâmetro cpf para busca parcial
        params.append('cpf', cleanText)
      } else {
        // Caso contrário, usar searchText para busca por nome
        params.append('searchText', searchText)
      }
    }
    
    params.append('limit', limit.toString())
    
    const response = await api.get(`/patients/search?${params.toString()}`)
    return response.data
  }

  /**
   * Busca um paciente específico por ID
   * @param id - ID do paciente
   * @returns Promise<Patient>
   */
  static async getPatientById(id: string): Promise<Patient> {
    const response = await api.get(`/patients/${id}`)
    return response.data
  }

  /**
   * Cria um novo paciente
   * @param data - Payload do paciente
   */
  static async createPatient(data: Partial<Patient>): Promise<Patient> {
    try {
      const response = await api.post('/patients', data)
      return response.data
    } catch (error: any) {
      console.error('Erro ao criar paciente:', error)
      throw new Error(error.response?.data?.message || error.message || 'Erro ao criar paciente')
    }
  }

  /**
   * Atualiza um paciente existente (atualização parcial).
   * Utiliza método HTTP PATCH para aplicar apenas os campos fornecidos.
   * @param id - ID do paciente
   * @param data - Campos a atualizar (parciais)
   * @returns Promise<Patient> - paciente atualizado
   * @throws Erro de rede ou validação propagado pelo Axios
   */
  static async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const response = await api.patch(`/patients/${id}`, data)
    return response.data
  }

  /**
   * Busca dados completos do paciente incluindo cálculos e prescrições.
   * @param id - ID do paciente
   * @returns Promise com dados completos do paciente
   */
  static async getPatientComplete(id: string): Promise<{
    patient: Patient;
    calculations: any[];
    prescriptions: any[];
  }> {
    const response = await api.get(`/patients/${id}/complete`)
    return response.data
  }

  /**
   * Exclui um paciente (soft delete).
   * @param id - ID do paciente
   * @returns Promise<void>
   */
  static async deletePatient(id: string): Promise<void> {
    await api.delete(`/patients/${id}`)
  }

  /**
   * Restaura um paciente excluído.
   * @param id - ID do paciente
   * @returns Promise<Patient>
   */
  static async restorePatient(id: string): Promise<Patient> {
    const response = await api.post(`/patients/${id}/restore`)
    return response.data
  }
}