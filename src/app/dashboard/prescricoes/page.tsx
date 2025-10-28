/**
 * @fileoverview Página de gerenciamento de prescrições médicas
 * 
 * Esta página implementa uma interface completa para gerenciamento de
 * prescrições médicas, incluindo funcionalidades avançadas de busca por
 * paciente com autocomplete em tempo real, filtragem por status, seleção
 * múltipla e ações em lote.
 * 
 * @features
 * - Listagem paginada de prescrições com scroll infinito otimizado
 * - Autocomplete inteligente de pacientes com debounce
 * - Sistema de seleção múltipla com barra de ações dinâmica
 * - Impressão profissional de prescrições
 * - Filtros por status (Ativa/Suspensa/Concluída/Rascunho)
 * - Interface responsiva e intuitiva com feedback visual
 * 
 * @author EndoData Team
 * @since 2.0.0
 * @updated 2025-10-23
 */

'use client'

// =====================================
// IMPORTS
// =====================================

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrescricoes } from '@/hooks/usePrescricoes'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import CreatePrescriptionModal from '@/components/prescriptions/CreatePrescriptionModal'
import { ViewPrescriptionModal } from '@/components/prescriptions/ViewPrescriptionModal'
import { EditPrescriptionModal } from '@/components/prescriptions/EditPrescriptionModal'
import { 
  PrescriptionStatus, 
  PrescriptionStatusDisplayMap, 
  PrescriptionStatusColorMap 
} from '@/types/prescription'

// =====================================
// INTERFACES E TIPOS
// =====================================

interface PrescriptionFilters {
  paciente: string
  status: string
  periodo: string
}

interface StatusMapping {
  [key: string]: {
    label: string
    className: string
  }
}

// =====================================
// COMPONENTE PRINCIPAL
// =====================================

