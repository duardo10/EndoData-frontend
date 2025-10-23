/**
 * @fileoverview Página de criação de prescrições médicas.
 * 
 * Esta página permite aos médicos criar novas prescrições para pacientes,
 * incluindo busca de pacientes, seleção de medicamentos e configuração
 * de dosagens e instruções de uso.
 * 
 * @author EndoData Team
 * @since 1.0.0
 * 
 * Atualizações recentes:
 * - Adicionado campo para definir o Status da Prescrição (Rascunho, Ativa, Suspensa, Concluída).
 * - Adotado o mesmo modelo do modal: lista de medicamentos (nome, dosagem, frequência, duração).
 * - Frequência e Duração agora usam selects com opções fixas (padronização com o modal).
 * - Removido campo de "instruções" separado em favor da "duração" por medicamento.
 */

'use client'

// =====================================
// IMPORTS
// =====================================

// React hooks
import { useState, useEffect } from 'react'

// Componentes UI
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Services e utilitários
import { PrescriptionService } from '@/services/prescriptionService'
import { PatientService } from '@/services/patientService'
import { getCurrentUserId } from '@/lib/jwt-utils'

// Tipos e interfaces
import { CreatePrescriptionInput, PrescriptionStatus, PrescriptionStatusDisplayMap, CreatePrescriptionMedicationInput } from '@/types/prescription'
import { Patient } from '@/services/patientService'

// =====================================
// INTERFACES E TIPOS
// =====================================

/**
 * Interface para mensagens de feedback ao usuário
 */
interface Message {
  type: 'success' | 'error'
  text: string
}

/**
 * Componente principal da página de criação de prescrições.
 * 
 * Permite aos médicos autenticados criar prescrições médicas para pacientes,
 * incluindo funcionalidades de:
 * - Busca e seleção de pacientes por nome ou CPF
 * - Entrada de informações de medicamentos (nome, dosagem, frequência)
 * - Instruções especiais e observações
 * - Validação de dados e autenticação
 * - Submissão segura para o backend
 * 
 * @returns {JSX.Element} Interface de criação de prescrições
 */
