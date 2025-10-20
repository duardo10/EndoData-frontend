/**
 * Hook personalizado para gerenciamento de Receitas Médicas
 * 
 * @description Hook React customizado que encapsula toda a lógica
 * de estado e operações CRUD para receitas médicas. Fornece uma
 * interface limpa e reutilizável para componentes React.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
// Update the path below if your receiptService file is in a different location
import { ReceiptService } from '../services/receiptService'
import {
  Receipt,
  ReceiptStatus,
  ReceiptFilters,
  MonthlyReceiptReport,
  CreateReceiptInput,
  UpdateReceiptInput,
  MonthlyReportParams
} from '@/types/receipt'

// Tipos auxiliares locais para o hook
interface ReceiptLoadingState {
  fetching: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  exporting: boolean
}

interface ReceiptErrorState {
  fetch?: string
  create?: string
  update?: string
  delete?: string
  export?: string
}

/**
 * Sistema de notificação simples
 */
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`)
  // TODO: Implementar notificação visual quando necessário
}

/**
 * Estado de retorno do hook useReceitas
 */
export interface UseReceiptsReturn {
  // Estado dos dados
  receipts: Receipt[]
  currentReceipt: Receipt | null
  totalReceipts: number
  
  // Paginação
  currentPage: number
  totalPages: number
  pageSize: number
  
  // Scroll infinito
  hasMoreReceipts: boolean
  loadMoreReceipts: () => Promise<void>
  
  // Filtros ativos
  filters: ReceiptFilters
  
  // Estados de loading
  loading: ReceiptLoadingState
  
  // Estados de erro
  error: ReceiptErrorState
  
  // Operações CRUD
  fetchReceipts: (newFilters?: ReceiptFilters, append?: boolean) => Promise<void>
  fetchReceiptById: (id: string) => Promise<void>
  createReceipt: (data: CreateReceiptInput) => Promise<Receipt | null>
  updateReceipt: (id: string, data: UpdateReceiptInput) => Promise<Receipt | null>
  deleteReceipt: (id: string) => Promise<boolean>
  
  // Filtros e paginação
  setFilters: (filters: Partial<ReceiptFilters>) => void
  updateFilters: (filters: Partial<ReceiptFilters>) => void
  clearFilters: () => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  
  // Relatórios
  generateMonthlyReport: (params: MonthlyReportParams) => Promise<MonthlyReceiptReport | null>
  
  // Exportação
  exportToPDF: () => Promise<void>
  exportToExcel: () => Promise<void>
  
  // Utilitários
  refreshData: () => Promise<void>
  refreshReceipts: () => Promise<void>
  clearErrors: () => void
  getReceiptsByPatient: (patientId: string) => Promise<Receipt[]>
}

/**
 * Hook personalizado para gerenciamento de receitas médicas
 * 
 * @param initialFilters Filtros iniciais (opcional)
 * @returns Objeto com estado e operações para receitas
 * 
 * @example
 * ```typescript
 * function ReceitasPage() {
 *   const {
 *     receipts,
 *     loading,
 *     fetchReceipts,
 *     updateReceipt,
 *     deleteReceipt
 *   } = useReceitas()
 * 
 *   useEffect(() => {
 *     fetchReceipts()
 *   }, [])
 * 
 *   return (
 *     <div>
 *       {loading.fetching ? (
 *         <div>Carregando...</div>
 *       ) : (
 *         <ReceiptList receipts={receipts} />
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useReceitas(initialFilters?: ReceiptFilters): UseReceiptsReturn {
  
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
  
  // Estado dos dados
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null)
  const [totalReceipts, setTotalReceipts] = useState(0)
  
  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Estado de filtros
  const [filters, setFiltersState] = useState<ReceiptFilters>(
    initialFilters || { page: 1, limit: 10 }
  )
  
  // Estados de loading
  const [loading, setLoading] = useState<ReceiptLoadingState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false,
    exporting: false
  })
  
  // Estados de erro
  const [error, setError] = useState<ReceiptErrorState>({})

  // Buscar receitas automaticamente na inicialização
  useEffect(() => {
    fetchReceipts()
  }, [])

  /**
   * Busca receitas com filtros e paginação
   */
  const fetchReceipts = useCallback(async (newFilters?: ReceiptFilters, append = false) => {
    setLoading(prev => ({ ...prev, fetching: true }))
    setError(prev => ({ ...prev, fetch: undefined }))
    
    try {
      const finalFilters = { ...filters, ...newFilters }
      const response = await ReceiptService.getReceipts(finalFilters)
      
      if (append) {
        // Modo scroll infinito: adiciona às receitas existentes
        setReceipts(prev => [...prev, ...response.data])
      } else {
        // Modo normal: substitui as receitas
        setReceipts(response.data)
      }
      
      setTotalReceipts(response.total)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
      
      if (newFilters) {
        setFiltersState(finalFilters)
      }
      
      console.log('✅ Receitas carregadas do backend:', response.data.length, 'receitas', append ? '(adicionadas)' : '(substituídas)')
      
    } catch (err: any) {
      // Se for erro 401 (não autorizado), usar dados mock para desenvolvimento
      if (err?.response?.status === 401) {
        console.log('API retornou 401, usando dados mock para desenvolvimento')
        
        // Dados mock para desenvolvimento
        const mockReceipts: Receipt[] = [
          {
            id: '1',
            patientId: 'patient-1',
            userId: 'user-1',
            status: ReceiptStatus.PENDING,
            totalAmount: 250.00,
            date: '2024-10-10T00:00:00.000Z',
            createdAt: '2024-10-10T00:00:00.000Z',
            updatedAt: '2024-10-10T00:00:00.000Z',
            items: [
              {
                id: 'item-1',
                receiptId: '1',
                description: 'Consulta médica',
                quantity: 1,
                unitPrice: 200.00,
                totalPrice: 200.00,
                createdAt: '2024-10-10T00:00:00.000Z',
                updatedAt: '2024-10-10T00:00:00.000Z'
              },
              {
                id: 'item-2',
                receiptId: '1',
                description: 'Exame laboratorial',
                quantity: 1,
                unitPrice: 50.00,
                totalPrice: 50.00,
                createdAt: '2024-10-10T00:00:00.000Z',
                updatedAt: '2024-10-10T00:00:00.000Z'
              }
            ],
            patient: {
              id: 'patient-1',
              name: 'João Silva',
              email: 'joao@email.com',
              phone: '(11) 99999-9999',
              birthDate: '1990-01-01',
              cpf: '123.456.789-00',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            },
            user: {
              id: 'user-1',
              name: 'Dr. Maria Santos',
              email: 'maria@endodata.com',
              crm: 'CRM/SP 123456',
              specialty: 'Endocrinologia',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          },
          {
            id: '2',
            patientId: 'patient-2',
            userId: 'user-2',
            status: ReceiptStatus.PAID,
            totalAmount: 180.00,
            date: '2024-10-09T00:00:00.000Z',
            createdAt: '2024-10-09T00:00:00.000Z',
            updatedAt: '2024-10-09T00:00:00.000Z',
            items: [
              {
                id: 'item-3',
                receiptId: '2',
                description: 'Consulta de retorno',
                quantity: 1,
                unitPrice: 150.00,
                totalPrice: 150.00,
                createdAt: '2024-10-09T00:00:00.000Z',
                updatedAt: '2024-10-09T00:00:00.000Z'
              },
              {
                id: 'item-4',
                receiptId: '2',
                description: 'Medicação',
                quantity: 1,
                unitPrice: 30.00,
                totalPrice: 30.00,
                createdAt: '2024-10-09T00:00:00.000Z',
                updatedAt: '2024-10-09T00:00:00.000Z'
              }
            ],
            patient: {
              id: 'patient-2',
              name: 'Ana Costa',
              email: 'ana@email.com',
              phone: '(11) 88888-8888',
              birthDate: '1985-05-15',
              cpf: '987.654.321-00',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            },
            user: {
              id: 'user-2',
              name: 'Dr. Pedro Oliveira',
              email: 'pedro@endodata.com',
              crm: 'CRM/SP 789012',
              specialty: 'Endocrinologia',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          },
          {
            id: '3',
            patientId: 'patient-3',
            userId: 'user-1',
            status: ReceiptStatus.CANCELLED,
            totalAmount: 300.00,
            date: '2024-10-08T00:00:00.000Z',
            createdAt: '2024-10-08T00:00:00.000Z',
            updatedAt: '2024-10-08T00:00:00.000Z',
            items: [
              {
                id: 'item-5',
                receiptId: '3',
                description: 'Consulta especializada',
                quantity: 1,
                unitPrice: 300.00,
                totalPrice: 300.00,
                createdAt: '2024-10-08T00:00:00.000Z',
                updatedAt: '2024-10-08T00:00:00.000Z'
              }
            ],
            patient: {
              id: 'patient-3',
              name: 'Carlos Pereira',
              email: 'carlos@email.com',
              phone: '(11) 77777-7777',
              birthDate: '1992-12-30',
              cpf: '456.789.123-00',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            },
            user: {
              id: 'user-1',
              name: 'Dr. Maria Santos',
              email: 'maria@endodata.com',
              crm: 'CRM/SP 123456',
              specialty: 'Endocrinologia',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          }
        ]
        
        setReceipts(mockReceipts)
        setTotalReceipts(mockReceipts.length)
        setCurrentPage(1)
        setTotalPages(1)
        
        if (newFilters) {
          setFiltersState({ ...filters, ...newFilters })
        }
        
        showNotification('Usando dados mock para desenvolvimento (API não autenticada)', 'error')
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar receitas'
        setError(prev => ({ ...prev, fetch: errorMessage }))
        showNotification('Erro ao carregar receitas: ' + errorMessage, 'error')
      }
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }))
    }
  }, [filters])

  /**
   * Carrega a próxima página de receitas (scroll infinito)
   */
  const loadMoreReceipts = useCallback(async () => {
    // Evita carregamento simultâneo ou se já está na última página
    if (loading.fetching || currentPage >= totalPages) {
      console.log('⏸️ Scroll infinito pausado:', { 
        fetching: loading.fetching, 
        currentPage, 
        totalPages,
        hasMore: currentPage < totalPages 
      })
      return
    }
    
    const nextPage = currentPage + 1
    console.log('🔄 Carregando próxima página:', nextPage, 'de', totalPages)
    
    const nextPageFilters = { ...filters, page: nextPage }
    await fetchReceipts(nextPageFilters, true) // append = true
  }, [loading.fetching, currentPage, totalPages, filters, fetchReceipts])

  /**
   * Verifica se há mais dados para carregar
   */
  const hasMoreReceipts = currentPage < totalPages && !loading.fetching

  /**
   * Busca uma receita específica por ID
   */
  const fetchReceiptById = useCallback(async (id: string) => {
    setLoading(prev => ({ ...prev, fetching: true }))
    
    try {
      const receipt = await ReceiptService.getReceiptById(id)
      setCurrentReceipt(receipt)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar receita'
      setError(prev => ({ ...prev, fetch: errorMessage }))
      showNotification('Erro ao carregar receita: ' + errorMessage, 'error')
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }))
    }
  }, [])

  /**
   * Cria uma nova receita
   */
  const createReceipt = useCallback(async (data: CreateReceiptInput): Promise<Receipt | null> => {
    setLoading(prev => ({ ...prev, creating: true }))
    setError(prev => ({ ...prev, create: undefined }))
    
    try {
      const newReceipt = await ReceiptService.createReceipt(data)
      
      // Adiciona à lista local
      setReceipts(prev => [newReceipt, ...prev])
      
      // Atualiza o total
      setTotalReceipts(prev => prev + 1)
      
      showNotification('Receita criada com sucesso!', "success")
      return newReceipt
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar receita'
      setError(prev => ({ ...prev, create: errorMessage }))
      showNotification('Erro ao criar receita: ' + errorMessage, 'error')
      return null
    } finally {
      setLoading(prev => ({ ...prev, creating: false }))
    }
  }, [])

  /**
   * Atualiza uma receita existente
   */
  const updateReceipt = useCallback(async (id: string, data: UpdateReceiptInput): Promise<Receipt | null> => {
    setLoading(prev => ({ ...prev, updating: true }))
    setError(prev => ({ ...prev, update: undefined }))
    
    try {
      const updatedReceipt = await ReceiptService.updateReceipt(id, data)
      
      // Atualiza a lista local
      setReceipts(prev => 
        prev.map(receipt => 
          receipt.id === id ? updatedReceipt : receipt
        )
      )
      
      // Atualiza receita atual se necessário
      if (currentReceipt?.id === id) {
        setCurrentReceipt(updatedReceipt)
      }
      
      showNotification('Receita atualizada com sucesso!', "success")
      return updatedReceipt
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar receita'
      setError(prev => ({ ...prev, update: errorMessage }))
      showNotification('Erro ao atualizar receita: ' + errorMessage, 'error')
      return null
    } finally {
      setLoading(prev => ({ ...prev, updating: false }))
    }
  }, [currentReceipt])

  /**
   * Remove uma receita
   */
  const deleteReceipt = useCallback(async (id: string): Promise<boolean> => {
    setLoading(prev => ({ ...prev, deleting: true }))
    setError(prev => ({ ...prev, delete: undefined }))
    
    try {
      await ReceiptService.deleteReceipt(id)
      
      // Remove da lista local
      setReceipts(prev => prev.filter(receipt => receipt.id !== id))
      setTotalReceipts(prev => prev - 1)
      
      // Limpa receita atual se necessário
      if (currentReceipt?.id === id) {
        setCurrentReceipt(null)
      }
      
      showNotification('Receita removida com sucesso!', "success")
      return true
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover receita'
      setError(prev => ({ ...prev, delete: errorMessage }))
      showNotification('Erro ao remover receita: ' + errorMessage, 'error')
      return false
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  }, [currentReceipt])

  /**
   * Gera relatório mensal
   */
  const generateMonthlyReport = useCallback(async (params: MonthlyReportParams): Promise<MonthlyReceiptReport | null> => {
    setLoading(prev => ({ ...prev, fetching: true }))
    
    try {
      const report = await ReceiptService.getMonthlyReport(params.year, params.month)
      showNotification('Relatório gerado com sucesso!', "success")
      return report
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório'
      showNotification('Erro ao gerar relatório: ' + errorMessage, 'error')
      return null
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }))
    }
  }, [])

  /**
   * Exporta receitas para PDF
   */
  const exportToPDF = useCallback(async () => {
    setLoading(prev => ({ ...prev, exporting: true }))
    try {
      const blob = await ReceiptService.exportToPDF(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receitas-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showNotification('Arquivo PDF baixado com sucesso!', "success")
    } catch (err) {
      showNotification('Erro ao exportar PDF', "error")
    } finally {
      setLoading(prev => ({ ...prev, exporting: false }))
    }
  }, [filters])

  /**
   * Exporta receitas para Excel/CSV
   */
  const exportToExcel = useCallback(async () => {
    setLoading(prev => ({ ...prev, exporting: true }))
    try {
      const blob = await ReceiptService.exportToCSV(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receitas-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showNotification('Arquivo CSV baixado com sucesso!', "success")
    } catch (err) {
      showNotification('Erro ao exportar CSV', "error")
    } finally {
      setLoading(prev => ({ ...prev, exporting: false }))
    }
  }, [filters])

  /**
   * Busca receitas de um paciente específico
   */
  const getReceiptsByPatient = useCallback(async (patientId: string): Promise<Receipt[]> => {
    try {
      return await ReceiptService.getReceiptsByPatient(patientId)
    } catch (err) {
      showNotification('Erro ao buscar receitas do paciente', "error")
      return []
    }
  }, [])

  // Funções auxiliares
  const setFilters = useCallback((newFilters: Partial<ReceiptFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFiltersState(updatedFilters)
    fetchReceipts(updatedFilters)
  }, [filters, fetchReceipts])

  const clearFilters = useCallback(() => {
    const clearedFilters = { page: 1, limit: pageSize }
    setFiltersState(clearedFilters)
    fetchReceipts(clearedFilters)
  }, [pageSize, fetchReceipts])

  const setPage = useCallback((page: number) => {
    const newFilters = { ...filters, page }
    setFiltersState(newFilters)
    fetchReceipts(newFilters)
  }, [filters, fetchReceipts])

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size)
    const newFilters = { ...filters, limit: size, page: 1 }
    setFiltersState(newFilters)
    fetchReceipts(newFilters)
  }, [filters, fetchReceipts])

  const refreshData = useCallback(() => {
    return fetchReceipts()
  }, [fetchReceipts])

  const clearErrors = useCallback(() => {
    setError({})
  }, [])

  return {
    // Estado dos dados
    receipts,
    currentReceipt,
    totalReceipts,
    
    // Paginação
    currentPage,
    totalPages,
    pageSize,
    
    // Scroll infinito
    hasMoreReceipts,
    loadMoreReceipts,
    
    // Filtros
    filters,
    
    // Loading e erro
    loading,
    error,
    
    // Operações CRUD
    fetchReceipts,
    fetchReceiptById,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    
    // Filtros e paginação
    setFilters,
    updateFilters: setFilters,
    clearFilters,
    setPage,
    setPageSize: setPageSizeHandler,
    
    // Relatórios e exportação
    generateMonthlyReport,
    exportToPDF,
    exportToExcel,
    
    // Utilitários
    refreshData,
    refreshReceipts: refreshData,
    clearErrors,
    getReceiptsByPatient
  }
}

export default useReceitas