'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PatientDetailsForm } from '@/components/patients/PatientDetailsForm'

/**
 * Página de Edição do Paciente
 * 
 * @description Página para editar dados de um paciente existente.
 * Utiliza o mesmo formulário de cadastro, mas com dados pré-carregados.
 * 
 * @route /dashboard/pacientes/[id]/editar
 * 
 * @returns {React.ReactElement} Página de edição do paciente
 * 
 * @features
 * - Formulário de edição com dados pré-carregados
 * - Validação de campos obrigatórios
 * - Atualização de dados existentes
 * - Layout responsivo
 * - Navegação integrada
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
interface PageProps {
  params: {
    id: string
  }
}

export default function EditarPaciente({ params }: PageProps): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header da página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Paciente
            </h1>
            <p className="text-gray-600">
              Edite as informações do paciente
            </p>
          </div>

          {/* Formulário de edição */}
          <PatientDetailsForm patientId={params.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
