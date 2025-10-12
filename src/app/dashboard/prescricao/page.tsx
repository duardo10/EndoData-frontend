/**
 * @fileoverview Página de criação de prescrições médicas.
 * 
 * Esta página permite aos médicos criar novas prescrições para pacientes,
 * incluindo busca de pacientes, seleção de medicamentos e configuração
 * de dosagens e instruções de uso.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

'use client'

// =====================================
// IMPORTS
// =====================================

// React hooks
import { useState } from 'react'

// Componentes UI
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Services e utilitários
import { PrescriptionService } from '@/services/prescriptionService'
import { PatientService } from '@/services/patientService'
import { getCurrentUserId } from '@/lib/jwt-utils'

// Tipos e interfaces
import { CreatePrescriptionInput, PrescriptionStatus } from '@/types/prescription'
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
  
  // Estados relacionados à busca e seleção de pacientes
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([])
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [isSearchingPatients, setIsSearchingPatients] = useState(false)
  
  // Estados dos campos de medicação e prescrição
  const [medicationName, setMedicationName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [instructions, setInstructions] = useState('')
  const [observations, setObservations] = useState('')
  
  // Estados de controle da interface
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  // =====================================
  // FUNÇÕES AUXILIARES
  // =====================================

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
    setSelectedPatient(null)
    setPatientSearch('')
    setPatientSearchResults([])
    setShowPatientDropdown(false)
    setMedicationName('')
    setDosage('')
    setFrequency('')
    setInstructions('')
    setObservations('')
    setMessage(null)
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
    if (searchText.length < 2) {
      setPatientSearchResults([])
      setShowPatientDropdown(false)
      return
    }

    try {
      setIsSearchingPatients(true)
      
      const response = await PatientService.searchPatients(searchText)
      const patients = response.patients || []
      setPatientSearchResults(patients)
      setShowPatientDropdown(patients.length > 0)
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      setMessage({type: 'error', text: 'Erro ao buscar pacientes. Verifique sua conexão.'})
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
    setSelectedPatient(patient)
    setPatientSearch(patient.name)
    setShowPatientDropdown(false)
    setPatientSearchResults([])
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

    if (!medicationName.trim()) {
      setMessage({type: 'error', text: 'Informe o nome do medicamento'})
      return
    }

    if (!dosage.trim()) {
      setMessage({type: 'error', text: 'Informe a dosagem'})
      return
    }

    if (!frequency.trim()) {
      setMessage({type: 'error', text: 'Selecione a frequência'})
      return
    }

    try {
      setIsSubmitting(true)
      setMessage(null)

      // Verificar se há token e userId
      const token = localStorage.getItem('auth_token')
      
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
        status: PrescriptionStatus.ACTIVE,
        notes: observations.trim() || undefined,
        medications: [{
          medicationName: medicationName.trim(),
          dosage: dosage.trim(),
          frequency: frequency,
          duration: instructions.trim()
        }]
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
                  setPatientSearch(e.target.value)
                  handlePatientSearch(e.target.value)
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
                        onClick={() => handleSelectPatient(patient)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">CPF: {patient.cpf}</div>
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
                        setSelectedPatient(null)
                        setPatientSearch('')
                        setShowPatientDropdown(false)
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Medicamento */}
            <div>
              <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-2">
                Medicamento *
              </label>
              <input
                type="text"
                id="medication"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="Nome do medicamento"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Dosagem */}
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                Dosagem *
              </label>
              <input
                type="text"
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Ex: 500mg, 1 comprimido"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Frequência */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequência *
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
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

            {/* Instruções */}
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Instruções de uso
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Como usar o medicamento (duração, horários, etc.)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
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