export default function PrescricaoPage() {
  // =====================================
  // ESTADOS DO COMPONENTE
  // =====================================
  
  // Estado de inicialização
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Estados relacionados à busca e seleção de pacientes
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([])
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [isSearchingPatients, setIsSearchingPatients] = useState(false)
  
  // Estados dos campos de medicação e prescrição
  // Adota o mesmo modelo do modal: lista de medicamentos com nome, dosagem, frequência e duração
  const [medications, setMedications] = useState<CreatePrescriptionMedicationInput[]>([
    { medicationName: '', dosage: '', frequency: '', duration: '' }
  ])
  const [observations, setObservations] = useState('')
  const [prescriptionStatus, setPrescriptionStatus] = useState<PrescriptionStatus>(PrescriptionStatus.ACTIVE)
  
  // Estados de controle da interface
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // =====================================
  // FUNÇÕES AUXILIARES
  // =====================================

  /**
   * Verifica se o usuário tem autenticação válida
   */
  /**
   * Verifica se o usuário tem autenticação válida
   */
  const checkAuthentication = () => {
    const token = localStorage.getItem('auth_token') // Volta para 'auth_token'
    if (!token) {
      setMessage({type: 'error', text: 'Sessão expirada. Redirecionando para login...'})
      setTimeout(() => window.location.href = '/', 3000)
      return false
    }

    const userId = getCurrentUserId()
    if (!userId) {
      setMessage({type: 'error', text: 'Token inválido. Redirecionando para login...'})
      setTimeout(() => {
        localStorage.removeItem('jwt')
        window.location.href = '/'
      }, 3000)
      return false
    }

    return true
  }  /**
   * Inicialização do componente
   */
  useEffect(() => {
    try {
      if (!checkAuthentication()) {
        return
      }
      setAuthChecked(true)
      setIsInitialized(true)
    } catch (error) {
      console.error('Erro na inicialização:', error)
      setMessage({type: 'error', text: 'Erro ao carregar a página. Recarregue o navegador.'})
    }
  }, [])

  // Debounce para busca de pacientes
  useEffect(() => {
    if (patientSearch.length < 2) {
      setPatientSearchResults([])
      setShowPatientDropdown(false)
      return
    }

    const timeoutId = setTimeout(() => {
      handlePatientSearch(patientSearch)
    }, 300) // 300ms de debounce

    return () => clearTimeout(timeoutId)
  }, [patientSearch]) // Removido handlePatientSearch da dependência

  /**
   * Reseta todos os campos do formulário para seus valores iniciais.
   * 
   * Limpa os estados relacionados à seleção de paciente, campos de medicação,
   * resultados de busca e mensagens de feedback, retornando o formulário
   * ao estado inicial.
   * 
   * @returns {void}
   */
  const resetForm = () => {
    try {
      setSelectedPatient(null)
      setPatientSearch('')
      setPatientSearchResults([])
      setShowPatientDropdown(false)
      setMedications([{ medicationName: '', dosage: '', frequency: '', duration: '' }])
      setObservations('')
      setMessage(null)
    } catch (error) {
      console.error('Erro ao resetar formulário:', error)
    }
  }

  /** Adiciona um novo bloco de medicamento (igual ao modal de criação). */
  const addMedication = () => {
    setMedications((prev) => ([...prev, { medicationName: '', dosage: '', frequency: '', duration: '' }]))
  }

  /** Remove um medicamento pelo índice, mantendo ao menos um item. */
  const removeMedication = (index: number) => {
    setMedications((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  /** Atualiza um campo de um medicamento específico. */
  const updateMedication = (index: number, field: keyof CreatePrescriptionMedicationInput, value: string) => {
    setMedications((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  /**
   * Busca pacientes no backend baseado no texto de pesquisa.
   * 
   * Realiza busca por nome ou CPF do paciente, atualizando a lista de
   * resultados e controlando a exibição do dropdown de seleção.
   * Inclui debounce automático (mínimo 2 caracteres) e tratamento de erros.
   * 
   * @param {string} searchText - Texto de busca (nome ou CPF do paciente)
   * @returns {Promise<void>}
   */
  const handlePatientSearch = async (searchText: string) => {
    try {
      if (searchText.length < 2) {
        setPatientSearchResults([])
        setShowPatientDropdown(false)
        return
      }

      setIsSearchingPatients(true)
      
      const response = await PatientService.searchPatients(searchText)
      const patients = response?.patients || []
      
      setPatientSearchResults(patients)
      setShowPatientDropdown(patients.length > 0)
    } catch (error: any) {
      console.error('Erro ao buscar pacientes:', error)
      
      let errorMessage = 'Erro ao buscar pacientes. Verifique sua conexão.'
      
      if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Redirecionando para login...'
        setTimeout(() => {
          localStorage.removeItem('jwt') // Mudança para usar 'jwt'
          window.location.href = '/' // Página de login na raiz
        }, 2000)
      } else if (error.response?.status === 404) {
        errorMessage = 'Serviço de busca de pacientes não encontrado.'
      }
      
      setMessage({type: 'error', text: errorMessage})
      setPatientSearchResults([])
      setShowPatientDropdown(false)
    } finally {
      setIsSearchingPatients(false)
    }
  }

  /**
   * Seleciona um paciente da lista de resultados de busca.
   * 
   * Define o paciente selecionado, atualiza o campo de busca com o nome
   * do paciente e oculta o dropdown de resultados.
   * 
   * @param {Patient} patient - Objeto do paciente selecionado
   * @returns {void}
   */
  const handleSelectPatient = (patient: Patient) => {
    try {
      setSelectedPatient(patient)
      setPatientSearch(patient.name || '')
      setShowPatientDropdown(false)
      setPatientSearchResults([])
    } catch (error) {
      console.error('Erro ao selecionar paciente:', error)
      setMessage({type: 'error', text: 'Erro ao selecionar paciente. Tente novamente.'})
    }
  }

  /**
   * Manipula a submissão do formulário de prescrição.
   * 
   * Realiza validação completa dos dados do formulário, verifica autenticação
   * do usuário, constrói o objeto de prescrição e envia para o backend.
   * Inclui tratamento de erros específicos e feedback ao usuário.
   * 
   * Validações realizadas:
   * - Paciente selecionado
   * - Nome do medicamento preenchido
   * - Dosagem especificada
   * - Frequência selecionada
   * - Token de autenticação válido
   * - UserId extraído do token
   * 
   * @param {React.FormEvent} e - Evento de submissão do formulário
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      setMessage({type: 'error', text: 'Selecione um paciente'})
      return
    }

    // Validar medicamentos (mesma regra do modal)
    const validMedications = medications.filter(m => m.medicationName.trim() && m.dosage.trim() && m.frequency.trim())
    if (validMedications.length === 0) {
      setMessage({ type: 'error', text: 'Adicione pelo menos um medicamento válido (nome, dosagem e frequência são obrigatórios).' })
      return
    }

    try {
      setIsSubmitting(true)
      setMessage(null)

      // Verificar se há token e userId
      const token = localStorage.getItem('auth_token') // Volta para 'auth_token'
      const userId = getCurrentUserId()
      
      if (!token) {
        setMessage({type: 'error', text: 'Token de autenticação não encontrado. Faça login novamente.'})
        return
      }
      
      if (!userId) {
        setMessage({type: 'error', text: 'Usuário não autenticado. Faça login novamente.'})
        return
      }

      const prescriptionData: CreatePrescriptionInput = {
        patientId: selectedPatient.id,
        userId,
        status: prescriptionStatus,
        notes: observations.trim() || undefined,
        medications: validMedications
      }

      await PrescriptionService.createPrescription(prescriptionData)
      setMessage({type: 'success', text: 'Prescrição registrada com sucesso!'})
      
      // Resetar formulário após sucesso
      setTimeout(() => {
        resetForm()
      }, 2000)

    } catch (error: any) {
      console.error('Erro ao registrar prescrição:', error)
      
      let errorMessage = 'Erro ao registrar prescrição'
      
      if (error.response?.status === 401) {
        errorMessage = 'Não autorizado. Faça login novamente.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Dados inválidos. Verifique os campos preenchidos.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Paciente não encontrado. Verifique se o paciente existe.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      setMessage({
        type: 'error', 
        text: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // =====================================
  // RENDERIZAÇÃO DO COMPONENTE
  // =====================================
  
  // Loading inicial
  if (!isInitialized || !authChecked) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">
            {!authChecked ? 'Verificando autenticação...' : 'Carregando...'}
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Nova Prescrição</h1>
        </div>
        
        {/* Mensagens de feedback */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulário de prescrição */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Busca de paciente */}
            <div className="relative">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
                Paciente *
              </label>
              <input
                type="text"
                id="patient"
                value={patientSearch}
                onChange={(e) => {
                  try {
                    const value = e.target.value || ''
                    setPatientSearch(value)
                    // Remover chamada direta da função
                  } catch (error) {
                    console.error('Erro ao processar busca de paciente:', error)
                  }
                }}
                placeholder="Busque o paciente por CPF ou nome..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              {/* Loading de busca */}
              {isSearchingPatients && (
                <div className="absolute right-3 top-9 text-gray-400">
                  Buscando...
                </div>
              )}
              
              {/* Dropdown com resultados */}
              {showPatientDropdown && patientSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <ul className="max-h-60 overflow-auto">
                    {patientSearchResults.map((patient) => (
                      <li 
                        key={patient.id}
                        onClick={() => {
                          try {
                            handleSelectPatient(patient)
                          } catch (error) {
                            console.error('Erro ao clicar no paciente:', error)
                          }
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{patient.name || 'Nome não disponível'}</div>
                        <div className="text-sm text-gray-500">CPF: {patient.cpf || 'N/A'}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Paciente selecionado */}
              {selectedPatient && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-blue-900">{selectedPatient.name}</p>
                      <p className="text-sm text-blue-600">CPF: {selectedPatient.cpf}</p>
                      <p className="text-sm text-blue-600">Email: {selectedPatient.email}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        try {
                          setSelectedPatient(null)
                          setPatientSearch('')
                          setShowPatientDropdown(false)
                        } catch (error) {
                          console.error('Erro ao remover paciente:', error)
                        }
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Status da Prescrição */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status da Prescrição *
              </label>
              <select
                id="status"
                value={prescriptionStatus}
                onChange={(e) => {
                  try {
                    setPrescriptionStatus(e.target.value as PrescriptionStatus)
                  } catch (error) {
                    console.error('Erro ao atualizar status:', error)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value={PrescriptionStatus.DRAFT}>{PrescriptionStatusDisplayMap[PrescriptionStatus.DRAFT]}</option>
                <option value={PrescriptionStatus.ACTIVE}>{PrescriptionStatusDisplayMap[PrescriptionStatus.ACTIVE]}</option>
                <option value={PrescriptionStatus.SUSPENDED}>{PrescriptionStatusDisplayMap[PrescriptionStatus.SUSPENDED]}</option>
                <option value={PrescriptionStatus.COMPLETED}>{PrescriptionStatusDisplayMap[PrescriptionStatus.COMPLETED]}</option>
              </select>
            </div>

            {/* Medicamentos - mesmo modelo do modal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Medicamentos *</label>
                <Button type="button" variant="outline" size="sm" onClick={addMedication} disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Medicamento
                </Button>
              </div>

              {medications.map((med, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Medicamento {index + 1}</h4>
                    {medications.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(index)} disabled={isSubmitting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Medicamento *</label>
                      <input
                        value={med.medicationName}
                        onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                        placeholder="Ex: Paracetamol"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dosagem *</label>
                      <input
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="Ex: 500mg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequência *</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecione a frequência</option>
                        <option value="1x ao dia">1x ao dia</option>
                        <option value="2x ao dia">2x ao dia</option>
                        <option value="3x ao dia">3x ao dia</option>
                        <option value="4x ao dia">4x ao dia</option>
                        <option value="6x ao dia">6x ao dia</option>
                        <option value="8x ao dia">8x ao dia</option>
                        <option value="12x ao dia">12x ao dia</option>
                        <option value="A cada 4 horas">A cada 4 horas</option>
                        <option value="A cada 6 horas">A cada 6 horas</option>
                        <option value="A cada 8 horas">A cada 8 horas</option>
                        <option value="A cada 12 horas">A cada 12 horas</option>
                        <option value="Quando necessário">Quando necessário</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duração</label>
                      <select
                        value={med.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione a duração (opcional)</option>
                        <option value="2 dias">2 dias</option>
                        <option value="3 dias">3 dias</option>
                        <option value="5 dias">5 dias</option>
                        <option value="7 dias">7 dias</option>
                        <option value="10 dias">10 dias</option>
                        <option value="14 dias">14 dias</option>
                        <option value="30 dias">30 dias</option>
                        <option value="60 dias">60 dias</option>
                        <option value="90 dias">90 dias</option>
                        <option value="Enquanto necessário">Enquanto necessário</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="observations"
                value={observations}
                onChange={(e) => {
                  try {
                    setObservations(e.target.value || '')
                  } catch (error) {
                    console.error('Erro ao atualizar observações:', error)
                  }
                }}
                placeholder="Observações gerais sobre a prescrição"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Prescrição'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

// =====================================
// EXPORTAÇÃO PADRÃO
// =====================================
// Componente exportado como padrão para uso em roteamento do Next.js
