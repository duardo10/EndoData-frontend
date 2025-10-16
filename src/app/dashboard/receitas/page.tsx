/**
 * @fileoverview Página de gerenciamento de receitas médicas.
 * 
 * Esta página permite aos médicos visualizar, criar, filtrar e gerenciar
 * receitas médicas, incluindo funcionalidades de busca por paciente,
 * filtragem por status e período, além de ações em lote.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

'use client'

// =====================================
// IMPORTS
// =====================================

// React hooks
import React, { useState, useEffect } from 'react'

// Componentes de layout e UI
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Hooks customizados e componentes específicos
import { useReceitas } from '@/hooks/useReceitas'
import { CreateReceiptModal } from '@/components/receipts/CreateReceiptModal'

// =====================================
// INTERFACES E TIPOS
// =====================================

/**
 * Interface para filtros de receitas
 */
interface ReceitaFilters {
  /** Nome ou CPF do paciente */
  paciente: string
  /** Status da receita (Todos, Ativa, Renovada, Expirada) */
  status: string
  /** Período de busca */
  periodo: string
}

/**
 * Mapeamento de status da receita para exibição
 */
interface StatusMapping {
  [key: string]: {
    /** Label de exibição do status */
    label: string
    /** Classes CSS para estilização */
    className: string
  }
}

// =====================================
// COMPONENTE PRINCIPAL
// =====================================

/**
 * Componente principal da página de receitas médicas.
 * 
 * Fornece interface completa para gerenciamento de receitas, incluindo:
 * - Listagem de receitas com paginação
 * - Filtros por paciente, status e período
 * - Criação de novas receitas via modal
 * - Seleção múltipla para ações em lote
 * - Visualização de detalhes e status das receitas
 * - Integração com hooks customizados para gerenciamento de estado
 * 
 * @returns {JSX.Element} Interface de gerenciamento de receitas
 */
