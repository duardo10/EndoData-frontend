'use client'

/**
 * @fileoverview Modal de criação de prescrições.
 *
 * Atualizações recentes:
 * - Campo Paciente agora usa busca com autocomplete (nome/CPF) com debounce de 300ms.
 * - Frequência e Duração de cada medicamento agora são selects com opções fixas (padronização com a página de Prescrição).
 * - Reset do estado de busca ao fechar/salvar para evitar valores residuais.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, Trash2 } from 'lucide-react'
import { Patient, PatientService } from '@/services/patientService'
import { CreatePrescriptionInput, PrescriptionStatus, CreatePrescriptionMedicationInput } from '@/types/prescription'
import { PrescriptionService } from '@/services/prescriptionService'
import { getCurrentUserId } from '@/lib/jwt-utils'

/**
 * Propriedades do Modal de Criação de Prescrição
 */
interface CreatePrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Modal para criar uma nova prescrição.
 * - Permite buscar/selecionar paciente via autocomplete
 * - Adiciona um ou mais medicamentos
 * - Define status e observações
 */
export default function CreatePrescriptionModal({ isOpen, onClose, onSuccess }: CreatePrescriptionModalProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  // Estados de busca de paciente
  const [patientSearch, setPatientSearch] = useState('')
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([])
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [isSearchingPatients, setIsSearchingPatients] = useState(false)
  const [status, setStatus] = useState<PrescriptionStatus>(PrescriptionStatus.ACTIVE)
  const [notes, setNotes] = useState('')
  const [medications, setMedications] = useState<CreatePrescriptionMedicationInput[]>([
    {
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: ''
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)

  // Carregar lista de pacientes quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadPatients()
    }
  }, [isOpen])

  /**
   * Carrega a listagem básica de pacientes (fallback inicial)
   */
  const loadPatients = async () => {
    try {
      setIsLoadingPatients(true)
      const response = await PatientService.getPatients()
      setPatients(response.patients || [])
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    } finally {
      setIsLoadingPatients(false)
    }
  }

  /**
   * Busca de pacientes com debounce (300ms) via PatientService.searchPatients
   * - Ativa quando o modal está aberto e existem ao menos 2 caracteres
   * - Exibe dropdown com resultados e indicador de carregamento
   */
  useEffect(() => {
    if (!isOpen) return
    if (patientSearch.length < 2) {
      setPatientSearchResults([])
      setShowPatientDropdown(false)
      return
    }
    const timeoutId = setTimeout(async () => {
      try {
        setIsSearchingPatients(true)
        const response = await PatientService.searchPatients(patientSearch)
        const patients = response?.patients || []
        setPatientSearchResults(patients)
        setShowPatientDropdown(patients.length > 0)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
        setPatientSearchResults([])
        setShowPatientDropdown(false)
      } finally {
        setIsSearchingPatients(false)
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [patientSearch, isOpen])

  /**
   * Seleciona um paciente a partir dos resultados da busca.
   * @param patient Paciente selecionado
   */
  const handleSelectPatientFromSearch = (patient: Patient) => {
    setSelectedPatientId(patient.id)
    setPatientSearch(patient.name || '')
    setShowPatientDropdown(false)
    setPatientSearchResults([])
  }

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: ''
      }
    ])
  }

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      const newMedications = medications.filter((_, i) => i !== index)
      setMedications(newMedications)
    }
  }

  const updateMedication = (index: number, field: keyof CreatePrescriptionMedicationInput, value: string) => {
    const newMedications = [...medications]
    newMedications[index] = {
      ...newMedications[index],
      [field]: value
    }
    setMedications(newMedications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatientId) {
      alert('Por favor, selecione um paciente')
      return
    }

    // Validar medicamentos
    const validMedications = medications.filter(med => 
      med.medicationName.trim() && med.dosage.trim() && med.frequency.trim()
    )

    if (validMedications.length === 0) {
      alert('Por favor, adicione pelo menos um medicamento válido')
      return
    }

    try {
      setIsLoading(true)
      
      // Obter userId do token JWT
      const userId = getCurrentUserId()
      if (!userId) {
        alert('Erro: usuário não autenticado')
        return
      }

      const prescriptionData: CreatePrescriptionInput = {
        patientId: selectedPatientId,
        userId: userId,
        status,
        notes: notes.trim() || undefined,
        medications: validMedications
      }

      await PrescriptionService.createPrescription(prescriptionData)
      
      // Resetar formulário
      setSelectedPatientId('')
      setPatientSearch('')
      setPatientSearchResults([])
      setShowPatientDropdown(false)
      setStatus(PrescriptionStatus.ACTIVE)
      setNotes('')
      setMedications([{
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: ''
      }])
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao criar prescrição:', error)
      alert('Erro ao criar prescrição. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedPatientId('')
      setPatientSearch('')
      setPatientSearchResults([])
      setShowPatientDropdown(false)
      setStatus(PrescriptionStatus.ACTIVE)
      setNotes('')
      setMedications([{
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: ''
      }])
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Nova Prescrição</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Paciente (Busca com autocomplete) */}
          <div className="relative space-y-2">
            <Label htmlFor="patient">Paciente *</Label>
            <Input
              id="patient"
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Busque por nome ou CPF..."
              disabled={isLoading}
            />
            {isSearchingPatients && (
              <div className="absolute right-3 top-10 text-gray-400 text-sm">Buscando...</div>
            )}
            {showPatientDropdown && patientSearchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <ul>
                  {patientSearchResults.map((patient) => (
                    <li
                      key={patient.id}
                      onClick={() => handleSelectPatientFromSearch(patient)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium">{patient.name || 'Nome não disponível'}</div>
                      <div className="text-sm text-gray-500">CPF: {patient.cpf || 'N/A'}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedPatientId && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                <div className="text-sm text-blue-800">Paciente selecionado</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { setSelectedPatientId(''); setPatientSearch(''); setShowPatientDropdown(false); }}
                  disabled={isLoading}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as PrescriptionStatus)}
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={PrescriptionStatus.ACTIVE}>Ativa</option>
              <option value={PrescriptionStatus.SUSPENDED}>Suspensa</option>
              <option value={PrescriptionStatus.COMPLETED}>Concluída</option>
              <option value={PrescriptionStatus.DRAFT}>Rascunho</option>
            </select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais sobre a prescrição..."
              rows={3}
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Medicamentos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Medicamentos *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Medicamento
              </Button>
            </div>

            {medications.map((medication, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Medicamento {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Medicamento *</Label>
                    <Input
                      value={medication.medicationName}
                      onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                      placeholder="Ex: Paracetamol"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dosagem *</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      placeholder="Ex: 500mg"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Frequência com opções fixas (padronização) */}
                  <div className="space-y-2">
                    <Label>Frequência *</Label>
                    <select 
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      disabled={isLoading}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                  {/* Duração com opções fixas (opcional) */}
                  <div className="space-y-2">
                    <Label>Duração</Label>
                    <select 
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      disabled={isLoading}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedPatientId}>
              {isLoading ? 'Criando...' : 'Criar Prescrição'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
