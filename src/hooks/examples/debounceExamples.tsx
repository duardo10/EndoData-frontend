/**
 * Exemplos de uso de debouncing em diferentes cenários
 */

import { useState } from 'react'
import { useDebounce, useDebouncedValue } from '@/hooks/useDebounce'
import { usePrescriptions } from '@/hooks/queries/usePrescriptionsQuery'

/**
 * Exemplo 1: Busca de prescrições com debounce
 */
export function PrescriptionsSearchExample() {
  const [searchTerm, setSearchTerm] = useState('')
  const [userId] = useState('user-123')
  
  // Debounce automático do termo de busca
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  
  // Query só executa com termo debouncado
  const { data: prescriptions, isLoading } = usePrescriptions({
    userId,
    // Usar um filtro que existe no tipo PrescriptionFilters
    ...(debouncedSearchTerm && { patientId: debouncedSearchTerm })
  })

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar prescrições..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {isLoading && <p>Buscando...</p>}
      
      {prescriptions?.data.map(prescription => (
        <div key={prescription.id}>
          {prescription.patient?.name} - {prescription.medications.length} medicamentos
        </div>
      ))}
    </div>
  )
}

/**
 * Exemplo 2: Filtros com debounce usando função personalizada
 */
export function FiltersWithDebounceExample() {
  const [filters, setFilters] = useState({
    patientName: '',
    medicationName: '',
    status: ''
  })
  
  // Debounce para aplicar filtros
  const debouncedApplyFilters = useDebounce(
    (newFilters: typeof filters) => {
      console.log('Aplicando filtros:', newFilters)
      // Aqui você faria a requisição com os filtros
    },
    500, // 500ms de delay
    [] // sem dependências extras
  )

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    
    // Aplica filtros com debounce
    debouncedApplyFilters(newFilters)
  }

  return (
    <div className="space-y-4">
      <input
        placeholder="Nome do paciente"
        value={filters.patientName}
        onChange={(e) => handleFilterChange('patientName', e.target.value)}
      />
      
      <input
        placeholder="Nome do medicamento"
        value={filters.medicationName}
        onChange={(e) => handleFilterChange('medicationName', e.target.value)}
      />
      
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="">Todos os status</option>
        <option value="ACTIVE">Ativo</option>
        <option value="COMPLETED">Concluído</option>
      </select>
    </div>
  )
}

/**
 * Exemplo 3: Busca com validação antes do debounce
 */
export function ValidatedSearchExample() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Só aplica debounce se termo tem pelo menos 3 caracteres
  const shouldSearch = searchTerm.length >= 3
  const debouncedSearchTerm = useDebouncedValue(
    shouldSearch ? searchTerm : '', 
    300
  )
  
  // Query só executa se tiver termo válido
  const { data, isLoading, error } = usePrescriptions({
    userId: 'user-123',
    ...(debouncedSearchTerm && { patientId: debouncedSearchTerm })
  })

  return (
    <div>
      <input
        type="text"
        placeholder="Digite pelo menos 3 caracteres..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={searchTerm.length > 0 && searchTerm.length < 3 ? 'border-yellow-400' : ''}
      />
      
      {searchTerm.length > 0 && searchTerm.length < 3 && (
        <p className="text-yellow-600 text-sm">
          Digite pelo menos 3 caracteres para buscar
        </p>
      )}
      
      {isLoading && <p>Buscando...</p>}
      {error && <p className="text-red-600">Erro na busca</p>}
      
      {data?.data.length === 0 && debouncedSearchTerm && (
        <p>Nenhum resultado encontrado</p>
      )}
    </div>
  )
}