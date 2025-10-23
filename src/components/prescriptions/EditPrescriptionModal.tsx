/**
 * Modal de Edição de Prescrição
 * 
 * Componente modal para editar o status de uma prescrição médica.
 * Permite alterar o status entre: Rascunho, Ativa, Suspensa e Concluída.
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PrescriptionStatus, PrescriptionStatusDisplayMap } from '@/types/prescription'

interface EditPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: any | null
  onSubmit: (data: any) => Promise<void>
}

export function EditPrescriptionModal({ isOpen, onClose, prescription, onSubmit }: EditPrescriptionModalProps) {
  const [status, setStatus] = useState<PrescriptionStatus>(PrescriptionStatus.DRAFT)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (prescription) {
      setStatus(prescription.status)
    }
  }, [prescription])

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, isSubmitting, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit({ status })
    } catch (error) {
      console.error('Erro ao atualizar prescrição:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !prescription) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Cabeçalho */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Editar Prescrição</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 hover:shadow-lg text-2xl font-bold disabled:cursor-not-allowed transition-shadow"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-6">
            {/* Informações do Paciente (somente leitura) */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Paciente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{prescription.patient?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium text-gray-900">{prescription.patient?.cpf || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Status (editável) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status da Prescrição <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PrescriptionStatus)}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value={PrescriptionStatus.DRAFT}>
                  {PrescriptionStatusDisplayMap[PrescriptionStatus.DRAFT]}
                </option>
                <option value={PrescriptionStatus.ACTIVE}>
                  {PrescriptionStatusDisplayMap[PrescriptionStatus.ACTIVE]}
                </option>
                <option value={PrescriptionStatus.SUSPENDED}>
                  {PrescriptionStatusDisplayMap[PrescriptionStatus.SUSPENDED]}
                </option>
                <option value={PrescriptionStatus.COMPLETED}>
                  {PrescriptionStatusDisplayMap[PrescriptionStatus.COMPLETED]}
                </option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Selecione o novo status para esta prescrição
              </p>
            </div>

            {/* Informações dos Medicamentos (somente leitura) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medicamentos Prescritos</h3>
              {prescription.medications && prescription.medications.length > 0 ? (
                <div className="space-y-2">
                  {prescription.medications.map((medication: any, index: number) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {medication.medicationName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {medication.dosage} - {medication.frequency} - {medication.duration}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum medicamento prescrito</p>
              )}
            </div>

            {/* Aviso */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Aviso Importante
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Apenas o status da prescrição pode ser alterado. Para modificar medicamentos ou outras informações, crie uma nova prescrição.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white hover:shadow-md transition-shadow disabled:bg-red-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
