/**
 * @fileoverview Hook customizado para gerenciamento de prescrições médicas
 * 
 * Hook React para gerenciar estado, operações CRUD e interações com a API
 * de prescrições médicas. Fornece interface simplificada e consistente para
 * componentes consumidores.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

import { useState, useEffect, useCallback } from 'react'
import { PrescriptionService } from '@/services/prescriptionService'
import {
  Prescription,
  PrescriptionStatus,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
  PrescriptionFilters,
  PrescriptionLoadingState,
  PrescriptionErrorState
} from '@/types/prescription'

/**
 * Interface de retorno do hook
 */
interface UsePrescricoesReturn {
  prescriptions: Prescription[]
  loading: PrescriptionLoadingState
  error: PrescriptionErrorState
  refreshPrescriptions: () => Promise<void>
  createPrescription: (data: CreatePrescriptionInput) => Promise<Prescription>
  updatePrescription: (id: string, data: UpdatePrescriptionInput) => Promise<Prescription>
  deletePrescription: (id: string) => Promise<void>
  updateFilters: (newFilters: Partial<PrescriptionFilters>) => void
  loadMorePrescriptions: () => Promise<void>
  hasMorePrescriptions: boolean
  totalPrescriptions: number
  currentPage: number
  totalPages: number
}

/**
 * Hook para gerenciamento de prescrições
 */
export function usePrescricoes(): UsePrescricoesReturn {
  // Estados principais
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState<PrescriptionLoadingState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false
  })
  const [error, setError] = useState<PrescriptionErrorState>({})
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPrescriptions, setTotalPrescriptions] = useState(0)
  const [hasMorePrescriptions, setHasMorePrescriptions] = useState(true)
  
  // Filtros
  const [filters, setFilters] = useState<PrescriptionFilters>({
    page: 1,
    limit: 20
  })

  /**
   * Busca prescrições da API
   */
  const fetchPrescriptions = useCallback(async (append: boolean = false) => {
    setLoading(prev => ({ ...prev, fetching: true }))
    setError(prev => ({ ...prev, fetch: undefined }))
    
    try {
      const response = await PrescriptionService.getPrescriptions({
        ...filters,
        page: append ? currentPage + 1 : filters.page || 1
      })
      
      if (append) {
        setPrescriptions(prev => [...prev, ...response.data])
        setCurrentPage(prev => prev + 1)
      } else {
        setPrescriptions(response.data)
        setCurrentPage(response.currentPage)
      }
      
      setTotalPages(response.totalPages)
      setTotalPrescriptions(response.total)
      setHasMorePrescriptions(response.data.length === (filters.limit || 20))
      
    } catch (err: any) {
      console.error('Erro ao buscar prescrições:', err)
      setError(prev => ({
        ...prev,
        fetch: err.response?.data?.message || 'Erro ao carregar prescrições'
      }))
      
      // Fallback para dados mock em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        setPrescriptions([])
      }
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }))
    }
  }, [filters, currentPage])

  /**
   * Carrega mais prescrições (scroll infinito)
   */
  const loadMorePrescriptions = useCallback(async () => {
    if (!loading.fetching && hasMorePrescriptions) {
      await fetchPrescriptions(true)
    }
  }, [loading.fetching, hasMorePrescriptions, fetchPrescriptions])

  /**
   * Atualiza filtros
   */
  const updateFilters = useCallback((newFilters: Partial<PrescriptionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
    setCurrentPage(1)
    setPrescriptions([])
  }, [])

  /**
   * Recarrega prescrições
   */
  const refreshPrescriptions = useCallback(async () => {
    setCurrentPage(1)
    await fetchPrescriptions(false)
  }, [fetchPrescriptions])

  /**
   * Cria nova prescrição
   */
  const createPrescription = useCallback(async (data: CreatePrescriptionInput): Promise<Prescription> => {
    setLoading(prev => ({ ...prev, creating: true }))
    setError(prev => ({ ...prev, create: undefined }))
    
    try {
      const newPrescription = await PrescriptionService.createPrescription(data)
      await refreshPrescriptions()
      return newPrescription
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao criar prescrição'
      setError(prev => ({ ...prev, create: errorMsg }))
      throw new Error(errorMsg)
    } finally {
      setLoading(prev => ({ ...prev, creating: false }))
    }
  }, [refreshPrescriptions])

  /**
   * Atualiza prescrição existente
   */
  const updatePrescription = useCallback(async (
    id: string,
    data: UpdatePrescriptionInput
  ): Promise<Prescription> => {
    setLoading(prev => ({ ...prev, updating: true }))
    setError(prev => ({ ...prev, update: undefined }))
    
    try {
      const updatedPrescription = await PrescriptionService.updatePrescription(id, data)
      await refreshPrescriptions()
      return updatedPrescription
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar prescrição'
      setError(prev => ({ ...prev, update: errorMsg }))
      throw new Error(errorMsg)
    } finally {
      setLoading(prev => ({ ...prev, updating: false }))
    }
  }, [refreshPrescriptions])

  /**
   * Remove prescrição
   */
  const deletePrescription = useCallback(async (id: string): Promise<void> => {
    setLoading(prev => ({ ...prev, deleting: true }))
    setError(prev => ({ ...prev, delete: undefined }))
    
    try {
      await PrescriptionService.deletePrescription(id)
      await refreshPrescriptions()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao remover prescrição'
      setError(prev => ({ ...prev, delete: errorMsg }))
      throw new Error(errorMsg)
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  }, [refreshPrescriptions])

  // Carrega prescrições na montagem e quando filtros mudam
  useEffect(() => {
    fetchPrescriptions(false)
  }, [filters])

  return {
    prescriptions,
    loading,
    error,
    refreshPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription,
    updateFilters,
    loadMorePrescriptions,
    hasMorePrescriptions,
    totalPrescriptions,
    currentPage,
    totalPages
  }
}
