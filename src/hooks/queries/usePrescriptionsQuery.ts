'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Prescription,
  PrescriptionFilters,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
  PrescriptionsPaginatedResponse,
  PrescriptionStatus
} from '@/types/prescription'

/**
 * Hook React Query para buscar prescrições com paginação
 */
export function usePrescriptions(filters?: PrescriptionFilters) {
  return useQuery({
    queryKey: ['prescriptions', filters],
    queryFn: async (): Promise<PrescriptionsPaginatedResponse> => {
      const params = new URLSearchParams()
      
      if (filters?.userId) params.append('userId', filters.userId)
      if (filters?.patientId) params.append('patientId', filters.patientId)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const response = await api.get(`/prescriptions?${params.toString()}`)
      return response.data
    },
    staleTime: 3 * 60 * 1000, // 3 minutos (dados dinâmicos)
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!filters?.userId, // Só executa se userId existir
  })
}

/**
 * Hook para buscar prescrições com scroll infinito
 */
export function usePrescriptionsInfinite(filters?: PrescriptionFilters) {
  return useInfiniteQuery({
    queryKey: ['prescriptions-infinite', filters],
    queryFn: async ({ pageParam }: { pageParam: number }): Promise<PrescriptionsPaginatedResponse> => {
      const params = new URLSearchParams()
      
      if (filters?.userId) params.append('userId', filters.userId)
      if (filters?.patientId) params.append('patientId', filters.patientId)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      params.append('page', pageParam.toString())
      params.append('limit', (filters?.limit || 20).toString())
      
      const response = await api.get(`/prescriptions?${params.toString()}`)
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PrescriptionsPaginatedResponse) => {
      return lastPage.currentPage < lastPage.totalPages 
        ? lastPage.currentPage + 1 
        : undefined
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!filters?.userId,
  })
}

/**
 * Hook para buscar prescrição por ID
 */
export function usePrescription(id?: string) {
  return useQuery({
    queryKey: ['prescription', id],
    queryFn: async (): Promise<Prescription> => {
      const response = await api.get(`/prescriptions/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

/**
 * Hook para buscar prescrições de um paciente específico
 */
export function usePrescriptionsByPatient(patientId?: string) {
  return useQuery({
    queryKey: ['prescriptions', 'patient', patientId],
    queryFn: async (): Promise<Prescription[]> => {
      const response = await api.get(`/prescriptions/patient/${patientId}`)
      return response.data
    },
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Hook para criar prescrição
 */
export function useCreatePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreatePrescriptionInput): Promise<Prescription> => {
      const response = await api.post('/prescriptions', data)
      return response.data
    },
    onSuccess: (newPrescription) => {
      // Invalida todas as queries de prescrições
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      
      // Adiciona a nova prescrição ao cache se possível
      const filters = { userId: newPrescription.userId }
      queryClient.setQueryData(['prescriptions', filters], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: [newPrescription, ...oldData.data],
          total: oldData.total + 1
        }
      })
    },
  })
}

/**
 * Hook para atualizar prescrição
 */
export function useUpdatePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePrescriptionInput & { id: string }): Promise<Prescription> => {
      const response = await api.put(`/prescriptions/${id}`, data)
      return response.data
    },
    onSuccess: (updatedPrescription) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      queryClient.invalidateQueries({ queryKey: ['prescription', updatedPrescription.id] })
      
      // Atualiza o cache específico
      queryClient.setQueryData(['prescription', updatedPrescription.id], updatedPrescription)
    },
  })
}

/**
 * Hook para atualizar status da prescrição
 */
export function useUpdatePrescriptionStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: PrescriptionStatus }): Promise<Prescription> => {
      const response = await api.patch(`/prescriptions/${id}/status`, { status })
      return response.data
    },
    onSuccess: (updatedPrescription) => {
      // Invalida e atualiza caches
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      queryClient.setQueryData(['prescription', updatedPrescription.id], updatedPrescription)
    },
  })
}

/**
 * Hook para deletar prescrição
 */
export function useDeletePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/prescriptions/${id}`)
    },
    onSuccess: (_, deletedId) => {
      // Remove do cache
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      queryClient.removeQueries({ queryKey: ['prescription', deletedId] })
      
      // Atualiza listas em cache
      queryClient.setQueriesData({ queryKey: ['prescriptions'] }, (oldData: any) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: oldData.data.filter((p: Prescription) => p.id !== deletedId),
          total: oldData.total - 1
        }
      })
    },
  })
}