export default function PrescricoesPage() {
  // ===================================== 
  // HOOKS E ESTADOS
  // =====================================
  
  const {
    prescriptions,
    loading,
    error,
    refreshPrescriptions,
    deletePrescription,
    updatePrescription,
    updateFilters,
    loadMorePrescriptions,
    hasMorePrescriptions,
    totalPrescriptions,
    currentPage,
    totalPages
  } = usePrescricoes()

  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([])
  const [filters, setFilters] = useState<PrescriptionFilters>({
    paciente: '',
    status: 'Todos',
    periodo: ''
  })

  // Estados para autocomplete de pacientes
  const [patientSearchTerm, setPatientSearchTerm] = useState('')
  const [patientSearchResults, setPatientSearchResults] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isSearchingPatients, setIsSearchingPatients] = useState(false)
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

  // Estados para modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)

  // Scroll infinito
  const tableContainerRef = useInfiniteScroll(loadMorePrescriptions, {
    loading: loading.fetching,
    hasMore: hasMorePrescriptions,
    threshold: 50,
    root: null
  })

  // =====================================
  // FUNÇÕES DE BUSCA DE PACIENTES
  // =====================================

  const searchPatients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPatientSearchResults([])
      return
    }

    setIsSearchingPatients(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/patients/search?searchText=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPatientSearchResults(data.patients || [])
        setShowPatientDropdown(true)
      } else {
        setPatientSearchResults([])
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      setPatientSearchResults([])
    } finally {
      setIsSearchingPatients(false)
    }
  }

  const selectPatient = (patient: any) => {
    setSelectedPatient(patient)
    setPatientSearchTerm(patient.name)
    setShowPatientDropdown(false)
    setFilters(prev => ({ ...prev, paciente: patient.name }))
    updateFilters({ patientId: patient.id })
  }

  const clearPatientSelection = () => {
    setSelectedPatient(null)
    setPatientSearchTerm('')
    setPatientSearchResults([])
    setShowPatientDropdown(false)
    setFilters(prev => ({ ...prev, paciente: '' }))
    updateFilters({ patientId: undefined })
  }

  // Debounce para busca de pacientes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSearchTerm && !selectedPatient) {
        searchPatients(patientSearchTerm)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [patientSearchTerm, selectedPatient])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.patient-autocomplete')) {
        setShowPatientDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // =====================================
  // FUNÇÕES DE MANIPULAÇÃO
  // =====================================

  const handleRemoveSelected = async () => {
    if (selectedPrescriptions.length === 0) {
      alert('Selecione pelo menos uma prescrição para remover.')
      return
    }

    const prescriptionWord = selectedPrescriptions.length === 1 ? 'prescrição' : 'prescrições'
    
    const confirmDelete = confirm(
      `⚠️ ATENÇÃO!\n\n` +
      `Você está prestes a remover ${selectedPrescriptions.length} ${prescriptionWord}.\n\n` +
      `Esta ação NÃO pode ser desfeita.\n\n` +
      `Deseja realmente continuar?`
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.')
        return
      }

      for (const prescriptionId of selectedPrescriptions) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/prescriptions/${prescriptionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }

      setSelectedPrescriptions([])
      await refreshPrescriptions()
      alert(`${selectedPrescriptions.length} ${prescriptionWord} removida(s) com sucesso!`)
      
    } catch (error) {
      console.error('Erro ao remover prescrições:', error)
      alert('Erro ao remover prescrições. Tente novamente.')
    }
  }

  const handlePrintSelectedPrescriptions = () => {
    const prescriptionsToPrint = prescriptions.filter(prescription => 
      selectedPrescriptions.includes(prescription.id)
    )
    
    if (prescriptionsToPrint.length === 0) {
      alert('Selecione pelo menos uma prescrição para imprimir.')
      return
    }

    const title = `${prescriptionsToPrint.length} Prescrições Selecionadas - Impressão`
    const printContent = generatePrintContent(prescriptionsToPrint, title)

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    } else {
      alert('Não foi possível abrir a janela de impressão.')
    }
  }

  const handlePrintAllPrescriptions = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('Token de autenticação não encontrado.')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/prescriptions?limit=1000&page=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Erro ao buscar prescrições')

      const data = await response.json()
      const allPrescriptions = data.data || data || []

      if (allPrescriptions.length === 0) {
        alert('Nenhuma prescrição encontrada para impressão.')
        return
      }

      const title = `${allPrescriptions.length} Prescrições - Impressão Completa`
      const printContent = generatePrintContent(allPrescriptions, title)

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }

    } catch (error) {
      console.error('Erro ao imprimir prescrições:', error)
      alert('Erro ao buscar prescrições para impressão.')
    }
  }

  const generatePrintContent = (prescriptionsData: any[], title: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            .prescription {
              margin-bottom: 40px;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .prescription-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .prescription-info { margin-bottom: 15px; }
            .prescription-info div { margin-bottom: 5px; }
            .medications-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .medications-table th,
            .medications-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .medications-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-active { background-color: #d1fae5; color: #065f46; }
            .status-suspended { background-color: #fef3c7; color: #92400e; }
            .status-completed { background-color: #dbeafe; color: #1e40af; }
            .status-draft { background-color: #f3f4f6; color: #374151; }
            @media print {
              body { margin: 0; }
              .prescription { page-break-after: always; }
              .prescription:last-child { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EndoData - ${title}</h1>
            <p>Data de Geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p>Total de Prescrições: ${prescriptionsData.length}</p>
          </div>
          
          ${prescriptionsData.map((prescription: any) => `
            <div class="prescription">
              <div class="prescription-header">
                <h3>Prescrição #${prescription.id.substring(0, 8)}</h3>
                <span class="status status-${prescription.status}">
                  ${PrescriptionStatusDisplayMap[prescription.status as PrescriptionStatus] || prescription.status}
                </span>
              </div>
              
              <div class="prescription-info">
                <div><strong>Paciente:</strong> ${prescription.patient?.name || 'N/A'}</div>
                <div><strong>CPF:</strong> ${prescription.patient?.cpf || 'N/A'}</div>
                <div><strong>Médico:</strong> ${prescription.user?.name || 'N/A'}</div>
                <div><strong>CRM:</strong> ${prescription.user?.crm || 'N/A'}</div>
                <div><strong>Data:</strong> ${new Date(prescription.createdAt).toLocaleDateString('pt-BR')}</div>
                ${prescription.notes ? `<div><strong>Observações:</strong> ${prescription.notes}</div>` : ''}
              </div>

              ${prescription.medications && prescription.medications.length > 0 ? `
                <table class="medications-table">
                  <thead>
                    <tr>
                      <th>Medicamento</th>
                      <th>Dosagem</th>
                      <th>Frequência</th>
                      <th>Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${prescription.medications.map((med: any) => `
                      <tr>
                        <td>${med.medicationName}</td>
                        <td>${med.dosage}</td>
                        <td>${med.frequency}</td>
                        <td>${med.duration}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p>Nenhum medicamento prescrito.</p>'}
            </div>
          `).join('')}
        </body>
      </html>
    `
  }

  const togglePrescriptionSelection = (prescriptionId: string) => {
    setSelectedPrescriptions(prev => 
      prev.includes(prescriptionId)
        ? prev.filter(id => id !== prescriptionId)
        : [...prev, prescriptionId]
    )
  }

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsViewModalOpen(true)
  }

  const handleEditPrescription = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsEditModalOpen(true)
  }

  const handleUpdatePrescription = async (prescriptionData: any) => {
    try {
      await updatePrescription(selectedPrescription.id, prescriptionData)
      setIsEditModalOpen(false)
      setSelectedPrescription(null)
      alert('Prescrição atualizada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao atualizar prescrição:', error)
      alert(error.message || 'Erro ao atualizar prescrição. Tente novamente.')
    }
  }

  const getStatusBadge = (status: PrescriptionStatus) => {
    const label = PrescriptionStatusDisplayMap[status] || status
    const className = PrescriptionStatusColorMap[status] || 'bg-gray-100 text-gray-800'
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}>
        {label}
      </span>
    )
  }

  // =====================================
  // TRATAMENTO DE ERRO
  // =====================================
  
  if (error && error.fetch) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar prescrições</h2>
            <p className="text-gray-600 mb-4">{error.fetch}</p>
            <Button onClick={refreshPrescriptions} className="bg-blue-600 hover:bg-blue-700">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // =====================================
  // RENDERIZAÇÃO PRINCIPAL
  // =====================================
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescrições Médicas</h1>
        </div>

        {/* Seção de Filtros */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca de Paciente com Autocomplete */}
            <div className="relative patient-autocomplete">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Paciente
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value)
                    if (!e.target.value) clearPatientSelection()
                  }}
                  placeholder="Digite o nome do paciente"
                  className="w-full pr-10"
                />
                {selectedPatient && (
                  <button
                    onClick={clearPatientSelection}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    ✕
                  </button>
                )}
                {isSearchingPatients && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Dropdown de Resultados */}
              {showPatientDropdown && patientSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {patientSearchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      type="button"
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.cpf}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Paciente Selecionado */}
              {selectedPatient && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <span className="text-green-700">Selecionado: {selectedPatient.name}</span>
                </div>
              )}
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Todos</option>
                <option value={PrescriptionStatus.ACTIVE}>Ativa</option>
                <option value={PrescriptionStatus.SUSPENDED}>Suspensa</option>
                <option value={PrescriptionStatus.COMPLETED}>Concluída</option>
                <option value={PrescriptionStatus.DRAFT}>Rascunho</option>
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
                onChange={(e) => setFilters(prev => ({ ...prev, periodo: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Botões de ação dos filtros */}
          <div className="flex gap-3 mt-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // Preparar status
                let statusValue = filters.status === 'Todos' ? undefined : filters.status as PrescriptionStatus
                
                // Preparar datas
                let startDate = filters.periodo
                let endDate = filters.periodo ? `${filters.periodo}T23:59:59.999Z` : undefined
                
                // Aplicar filtros
                updateFilters({ 
                  status: statusValue,
                  patientId: selectedPatient?.id || undefined,
                  startDate: startDate,
                  endDate: endDate
                })
              }}
            >
              Aplicar Filtros
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setFilters({ paciente: '', status: 'Todos', periodo: '' })
                clearPatientSelection()
                updateFilters({})
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* Barra de Ações para Prescrições Selecionadas */}
        {selectedPrescriptions.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 text-blue-700" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <div className="text-sm font-medium text-blue-900">
                    {selectedPrescriptions.length} prescrição{selectedPrescriptions.length > 1 ? 'ões' : ''} selecionada{selectedPrescriptions.length > 1 ? 's' : ''}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPrescriptions([])}
                  className="text-xs text-blue-700 hover:text-blue-800 underline"
                >
                  Limpar seleção
                </button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrintSelectedPrescriptions}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                    />
                  </svg>
                  Imprimir Selecionadas
                </Button>
                <Button
                  onClick={handleRemoveSelected}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  Remover Selecionadas
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Prescrições */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lista de Prescrições</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {prescriptions.length} de {totalPrescriptions} prescrições 
                {totalPages > 1 && (
                  <span className="ml-2">
                    (Página {currentPage} de {totalPages})
                  </span>
                )}
              </div>
              <Button
                onClick={handlePrintAllPrescriptions}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                  />
                </svg>
                Imprimir Todas
              </Button>
            </div>
          </div>
          
          {loading.fetching && prescriptions.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando prescrições...</p>
            </div>
          )}

          <div 
            ref={tableContainerRef as any}
            className="overflow-x-auto overflow-y-auto h-96"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedPrescriptions.length === prescriptions.length && prescriptions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPrescriptions(prescriptions.map(p => p.id))
                        } else {
                          setSelectedPrescriptions([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicamentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading.fetching && prescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Carregando prescrições...
                    </td>
                  </tr>
                ) : prescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Nenhuma prescrição encontrada
                    </td>
                  </tr>
                ) : (
                  prescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPrescriptions.includes(prescription.id)}
                          onChange={() => togglePrescriptionSelection(prescription.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {prescription.patient?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.patient?.cpf || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {prescription.medications?.length || 0} medicamento(s)
                        </div>
                        {prescription.medications && prescription.medications.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {prescription.medications[0].medicationName}
                            {prescription.medications.length > 1 && ` +${prescription.medications.length - 1}`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(prescription.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prescription.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {prescription.user?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          CRM: {prescription.user?.crm || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 font-medium" 
                            title="Visualizar"
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            Ver
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900 font-medium" 
                            title="Editar"
                            onClick={() => handleEditPrescription(prescription)}
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {loading.fetching && prescriptions.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                Carregando mais prescrições...
              </div>
            )}

            {!hasMorePrescriptions && prescriptions.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                Todas as prescrições foram carregadas
              </div>
            )}
          </div>
        </Card>

        {/* Ações rápidas - Gestão e Impressão */}
        {prescriptions.length >= 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              {/* Lado esquerdo - Botão de adicionar */}
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar
                </Button>
              </div>

              {/* Lado direito - Impressão */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    🖨️ Imprimir todas as prescrições do sistema
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ({totalPrescriptions} total)
                  </span>
                </div>
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={handlePrintAllPrescriptions}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir todas ({totalPrescriptions})
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modais */}
      <CreatePrescriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          refreshPrescriptions()
        }}
      />

      <ViewPrescriptionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedPrescription(null)
        }}
        prescription={selectedPrescription}
      />

      <EditPrescriptionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPrescription(null)
        }}
        prescription={selectedPrescription}
        onSubmit={handleUpdatePrescription}
      />
    </DashboardLayout>
  )
}