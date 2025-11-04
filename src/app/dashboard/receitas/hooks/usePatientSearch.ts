/**
 * Hook customizado para busca e seleção de pacientes
 * Gerencia o estado de busca, resultados e seleção de pacientes
 * 
 * VERSÃO OTIMIZADA COM REACT QUERY
 */

import { useState, useEffect } from 'react'
import { usePatientsSearch } from '@/hooks/queries/usePatientsQuery'

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

export function usePatientSearch() {
  const [patientSearchTerm, setPatientSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

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

  // Hook React Query para buscar pacientes (com cache automático!)
  const {
    data: patientSearchResults = [],
    isLoading: isSearchingPatients,
    error
  } = usePatientsSearch(userId, patientSearchTerm)

  // Controla visibilidade do dropdown
  useEffect(() => {
    if (patientSearchTerm && !selectedPatient) {
      setShowPatientDropdown(true)
    }
  }, [patientSearchTerm, selectedPatient])

  /**
   * Funções de manipulação (mantidas para compatibilidade)
   */
  const handlePatientSearchChange = (value: string) => {
    setPatientSearchTerm(value)
    if (selectedPatient) {
      setSelectedPatient(null)
    }
  }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setPatientSearchTerm(patient.name)
    setShowPatientDropdown(false)
  }

  const clearPatientSelection = () => {
    setSelectedPatient(null)
    setPatientSearchTerm('')
    setShowPatientDropdown(false)
  }

  return {
    // Estados
    patientSearchResults,
    patientSearchTerm,
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
