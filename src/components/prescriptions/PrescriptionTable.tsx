'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { 
  Prescription, 
  PrescriptionStatus,
  PrescriptionStatusDisplayMap,
  PrescriptionStatusColorMap 
} from '@/types/prescription'

interface PrescriptionTableProps {
  prescriptions: Prescription[]
  loading?: boolean
  onEdit?: (prescription: Prescription) => void
  onDelete?: (id: string) => void
  onView?: (prescription: Prescription) => void
  onExport?: (prescription: Prescription) => void
}

export function PrescriptionTable({ 
  prescriptions, 
  loading = false,
  onEdit,
  onDelete,
  onView,
  onExport
}: PrescriptionTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'all'>('all')

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => 
                           med.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getMedicationSummary = (prescription: Prescription) => {
    if (prescription.medications.length === 0) return 'Nenhum medicamento'
    if (prescription.medications.length === 1) return prescription.medications[0].medicationName
    return `${prescription.medications[0].medicationName} (+${prescription.medications.length - 1} outros)`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full sm:w-48">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-b border-gray-200 p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por paciente ou medicamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PrescriptionStatus | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            {Object.entries(PrescriptionStatusDisplayMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Prescrições */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Nenhuma prescrição encontrada' 
              : 'Nenhuma prescrição cadastrada'
            }
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando uma nova prescrição'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {prescription.patient?.name || 'Paciente não informado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.patient?.email || 'Email não informado'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getMedicationSummary(prescription)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {prescription.medications.length} medicamento(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant="secondary"
                        className={`${PrescriptionStatusColorMap[prescription.status]}`}
                      >
                        {PrescriptionStatusDisplayMap[prescription.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(prescription.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(prescription)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {onExport && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onExport(prescription)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(prescription)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(prescription.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="border-b border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {prescription.patient?.name || 'Paciente não informado'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {prescription.patient?.email || 'Email não informado'}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`${PrescriptionStatusColorMap[prescription.status]}`}
                  >
                    {PrescriptionStatusDisplayMap[prescription.status]}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-900">
                    {getMedicationSummary(prescription)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {prescription.medications.length} medicamento(s) • {formatDate(prescription.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(prescription)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  {onExport && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onExport(prescription)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(prescription)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(prescription.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Resultados */}
      {filteredPrescriptions.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Mostrando {filteredPrescriptions.length} de {prescriptions.length} prescrições
        </div>
      )}
    </div>
  )
}