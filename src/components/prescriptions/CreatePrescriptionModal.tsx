'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, Trash2 } from 'lucide-react'
import { Patient, PatientService } from '@/services/patientService'
import { CreatePrescriptionInput, PrescriptionStatus, CreatePrescriptionMedicationInput } from '@/types/prescription'
import { PrescriptionService } from '@/services/prescriptionService'
import { getCurrentUserId } from '@/lib/jwt-utils'

interface CreatePrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreatePrescriptionModal({ isOpen, onClose, onSuccess }: CreatePrescriptionModalProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
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
          {/* Seleção de Paciente */}
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente *</Label>
            <select 
              value={selectedPatientId} 
              onChange={(e) => setSelectedPatientId(e.target.value)}
              disabled={isLoadingPatients || isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {isLoadingPatients ? "Carregando pacientes..." : "Selecione um paciente"}
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.cpf}
                </option>
              ))}
            </select>
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

                  <div className="space-y-2">
                    <Label>Frequência *</Label>
                    <Input
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      placeholder="Ex: 8/8h"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duração</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      placeholder="Ex: 7 dias"
                      disabled={isLoading}
                    />
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
