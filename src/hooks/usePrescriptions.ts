/**
 * Hook personalizado para gerenciamento de Prescrições Médicas
 * 
 * @description Hook React customizado que encapsula toda a lógica
 * de estado e operações CRUD para prescrições médicas. Fornece uma
 * interface limpa e reutilizável para componentes React.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrescriptionService } from '@/services/prescriptionService'
import {
  Prescription,
  PrescriptionStatus,
  PrescriptionFilters,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
  PrescriptionLoadingState,
  PrescriptionErrorState,
  UsePrescriptionsReturn
} from '@/types/prescription'

/**
 * Hook para gerenciamento completo de prescrições médicas
 * 
 * @param initialFilters - Filtros iniciais para busca
 * @returns Objeto com estado e funções para gerenciar prescrições
 */
export function usePrescriptions(initialFilters?: PrescriptionFilters): UsePrescriptionsReturn {
  
  // Adicionar token de teste em desenvolvimento
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const existingToken = localStorage.getItem('auth_token')
      if (!existingToken) {
        // Token gerado via cURL para testes (atualizado)
        const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWIyZTg5My1mYzZhLTQ4YTItYjdkMi1hYTA4YjhjMWE4M2IiLCJlbWFpbCI6InRlc3RlMkB0ZXN0ZS5jb20iLCJuYW1lIjoiSm_Do28gVGVzdGUiLCJpc0FkbWluaXN0cmFkb3IiOmZhbHNlLCJpYXQiOjE3NjAyMDE3MTgsImV4cCI6MTc2MDI4ODExOH0.rasfG3rnUu24DVyFykHQl2-CF_DSDMWvNmtbFeDbPKg"
        localStorage.setItem('auth_token', testToken)
        console.log('🔐 Token de teste adicionado para desenvolvimento')
      }
    }
  }, [])
  
  // Adicionar token de teste em desenvolvimento
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const existingToken = localStorage.getItem('auth_token')
      if (!existingToken) {
        // Token gerado via cURL para testes (mesmo token das receitas)
        const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWIyZTg5My1mYzZhLTQ4YTItYjdkMi1hYTA4YjhjMWE4M2IiLCJlbWFpbCI6InRlc3RlMkB0ZXN0ZS5jb20iLCJuYW1lIjoiSm_Do28gVGVzdGUiLCJpc0FkbWluaXN0cmFkb3IiOmZhbHNlLCJpYXQiOjE3NjAyMDE3MTgsImV4cCI6MTc2MDI4ODExOH0.rasfG3rnUu24DVyFykHQl2-CF_DSDMWvNmtbFeDbPKg"
        localStorage.setItem('auth_token', testToken)
        console.log('🔐 Token de teste adicionado para desenvolvimento (prescrições)')
      }
    }
  }, [])
  
  // Estados principais
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPrescriptions, setTotalPrescriptions] = useState(0)
  const [filters, setFilters] = useState<PrescriptionFilters>(initialFilters || {})
  
  // Estados de loading
  const [loading, setLoading] = useState<PrescriptionLoadingState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false
  })
  
  // Estados de erro
  const [error, setError] = useState<PrescriptionErrorState>({})

  /**
   * Limpa todos os erros
   */
  const clearErrors = useCallback(() => {
    setError({})
  }, [])

  /**
   * Carrega prescrições da API
   */
  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, fetching: true }))
      clearErrors()
      
      const finalFilters = {
        ...filters,
        page: currentPage,
        limit: 10
      }
      
      const response = await PrescriptionService.getPrescriptions(finalFilters)
      
      setPrescriptions(response.data || [])
      setTotalPages(response.totalPages || 1)
      setTotalPrescriptions(response.total || 0)
      
    } catch (err: any) {
      console.error('Erro ao buscar prescrições:', err)
      setError(prev => ({ ...prev, fetch: err.response?.data?.message || 'Erro ao carregar prescrições' }))
      setPrescriptions([])
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }))
    }
  }, [filters, currentPage, clearErrors])

  /**
   * Recarrega prescrições
   */
  const refreshPrescriptions = useCallback(async () => {
    await fetchPrescriptions()
  }, [fetchPrescriptions])

  /**
   * Atualiza filtros e recarrega dados
   */
  const updateFilters = useCallback((newFilters: Partial<PrescriptionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset para primeira página
  }, [])

  /**
   * Busca prescrição por ID
   */
  const getPrescriptionById = useCallback(async (id: string): Promise<Prescription> => {
    try {
      clearErrors()
      const prescription = await PrescriptionService.getPrescriptionById(id)
      return prescription
    } catch (err: any) {
      console.error('Erro ao buscar prescrição:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao buscar prescrição'
      setError(prev => ({ ...prev, fetch: errorMessage }))
      throw new Error(errorMessage)
    }
  }, [clearErrors])

  /**
   * Cria nova prescrição
   */
  const createPrescription = useCallback(async (data: CreatePrescriptionInput): Promise<Prescription> => {
    try {
      setLoading(prev => ({ ...prev, creating: true }))
      clearErrors()
      
      const newPrescription = await PrescriptionService.createPrescription(data)
      
      // Adiciona à lista local
      setPrescriptions(prev => [newPrescription, ...prev])
      setTotalPrescriptions(prev => prev + 1)
      
      return newPrescription
    } catch (err: any) {
      console.error('Erro ao criar prescrição:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao criar prescrição'
      setError(prev => ({ ...prev, create: errorMessage }))
      throw new Error(errorMessage)
    } finally {
      setLoading(prev => ({ ...prev, creating: false }))
    }
  }, [clearErrors])

  /**
   * Atualiza prescrição existente
   */
  const updatePrescription = useCallback(async (id: string, data: UpdatePrescriptionInput): Promise<Prescription> => {
    try {
      setLoading(prev => ({ ...prev, updating: true }))
      clearErrors()
      
      const updatedPrescription = await PrescriptionService.updatePrescription(id, data)
      
      // Atualiza na lista local
      setPrescriptions(prev => 
        prev.map(prescription => 
          prescription.id === id ? updatedPrescription : prescription
        )
      )
      
      return updatedPrescription
    } catch (err: any) {
      console.error('Erro ao atualizar prescrição:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar prescrição'
      setError(prev => ({ ...prev, update: errorMessage }))
      throw new Error(errorMessage)
    } finally {
      setLoading(prev => ({ ...prev, updating: false }))
    }
  }, [clearErrors])

  /**
   * Atualiza apenas o status da prescrição
   */
  const updatePrescriptionStatus = useCallback(async (id: string, status: PrescriptionStatus): Promise<Prescription> => {
    try {
      setLoading(prev => ({ ...prev, updating: true }))
      clearErrors()
      
      const updatedPrescription = await PrescriptionService.updatePrescriptionStatus(id, status)
      
      // Atualiza na lista local
      setPrescriptions(prev => 
        prev.map(prescription => 
          prescription.id === id ? updatedPrescription : prescription
        )
      )
      
      return updatedPrescription
    } catch (err: any) {
      console.error('Erro ao atualizar status da prescrição:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar status da prescrição'
      setError(prev => ({ ...prev, update: errorMessage }))
      throw new Error(errorMessage)
    } finally {
      setLoading(prev => ({ ...prev, updating: false }))
    }
  }, [clearErrors])

  /**
   * Remove prescrição
   */
  const deletePrescription = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, deleting: true }))
      clearErrors()
      
      await PrescriptionService.deletePrescription(id)
      
      // Remove da lista local
      setPrescriptions(prev => prev.filter(prescription => prescription.id !== id))
      setTotalPrescriptions(prev => prev - 1)
      
    } catch (err: any) {
      console.error('Erro ao deletar prescrição:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao deletar prescrição'
      setError(prev => ({ ...prev, delete: errorMessage }))
      throw new Error(errorMessage)
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  }, [clearErrors])

  /**
   * Busca prescrições por paciente
   */
  const getPrescriptionsByPatient = useCallback(async (patientId: string): Promise<Prescription[]> => {
    try {
      clearErrors()
      return await PrescriptionService.getPrescriptionsByPatient(patientId)
    } catch (err: any) {
      console.error('Erro ao buscar prescrições do paciente:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao buscar prescrições do paciente'
      setError(prev => ({ ...prev, fetch: errorMessage }))
      throw new Error(errorMessage)
    }
  }, [clearErrors])

  // Carrega dados iniciais
  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  return {
    prescriptions,
    loading,
    error,
    currentPage,
    totalPages,
    totalPrescriptions,
    filters,
    updateFilters,
    refreshPrescriptions,
    createPrescription,
    updatePrescription,
    updatePrescriptionStatus,
    deletePrescription,
    getPrescriptionById,
    getPrescriptionsByPatient
  }
}