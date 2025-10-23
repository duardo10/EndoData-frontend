'use client'

import { X, FileText, Calendar, User, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Prescription, 
  PrescriptionStatusDisplayMap,
  PrescriptionStatusColorMap 
} from '@/types/prescription'

interface ViewPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: Prescription | null
  onExport?: (prescription: Prescription) => void
}

export function ViewPrescriptionModal({ 
  isOpen, 
  onClose, 
  prescription,
  onExport 
}: ViewPrescriptionModalProps) {
  if (!isOpen || !prescription) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes da Prescrição
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 hover:shadow-lg rounded-full transition-shadow"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Paciente
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nome:</span>
                    <p className="text-gray-900">{prescription.patient?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{prescription.patient?.email || 'Não informado'}</p>
                  </div>
                  {prescription.patient?.cpf && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">CPF:</span>
                      <p className="text-gray-900">{prescription.patient.cpf}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informações da Prescrição
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <div className="mt-1">
                      <Badge 
                        variant="secondary"
                        className={`${PrescriptionStatusColorMap[prescription.status]}`}
                      >
                        {PrescriptionStatusDisplayMap[prescription.status]}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Criada em:</span>
                    <p className="text-gray-900">{formatDate(prescription.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medicamentos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Medicamentos ({prescription.medications.length})
            </h3>
            
            {prescription.medications.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                Nenhum medicamento prescrito
              </div>
            ) : (
              <div className="space-y-4">
                {prescription.medications.map((medication, index) => (
                  <div key={medication.id || index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {medication.medicationName}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Dosagem:</span>
                            <span className="ml-2 text-gray-900">{medication.dosage}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Frequência:</span>
                          <span className="ml-2 text-gray-900">{medication.frequency}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Duração:</span>
                          <span className="ml-2 text-gray-900">{medication.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observações */}
          {prescription.notes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Observações</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{prescription.notes}</p>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white hover:shadow-md transition-shadow"
            >
              Fechar
            </Button>
            {onExport && (
              <Button
                type="button"
                onClick={() => onExport(prescription)}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}