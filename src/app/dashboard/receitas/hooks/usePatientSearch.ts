/**
 * Hook customizado para busca e seleção de pacientes
 * Gerencia o estado de busca, resultados e seleção de pacientes
 */

import { useState, useEffect } from 'react'

interface Patient {
  id: string
  name: string
  cpf: string
}

export function usePatientSearch() {
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([])
  const [patientSearchTerm, setPatientSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isSearchingPatients, setIsSearchingPatients] = useState(false)
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

  // Carrega todos os pacientes do usuário logado ao montar
  useEffect(() => {
    fetchUserPatients()
  }, [])

  // Debounce na busca de pacientes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSearchTerm && !selectedPatient) {
        searchPatients(patientSearchTerm)
        setShowPatientDropdown(true)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [patientSearchTerm, selectedPatient])

  /**
   * Busca todos os pacientes do usuário logado
   */
  async function fetchUserPatients() {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.userId || payload.id || payload.sub
      
      if (!userId) return

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://209.145.59.215:4000/api'}/patients/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const patients = Array.isArray(data) ? data : (data.patients || [])
        setPatientSearchResults(patients)
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    }
  }

  /**
   * Busca pacientes por nome
   */
  async function searchPatients(searchTerm: string) {
    if (!searchTerm.trim()) {
      setPatientSearchResults([])
      return
    }

    setIsSearchingPatients(true)

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setPatientSearchResults([])
        return
      }

      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.userId || payload.id || payload.sub
      
      if (!userId) {
        setPatientSearchResults([])
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://209.145.59.215:4000/api'}/patients/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const patients = Array.isArray(data) ? data : (data.patients || [])
        const filtered = patients.filter((patient: Patient) =>
          patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setPatientSearchResults(filtered)
      } else {
        setPatientSearchResults([])
      }
    } catch (error) {
      console.error('Erro na busca de pacientes:', error)
      setPatientSearchResults([])
    } finally {
      setIsSearchingPatients(false)
    }
  }

  /**
   * Seleciona um paciente do dropdown
   */
  function selectPatient(patient: Patient) {
    setSelectedPatient(patient)
    setPatientSearchTerm(patient.name)
    setShowPatientDropdown(false)
  }

  /**
   * Limpa a seleção de paciente
   */
  function clearPatientSelection() {
    setSelectedPatient(null)
    setPatientSearchTerm('')
    setShowPatientDropdown(false)
  }

  return {
    patientSearchResults,
    patientSearchTerm,
    selectedPatient,
    isSearchingPatients,
    showPatientDropdown,
    setPatientSearchTerm,
    setShowPatientDropdown,
    searchPatients,
    selectPatient,
    clearPatientSelection
  }
}
