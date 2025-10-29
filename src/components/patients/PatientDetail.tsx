'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Pill, 
  FileText,
  Edit,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PatientService, Patient } from '@/services/patientService'

interface PatientDetailProps {
  patientId: string
}

interface CompletePatientData {
  patient: Patient
  calculations: any[]
  prescriptions: any[]
}

/**
 * Componente de Detalhes do Paciente
 * 
 * @description Exibe todos os dados de um paciente específico, incluindo
 * informações pessoais, dados médicos, histórico, prescrições e cálculos.
 * 
 * @param {string} patientId - ID do paciente
 * @returns {React.ReactElement} Componente de detalhes do paciente
 */
export function PatientDetail({ patientId }: PatientDetailProps): React.ReactElement {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [calculations, setCalculations] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Carregar dados do paciente
  useEffect(() => {
    const loadPatientData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Buscar dados completos do paciente
        const data = await PatientService.getPatientComplete(patientId)
        setPatient(data.patient)
        setCalculations(data.calculations || [])
        setPrescriptions(data.prescriptions || [])
      } catch (err: any) {
        console.error('Erro ao carregar paciente:', err)
        setError(err?.message || 'Erro ao carregar dados do paciente')
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      loadPatientData()
    }
  }, [patientId])

  // Função para formatar CPF
  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  // Função para formatar gênero
  const formatGender = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      'male': 'Masculino',
      'female': 'Feminino',
      'other': 'Outro'
    }
    return genderMap[gender] || gender
  }

  // Função para gerar avatar
  const generateAvatar = (name: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500'
    ]
    const colorIndex = name.length % colors.length
    
    return (
      <div className={`w-20 h-20 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-xl`}>
        {initials}
      </div>
    )
  }

  // Função para excluir paciente
  const handleDeletePatient = async () => {
    if (!patient) return
    
    setDeleting(true)
    try {
      await PatientService.deletePatient(patient.id)
      alert('Paciente excluído com sucesso!')
      // Redirecionar para a página de busca
      window.location.href = '/dashboard/pacientes/busca'
    } catch (err: any) {
      console.error('Erro ao excluir paciente:', err)
      alert(`Erro ao excluir paciente: ${err?.message || 'Erro desconhecido'}`)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin" size={48} />
        <span className="ml-4 text-lg">Carregando dados do paciente...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-red-600 mb-2">Erro</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button asChild>
          <Link href="/dashboard/pacientes/busca">Voltar para Busca</Link>
        </Button>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-20">
        <User className="mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Paciente não encontrado</h2>
        <p className="text-gray-500 mb-4">O paciente solicitado não foi encontrado.</p>
        <Button asChild>
          <Link href="/dashboard/pacientes/busca">Voltar para Busca</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/pacientes/busca">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do Paciente</h1>
            <p className="text-gray-600">Informações completas do paciente</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href={`/dashboard/pacientes/${patientId}/editar`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>

      {/* Informações Pessoais */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          {generateAvatar(patient.name)}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Informações Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">CPF</label>
                <p className="text-lg font-semibold text-gray-900">{formatCpf(patient.cpf)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                <p className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(patient.birthDate || '')}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Gênero</label>
                <p className="text-lg font-semibold text-gray-900">{formatGender(patient.gender || '')}</p>
              </div>
              
              {patient.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefone</label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {patient.phone}
                  </p>
                </div>
              )}
              
              {patient.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">E-mail</label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {patient.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Dados Médicos */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-600" />
          Dados Médicos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(patient as any).weight && (
            <div>
              <label className="text-sm font-medium text-gray-500">Peso</label>
              <p className="text-lg font-semibold text-gray-900">{(patient as any).weight} kg</p>
            </div>
          )}
          
          {(patient as any).height && (
            <div>
              <label className="text-sm font-medium text-gray-500">Altura</label>
              <p className="text-lg font-semibold text-gray-900">{(patient as any).height} cm</p>
            </div>
          )}
          
          {(patient as any).bloodType && (
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo Sanguíneo</label>
              <p className="text-lg font-semibold text-gray-900">{(patient as any).bloodType}</p>
            </div>
          )}
        </div>
        
        {(patient as any).medicalHistory && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">Histórico Médico</label>
            <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
              {(patient as any).medicalHistory}
            </p>
          </div>
        )}
        
        {(patient as any).allergies && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">Alergias</label>
            <p className="text-gray-900 mt-1 p-3 bg-red-50 rounded-lg border border-red-200">
              {(patient as any).allergies}
            </p>
          </div>
        )}
      </Card>

      {/* Medicamentos em Uso */}
      {(patient as any).medications && (patient as any).medications.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-purple-600" />
            Medicamentos em Uso ({(patient as any).medications.length})
          </h2>
          
          <div className="space-y-3">
            {(patient as any).medications.map((medication: any, index: number) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {medication.nome || medication.name || `Medicamento ${index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dosagem: {medication.dosagem || medication.dosage || 'Não especificada'}
                    </p>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">
                    Em uso
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cálculos Metabólicos */}
      {calculations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green-600" />
            Cálculos Metabólicos ({calculations.length})
          </h2>
          
          <div className="space-y-4">
            {calculations.map((calc, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Cálculo #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(calc.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {calc.type || 'Metabólico'}
                  </span>
                </div>
                {/* Adicionar mais detalhes do cálculo conforme necessário */}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Prescrições */}
      {prescriptions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-purple-600" />
            Prescrições ({prescriptions.length})
          </h2>
          
          <div className="space-y-4">
            {prescriptions.map((prescription, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Prescrição #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(prescription.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {prescription.medications?.length || 0} medicamentos
                  </span>
                </div>
                {/* Adicionar mais detalhes da prescrição conforme necessário */}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Informações do Sistema */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Cadastrado em</label>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(patient.createdAt || '')}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Última atualização</label>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(patient.updatedAt || '')}
            </p>
          </div>
        </div>
      </Card>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Exclusão
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o paciente <strong>{patient.name}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletePatient}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
