/**
 * Componente de autocomplete para busca de pacientes
 */

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface Patient {
  id: string
  name: string
  cpf: string
}

interface PatientAutocompleteProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  searchResults: Patient[]
  selectedPatient: Patient | null
  onSelectPatient: (patient: Patient) => void
  onClearSelection: () => void
  isSearching: boolean
  showDropdown: boolean
  onShowDropdownChange: (show: boolean) => void
}

export function PatientAutocomplete({
  searchTerm,
  onSearchTermChange,
  searchResults,
  selectedPatient,
  onSelectPatient,
  onClearSelection,
  isSearching,
  showDropdown,
  onShowDropdownChange
}: PatientAutocompleteProps) {
  
  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.patient-autocomplete')) {
        onShowDropdownChange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onShowDropdownChange])

  return (
    <div className="relative patient-autocomplete">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Paciente
      </label>
      <div className="relative">
        <Input
          type="text"
          placeholder="Digite o nome do paciente"
          value={searchTerm}
          onChange={(e) => {
            onSearchTermChange(e.target.value)
            if (!e.target.value) {
              onClearSelection()
            }
          }}
          onFocus={() => {
            if (searchResults.length > 0) {
              onShowDropdownChange(true)
            }
          }}
          className="w-full pr-10"
        />
        {selectedPatient && (
          <button
            onClick={onClearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
          >
            ✕
          </button>
        )}
        {isSearching && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              type="button"
            >
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-gray-500">{patient.cpf}</div>
            </button>
          ))}
        </div>
      )}

      {/* Indicador de paciente selecionado */}
      {selectedPatient && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
          <span className="text-green-700">Selecionado: {selectedPatient.name}</span>
        </div>
      )}
    </div>
  )
}
