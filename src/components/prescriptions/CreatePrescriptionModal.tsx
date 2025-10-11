'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, X } from 'lucide-react'
import { 
  CreatePrescriptionInput, 
  CreatePrescriptionMedicationInput, 
  PrescriptionStatus,
  PrescriptionStatusDisplayMap 
} from '@/types/prescription'
import { PatientService, Patient } from '@/services/patientService'

interface CreatePrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (prescription: CreatePrescriptionInput) => Promise<void>
  loading?: boolean
}

export function CreatePrescriptionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CreatePrescriptionModalProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)
  
  const [formData, setFormData] = useState<CreatePrescriptionInput>({
    patientId: '',
    status: PrescriptionStatus.DRAFT,
    notes: '',
    medications: [{
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: ''
    }]
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Buscar pacientes
  useEffect(() => {
    if (isOpen) {
      fetchPatients()
    }
  }, [isOpen])

  const fetchPatients = async () => {
    try {
      setIsLoadingPatients(true)
      const response = await PatientService.getPatients()
      setPatients(response.patients)
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    } finally {
      setIsLoadingPatients(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Selecione um paciente'
    }

    if (formData.medications.length === 0) {
      newErrors.medications = 'Adicione pelo menos um medicamento'
    }

    formData.medications.forEach((medication, index) => {
      if (!medication.medicationName.trim()) {
        newErrors[`medication_${index}_name`] = 'Nome do medicamento é obrigatório'
      }
      if (!medication.dosage.trim()) {
        newErrors[`medication_${index}_dosage`] = 'Dosagem é obrigatória'
      }
      if (!medication.frequency.trim()) {
        newErrors[`medication_${index}_frequency`] = 'Frequência é obrigatória'
      }
      if (!medication.duration.trim()) {
        newErrors[`medication_${index}_duration`] = 'Duração é obrigatória'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Erro ao criar prescrição:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      patientId: '',
      status: PrescriptionStatus.DRAFT,
      notes: '',
      medications: [{
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: ''
      }]
    })
    setErrors({})
    onClose()
  }

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, {
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: ''
      }]
    }))
  }

  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }))
    }
  }

  const updateMedication = (index: number, field: keyof CreatePrescriptionMedicationInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Nova Prescrição</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Paciente */}
          <div>
            <Label htmlFor="patient">Paciente *</Label>
            <select
              id="patient"
              value={formData.patientId}
              onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingPatients}
            >
              <option value="">
                {isLoadingPatients ? 'Carregando pacientes...' : 'Selecione um paciente'}
              </option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.cpf || patient.email}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PrescriptionStatus }))}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(PrescriptionStatusDisplayMap).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Instruções gerais para o paciente..."
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Medicamentos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Medicamentos *</Label>
              <Button
                type="button"
                onClick={addMedication}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Medicamento
              </Button>
            </div>

            {formData.medications.map((medication, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Medicamento {index + 1}</h4>
                  {formData.medications.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMedication(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`medication-name-${index}`}>Nome do Medicamento *</Label>
                    <Input
                      id={`medication-name-${index}`}
                      value={medication.medicationName}
                      onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                      placeholder="Ex: Paracetamol"
                    />
                    {errors[`medication_${index}_name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`medication_${index}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`dosage-${index}`}>Dosagem *</Label>
                    <Input
                      id={`dosage-${index}`}
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      placeholder="Ex: 500mg"
                    />
                    {errors[`medication_${index}_dosage`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`medication_${index}_dosage`]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`frequency-${index}`}>Frequência *</Label>
                    <Input
                      id={`frequency-${index}`}
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      placeholder="Ex: 3x ao dia"
                    />
                    {errors[`medication_${index}_frequency`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`medication_${index}_frequency`]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`duration-${index}`}>Duração *</Label>
                    <Input
                      id={`duration-${index}`}
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      placeholder="Ex: 7 dias"
                    />
                    {errors[`medication_${index}_duration`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`medication_${index}_duration`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {errors.medications && (
              <p className="text-red-500 text-sm mt-1">{errors.medications}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Criando...' : 'Criar Prescrição'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}