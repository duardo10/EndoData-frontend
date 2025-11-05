/**
 * Hook customizado para busca e seleção de pacientes
 * Gerencia o estado de busca, resultados e seleção de pacientes
 * 
 * VERSÃO OTIMIZADA COM REACT QUERY + DEBOUNCING
 */

import { useState, useEffect, useCallback } from 'react'
import { usePatientsSearch } from '@/hooks/queries/usePatientsQuery'
import { useDebouncedValue } from '@/hooks/useDebounce'

interface Patient {
  id: string
  name: string
  cpf: string
  birthDate?: string
  gender?: string
  email?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

export function usePatientSearch() {
  const [patientSearchTerm, setPatientSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

  // Debounce automático do valor de busca (300ms de delay)
  const debouncedSearchTerm = useDebouncedValue(patientSearchTerm, 300)

  // Extrair userId do token
  function getUserId() {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return null
      
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.userId || payload.id || payload.sub
    } catch {
      return null
    }
  }

  const userId = getUserId()

  // Hook React Query usa o termo debouncado (com cache automático!)
  const {
    data: patientSearchResults = [],
    isLoading: isSearchingPatients,
    error
  } = usePatientsSearch(userId, debouncedSearchTerm)

  // Controla visibilidade do dropdown
  useEffect(() => {
    if (patientSearchTerm && !selectedPatient) {
      setShowPatientDropdown(true)
    } else if (!patientSearchTerm) {
      setShowPatientDropdown(false)
    }
  }, [patientSearchTerm, selectedPatient])

  /**
   * Funções de manipulação (mantidas para compatibilidade)
   */
  const handlePatientSearchChange = useCallback((value: string) => {
    setPatientSearchTerm(value)
    if (selectedPatient) {
      setSelectedPatient(null)
    }
  }, [selectedPatient])

  const handlePatientSelect = useCallback((patient: Patient) => {
    setSelectedPatient(patient)
    setPatientSearchTerm(patient.name)
    setShowPatientDropdown(false)
  }, [])

  const clearPatientSelection = useCallback(() => {
    setSelectedPatient(null)
    setPatientSearchTerm('')
    setShowPatientDropdown(false)
  }, [])

  return {
    // Estados
    patientSearchResults,
    patientSearchTerm,
    debouncedSearchTerm,
    selectedPatient,
    isSearchingPatients,
    showPatientDropdown,
    
    // Funções
    handlePatientSearchChange,
    handlePatientSelect,
    clearPatientSelection,
    setPatientSearchTerm,
    setSelectedPatient,
    setShowPatientDropdown,
    
    // Dados React Query
    error: error?.message,
    refetch: () => {} // Não necessário com React Query
  }
}
