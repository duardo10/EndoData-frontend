'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface Patient {
  id: string
  name: string
  cpf: string
  birthDate: string
  gender: string
  email: string
  phone: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Hook React Query para buscar pacientes do usuário logado
 */
export function usePatients(userId?: string) {
  return useQuery({
    queryKey: ['patients', userId],
    queryFn: async () => {
      if (!userId) return []
      
      const response = await api.get(`/patients/user/${userId}`)
      return Array.isArray(response.data) ? response.data : (response.data.patients || [])
    },
    enabled: !!userId, // Só executa se userId existir
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

/**
 * Hook para buscar pacientes com pesquisa
 */
export function usePatientsSearch(userId?: string, searchTerm?: string) {
  return useQuery({
    queryKey: ['patients', userId, 'search', searchTerm],
    queryFn: async () => {
      if (!userId) return []
      
      const response = await api.get(`/patients/user/${userId}`)
      const allPatients = Array.isArray(response.data) ? response.data : (response.data.patients || [])
      
      if (!searchTerm?.trim()) return allPatients
      
      // Filtro local para evitar múltiplas requisições
      return allPatients.filter((patient: Patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook para criar paciente
 */
export function useCreatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (patientData: Omit<Patient, 'id'>) => {
      const response = await api.post('/patients', patientData)
      return response.data
    },
    onSuccess: (newPatient) => {
      // Invalida e atualiza cache de pacientes
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      
      // Adiciona o novo paciente ao cache existente
      queryClient.setQueryData(['patients', newPatient.userId], (oldData: Patient[] = []) => [
        ...oldData,
        newPatient
      ])
    },
  })
}

/**
 * Hook para atualizar paciente
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...patientData }: Partial<Patient> & { id: string }) => {
      const response = await api.put(`/patients/${id}`, patientData)
      return response.data
    },
    onSuccess: (updatedPatient) => {
      // Atualiza o cache de pacientes
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      
      // Atualiza o paciente específico no cache
      queryClient.setQueryData(['patients', updatedPatient.userId], (oldData: Patient[] = []) =>
        oldData.map(patient => 
          patient.id === updatedPatient.id ? updatedPatient : patient
        )
      )
    },
  })
}

/**
 * Hook para deletar paciente
 */
export function useDeletePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (patientId: string) => {
      await api.delete(`/patients/${patientId}`)
      return patientId
    },
    onSuccess: (deletedPatientId) => {
      // Remove do cache
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      
      // Remove o paciente do cache existente
      queryClient.setQueriesData({ queryKey: ['patients'] }, (oldData: Patient[] = []) =>
        oldData.filter(patient => patient.id !== deletedPatientId)
      )
    },
  })
}