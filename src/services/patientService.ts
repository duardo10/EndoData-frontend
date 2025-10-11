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
   * Busca um paciente específico por ID
   * @param id - ID do paciente
   * @returns Promise<Patient>
   */
  static async getPatientById(id: string): Promise<Patient> {
    const response = await api.get(`/patients/${id}`)
    return response.data
  }
}