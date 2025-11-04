'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

// Tipos (baseados no que vi nos hooks existentes)
interface Receipt {
  id: string
  patientId: string
  userId: string
  medications: ReceiptMedication[]
  instructions?: string
  createdAt: string
  updatedAt?: string
  patient?: {
    id: string
    name: string
    cpf: string
  }
}

interface ReceiptMedication {
  id?: string
  receiptId?: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
}

interface ReceiptFilters {
  userId?: string
  patientId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

interface CreateReceiptInput {
  patientId: string
  medications: Omit<ReceiptMedication, 'id' | 'receiptId'>[]
  instructions?: string
}

interface UpdateReceiptInput {
  patientId?: string
  medications?: Omit<ReceiptMedication, 'id' | 'receiptId'>[]
  instructions?: string
}

interface ReceiptsPaginatedResponse {
  data: Receipt[]
  currentPage: number
  totalPages: number
  total: number
  hasMore: boolean
}

/**
 * Hook React Query para buscar receitas com filtros
 */
export function useReceipts(filters?: ReceiptFilters) {
  return useQuery({
    queryKey: ['receipts', filters],
    queryFn: async (): Promise<ReceiptsPaginatedResponse> => {
      const params = new URLSearchParams()
      
      if (filters?.userId) params.append('userId', filters.userId)
      if (filters?.patientId) params.append('patientId', filters.patientId)
      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const response = await api.get(`/receipts?${params.toString()}`)
      return response.data
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!filters?.userId,
  })
}

/**
 * Hook para buscar receita por ID
 */
export function useReceipt(id?: string) {
  return useQuery({
    queryKey: ['receipt', id],
    queryFn: async (): Promise<Receipt> => {
      const response = await api.get(`/receipts/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook para buscar receitas de um paciente específico
 */
export function useReceiptsByPatient(patientId?: string) {
  return useQuery({
    queryKey: ['receipts', 'patient', patientId],
    queryFn: async (): Promise<Receipt[]> => {
      const response = await api.get(`/receipts/patient/${patientId}`)
      return response.data
    },
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Hook para criar receita
 */
export function useCreateReceipt() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateReceiptInput): Promise<Receipt> => {
      const response = await api.post('/receipts', data)
      return response.data
    },
    onSuccess: (newReceipt) => {
      // Invalida todas as queries de receitas
      queryClient.invalidateQueries({ queryKey: ['receipts'] })
      
      // Adiciona a nova receita ao cache se possível
      const filters = { userId: newReceipt.userId }
      queryClient.setQueryData(['receipts', filters], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: [newReceipt, ...oldData.data],
          total: oldData.total + 1
        }
      })
    },
  })
}

/**
 * Hook para atualizar receita
 */
export function useUpdateReceipt() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateReceiptInput & { id: string }): Promise<Receipt> => {
      const response = await api.put(`/receipts/${id}`, data)
      return response.data
    },
    onSuccess: (updatedReceipt) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['receipts'] })
      queryClient.invalidateQueries({ queryKey: ['receipt', updatedReceipt.id] })
      
      // Atualiza o cache específico
      queryClient.setQueryData(['receipt', updatedReceipt.id], updatedReceipt)
    },
  })
}

/**
 * Hook para deletar receita
 */
export function useDeleteReceipt() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/receipts/${id}`)
    },
    onSuccess: (_, deletedId) => {
      // Remove do cache
      queryClient.invalidateQueries({ queryKey: ['receipts'] })
      queryClient.removeQueries({ queryKey: ['receipt', deletedId] })
      
      // Atualiza listas em cache
      queryClient.setQueriesData({ queryKey: ['receipts'] }, (oldData: any) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: oldData.data.filter((r: Receipt) => r.id !== deletedId),
          total: oldData.total - 1
        }
      })
    },
  })
}