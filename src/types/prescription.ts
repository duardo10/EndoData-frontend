/**
 * Tipos TypeScript para Prescrições Médicas - EndoData Frontend
 * 
 * @description Tipos baseados na API de prescriptions do backend,
 * adaptados para uso no frontend React/TypeScript.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

/**
 * Status possíveis de uma prescrição
 */
/**
 * Enum de Status de Prescrição
 */
export enum PrescriptionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active', 
  SUSPENDED = 'suspended',
  COMPLETED = 'completed'
}

/**
 * Mapeamento de status para exibição em português
 */
export const PrescriptionStatusDisplayMap = {
  [PrescriptionStatus.DRAFT]: 'Rascunho',
  [PrescriptionStatus.ACTIVE]: 'Ativa',
  [PrescriptionStatus.SUSPENDED]: 'Suspensa',
  [PrescriptionStatus.COMPLETED]: 'Concluída'
} as const

/**
 * Cores dos badges de status de prescrição
 */
export const PrescriptionStatusColorMap = {
  [PrescriptionStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [PrescriptionStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [PrescriptionStatus.SUSPENDED]: 'bg-yellow-100 text-yellow-800',
  [PrescriptionStatus.COMPLETED]: 'bg-blue-100 text-blue-800'
} as const

/**
 * Medicamento dentro de uma prescrição
 */
export interface PrescriptionMedication {
  id: string
  prescriptionId: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Input para criar um novo medicamento de prescrição
 */
export interface CreatePrescriptionMedicationInput {
  medicationName: string
  dosage: string
  frequency: string
  duration: string
}

/**
 * Prescrição médica completa
 */
export interface Prescription {
  id: string
  patientId: string
  userId: string
  status: PrescriptionStatus
  notes?: string
  createdAt: string
  medications: PrescriptionMedication[]
  patient?: {
    id: string
    name: string
    email: string
    cpf?: string
    birthDate?: string
    gender?: string
    phone?: string
  }
  user?: {
    id: string
    name: string
    email: string
    crm?: string
    especialidade?: string
  }
}

/**
 * Input para criar uma nova prescrição
 */
export interface CreatePrescriptionInput {
  patientId: string
  status: PrescriptionStatus
  notes?: string
  medications: CreatePrescriptionMedicationInput[]
}

/**
 * Input para atualizar uma prescrição
 */
export interface UpdatePrescriptionInput {
  status?: PrescriptionStatus
  notes?: string
  medications?: CreatePrescriptionMedicationInput[]
}

/**
 * Input para atualizar apenas o status de uma prescrição
 */
export interface UpdatePrescriptionStatusInput {
  status: PrescriptionStatus
}

/**
 * Filtros para busca de prescrições
 */
export interface PrescriptionFilters {
  status?: PrescriptionStatus
  patientId?: string
  userId?: string
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

/**
 * Resposta paginada da API de prescrições
 */
export interface PrescriptionsPaginatedResponse {
  data: Prescription[]
  total: number
  totalPages: number
  currentPage: number
}

/**
 * Estados de loading para operações CRUD
 */
export interface PrescriptionLoadingState {
  fetching: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
}

/**
 * Estados de erro para operações CRUD
 */
export interface PrescriptionErrorState {
  fetch?: string
  create?: string
  update?: string
  delete?: string
}

/**
 * Retorno do hook usePrescriptions
 */
export interface UsePrescriptionsReturn {
  prescriptions: Prescription[]
  loading: PrescriptionLoadingState
  error: PrescriptionErrorState
  
  // Operações CRUD
  createPrescription: (data: CreatePrescriptionInput) => Promise<Prescription>
  updatePrescription: (id: string, data: UpdatePrescriptionInput) => Promise<Prescription>
  updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => Promise<Prescription>
  deletePrescription: (id: string) => Promise<void>
  getPrescriptionById: (id: string) => Promise<Prescription>
  getPrescriptionsByPatient: (patientId: string) => Promise<Prescription[]>
  
  // Utilitários
  refreshPrescriptions: () => Promise<void>
  filters: PrescriptionFilters
  updateFilters: (newFilters: Partial<PrescriptionFilters>) => void
  
  // Paginação
  currentPage: number
  totalPages: number
  totalPrescriptions: number
}