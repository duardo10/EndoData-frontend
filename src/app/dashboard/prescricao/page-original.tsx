'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrescriptions } from '@/hooks/usePrescriptions'
import CreatePrescriptionModal from '@/components/prescriptions/CreatePrescriptionModal'
import { ViewPrescriptionModal } from '@/components/prescriptions/ViewPrescriptionModal'
import { PrescriptionTable } from '@/components/prescriptions/PrescriptionTable'
import { Prescription, CreatePrescriptionInput, PrescriptionStatus } from '@/types/prescription'

export default function PrescricaoPage() {
  const {
    prescriptions,
    loading,
    error,
    createPrescription,
    updatePrescription,
    deletePrescription,
    refreshPrescriptions
  } = usePrescriptions()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    refreshPrescriptions()
  }, [refreshPrescriptions])

  const handleCreatePrescription = async (data: CreatePrescriptionInput) => {
    try {
      setCreating(true)
      await createPrescription(data)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Erro ao criar prescrição:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowViewModal(true)
  }

  const handleEditPrescription = (prescription: Prescription) => {
    // TODO: Implementar modal de edição
    console.log('Editando prescrição:', prescription.id)
  }

  const handleDeletePrescription = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta prescrição?')) {
      try {
        await deletePrescription(id)
      } catch (error) {
        console.error('Erro ao excluir prescrição:', error)
      }
    }
  }

  const handleExportPrescription = (prescription: Prescription) => {
    // TODO: Implementar exportação PDF
    console.log('Exportando prescrição:', prescription.id)
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Erro ao carregar prescrições</h3>
          <p className="text-red-600">{error.fetch || 'Erro desconhecido'}</p>
          <Button 
            onClick={() => refreshPrescriptions()} 
            className="mt-3"
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescrições</h1>
            <p className="text-gray-600 mt-1">
              Gerencie as prescrições médicas dos pacientes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={prescriptions.length === 0}
            >
              <Download className="w-4 h-4" />
              Exportar Lista
            </Button>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Prescrição
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter((p: Prescription) => p.status === PrescriptionStatus.ACTIVE).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rascunho</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter((p: Prescription) => p.status === PrescriptionStatus.DRAFT).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Finalizadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter((p: Prescription) => p.status === PrescriptionStatus.COMPLETED).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Prescrições */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Lista de Prescrições</h2>
        </div>
        <div className="p-6">
          <PrescriptionTable
            prescriptions={prescriptions}
            loading={loading.fetching}
            onView={handleViewPrescription}
            onEdit={handleEditPrescription}
            onDelete={handleDeletePrescription}
            onExport={handleExportPrescription}
          />
        </div>
      </div>

      {/* Modais */}
      <CreatePrescriptionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
          refreshPrescriptions()
        }}
      />

      <ViewPrescriptionModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        prescription={selectedPrescription}
        onExport={handleExportPrescription}
      />
    </div>
  )
}