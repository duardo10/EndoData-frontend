/**
 * Componente principal de filtros de receitas
 */

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PatientAutocomplete } from './PatientAutocomplete'

interface Patient {
  id: string
  name: string
  cpf: string
}

interface ReceitaFilters {
  paciente: string
  status: string
  periodo: string
}

interface ReceiptFiltersProps {
  filters: ReceitaFilters
  onFiltersChange: (filters: ReceitaFilters) => void
  onApplyFilters: (selectedPatientId?: string) => void
  onClearFilters: () => void
  patientSearchResults: Patient[]
  patientSearchTerm: string
  onPatientSearchTermChange: (term: string) => void
  selectedPatient: Patient | null
  onPatientSelect: (patient: Patient) => void
  onPatientClear: () => void
  isSearchingPatients: boolean
  showPatientDropdown: boolean
  onShowPatientDropdownChange: (show: boolean) => void
}

export function ReceiptFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  patientSearchResults,
  patientSearchTerm,
  onPatientSearchTermChange,
  selectedPatient,
  onPatientSelect,
  onPatientClear,
  isSearchingPatients,
  showPatientDropdown,
  onShowPatientDropdownChange
}: ReceiptFiltersProps) {
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Filtrar Receitas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por Paciente com Autocomplete */}
        <PatientAutocomplete
          searchTerm={patientSearchTerm}
          onSearchTermChange={onPatientSearchTermChange}
          searchResults={patientSearchResults}
          selectedPatient={selectedPatient}
          onSelectPatient={onPatientSelect}
          onClearSelection={onPatientClear}
          isSearching={isSearchingPatients}
          showDropdown={showPatientDropdown}
          onShowDropdownChange={onShowPatientDropdownChange}
        />

        {/* Filtro por Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Filtro por Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <Input
            type="date"
            placeholder="Selecionar data"
            value={filters.periodo}
            onChange={(e) => onFiltersChange({ ...filters, periodo: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      {/* Botões de ação dos filtros */}
      <div className="flex gap-3 mt-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onApplyFilters(selectedPatient?.id)}
        >
          Aplicar Filtros
        </Button>
        <Button
          variant="outline"
          onClick={onClearFilters}
        >
          Limpar Filtros
        </Button>
      </div>
    </Card>
  )
}