export default function ReceitasPage() {
  // =====================================
  // HOOKS E ESTADOS
  // =====================================
  
  // Hook customizado para gerenciamento de receitas
  const {
    receipts,
    loading,
    error,
    refreshReceipts,
    createReceipt,
    updateFilters
  } = useReceitas()

  // Estados de controle da interface
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([])
  
  // Estado dos filtros de busca
  const [filters, setFilters] = useState<ReceitaFilters>({
    paciente: '',
    status: 'Todos',
    periodo: ''
  })

  // Estados para busca de pacientes
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // =====================================
  // FUNÇÕES DE BUSCA DE PACIENTES
  // =====================================

  /**
   * Função para buscar pacientes por nome
   */
  const searchPatients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPatientSearchResults([]);
      return;
    }

    setIsSearchingPatients(true);
    try {
      const response = await fetch(`http://localhost:4000/api/patients/search?searchText=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatientSearchResults(data.patients || []);
      } else {
        console.error('Erro ao buscar pacientes:', response.status);
        setPatientSearchResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      setPatientSearchResults([]);
    } finally {
      setIsSearchingPatients(false);
    }
  };

  /**
   * Função para selecionar um paciente
   */
  const selectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(patient.name);
    setShowPatientDropdown(false);
    setFilters(prev => ({ ...prev, paciente: patient.name }));
  };

  /**
   * Função para limpar a seleção de paciente
   */
  const clearPatientSelection = () => {
    setSelectedPatient(null);
    setPatientSearchTerm('');
    setPatientSearchResults([]);
    setShowPatientDropdown(false);
    setFilters(prev => ({ ...prev, paciente: '' }));
  };

  // Debounce para busca de pacientes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSearchTerm && !selectedPatient) {
        searchPatients(patientSearchTerm);
        setShowPatientDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm, selectedPatient]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.patient-autocomplete')) {
        setShowPatientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===================================== 
  // FUNÇÕES DE MANIPULAÇÃO
  // =====================================

  /**
   * Manipula a criação de uma nova receita.
   * 
   * Chama o serviço de criação de receita e atualiza a lista
   * após sucesso. Propaga erros para tratamento pelo componente modal.
   * 
   * @param {any} receiptData - Dados da receita a ser criada
   * @returns {Promise<void>}
   * @throws {Error} Quando ocorre erro na criação da receita
   */
  const handleCreateReceipt = async (receiptData: any) => {
    try {
      await createReceipt(receiptData)
      await refreshReceipts()
    } catch (error) {
      console.error('Erro ao criar receita:', error)
      throw error
    }
  }

  /**
   * Gera um badge visual para o status da receita.
   * 
   * Converte o status interno da receita em um elemento visual
   * com cores e texto apropriados. Fornece fallback para status
   * não reconhecidos.
   * 
   * @param {string} status - Status da receita (pending, paid, cancelled)
   * @returns {JSX.Element} Badge estilizado com o status da receita
   */
  const getStatusBadge = (status: string) => {
    const statusMap: StatusMapping = {
      'pending': { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'paid': { label: 'Pago', className: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
    }
    
    const statusInfo = statusMap[status] || { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  /**
   * Alterna a seleção de uma receita na lista de seleções múltiplas.
   * 
   * Se a receita já estiver selecionada, remove da seleção.
   * Se não estiver selecionada, adiciona à lista de seleções.
   * Utilizada para ações em lote nas receitas.
   * 
   * @param {string} receiptId - ID único da receita
   * @returns {void}
   */
  const toggleReceiptSelection = (receiptId: string) => {
    setSelectedReceipts(prev => 
      prev.includes(receiptId)
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
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
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar receitas</h2>
            <p className="text-gray-600 mb-4">{error.fetch}</p>
            <Button onClick={refreshReceipts} className="bg-[#2074E9] hover:bg-[#104CA0]">
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
        {/* Título da página */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receitas Médicas Recentes</h1>
        </div>

        {/* Seção de Filtros */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filtrar Receitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Paciente com Autocomplete */}
            <div className="relative patient-autocomplete">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paciente
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Digite o nome do paciente"
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    if (!e.target.value) {
                      clearPatientSelection();
                    }
                  }}
                  onFocus={() => {
                    if (patientSearchResults.length > 0) {
                      setShowPatientDropdown(true);
                    }
                  }}
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
              
              {/* Dropdown de resultados */}
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
              
              {/* Indicador de paciente selecionado */}
              {selectedPatient && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <span className="text-green-700">✓ Selecionado: {selectedPatient.name}</span>
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
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
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
                console.log('🔍 Aplicando filtros:', filters)
                
                // Mapeamento de status da interface para valores do backend
                let statusValue: string | undefined = undefined
                if (filters.status === 'Pendente') statusValue = 'pending'
                else if (filters.status === 'Pago') statusValue = 'paid'
                else if (filters.status === 'Cancelado') statusValue = 'cancelled'
                
                // Formatação correta das datas para incluir o dia inteiro
                let startDate = filters.periodo
                let endDate = filters.periodo ? `${filters.periodo}T23:59:59.999Z` : undefined
                
                const filtersToApply = {
                  status: statusValue as any,
                  period: filters.periodo ? ('custom' as const) : undefined,
                  startDate: startDate,
                  endDate: endDate,
                  // Inclui patientId se um paciente foi selecionado
                  patientId: selectedPatient?.id || undefined,
                }
                
                console.log('📤 Enviando filtros para API:', filtersToApply)
                
                // Aplica filtros através do hook customizado
                updateFilters(filtersToApply)
              }}
            >
              Aplicar Filtros
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Limpa filtros locais e do hook
                setFilters({ paciente: '', status: 'Todos', periodo: '' })
                clearPatientSelection()
                updateFilters({})
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* Lista de Prescrições */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lista de Prescrições</h2>
          
          {loading.fetching && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando receitas...</p>
            </div>
          )}

          {/* Tabela de receitas */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReceipts(receipts.map(r => r.id))
                        } else {
                          setSelectedReceipts([])
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Título da Receita</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Paciente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Médico</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedReceipts.includes(receipt.id)}
                        onChange={() => toggleReceiptSelection(receipt.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {receipt.items && receipt.items.length > 0 
                          ? `Receita para ${receipt.items[0].description}` 
                          : 'Receita Médica'
                        }
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {receipt.patient?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {receipt.user?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(receipt.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(receipt.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-gray-600 hover:text-gray-900" title="Visualizar">
                          👁️
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Editar">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {receipts.length === 0 && !loading.fetching && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma receita encontrada</p>
              </div>
            )}
          </div>
        </Card>

        {/* Opções de Exportação */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Opções de Exportação</h2>
          <div className="flex gap-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={async () => {
                try {
                  alert('Funcionalidade de exportação PDF em desenvolvimento. Endpoint /api/receipts/export/pdf não implementado no backend.')
                  // await exportToPDF()
                } catch (error) {
                  console.error('Erro ao exportar PDF:', error)
                }
              }}
            >
              <span>📄</span>
              Exportar para PDF
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={async () => {
                try {
                  alert('Funcionalidade de exportação CSV em desenvolvimento. Endpoint /api/receipts/export/csv não implementado no backend.')
                  // await exportToCSV()
                } catch (error) {
                  console.error('Erro ao exportar CSV:', error)
                }
              }}
            >
              <span>📊</span>
              Exportar para DOCX
            </Button>
          </div>
        </Card>
      </div>
      
      <CreateReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReceipt}
      />
    </DashboardLayout>
  )
}

// =====================================
// EXPORTAÇÃO PADRÃO
// =====================================
// Componente exportado como padrão para uso em roteamento do Next.js
