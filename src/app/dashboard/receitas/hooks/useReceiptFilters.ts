/**
 * Hook customizado para gerenciar filtros de receitas
 */

import { useState } from 'react'

interface ReceitaFilters {
  paciente: string
  status: string
  periodo: string
}

export function useReceiptFilters(updateFiltersCallback: (filters: any) => void) {
  const [filters, setFilters] = useState<ReceitaFilters>({
    paciente: '',
    status: 'Todos',
    periodo: ''
  })

  /**
   * Atualiza um filtro específico
   */
  function updateFilter(key: keyof ReceitaFilters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  /**
   * Limpa todos os filtros
   */
  function clearFilters() {
    setFilters({
      paciente: '',
      status: 'Todos',
      periodo: ''
    })
    updateFiltersCallback({})
  }

  /**
   * Aplica os filtros atuais
   */
  function applyFilters(selectedPatientId?: string) {
    // Mapeamento de status da interface para valores do backend
    let statusValue: string | undefined = undefined
    if (filters.status === 'Pendente') statusValue = 'pending'
    else if (filters.status === 'Pago') statusValue = 'paid'
    else if (filters.status === 'Cancelado') statusValue = 'cancelled'

    // Formatação correta das datas
    let startDate = filters.periodo
    let endDate = filters.periodo ? `${filters.periodo}T23:59:59.999Z` : undefined

    const filtersToApply = {
      status: statusValue as any,
      period: filters.periodo ? ('custom' as const) : undefined,
      startDate: startDate,
      endDate: endDate,
      patientId: selectedPatientId || undefined,
    }

    console.log('📤 Aplicando filtros:', filtersToApply)
    updateFiltersCallback(filtersToApply)
  }

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    applyFilters
  }
}
