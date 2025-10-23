/**
 * Serviço de Pacientes - EndoData Frontend
 * 
 * @description Serviço para comunicação com a API de pacientes
 * @author EndoData Team
 * @since 1.0.0
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
    if (searchText) params.append('searchText', searchText)
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
}