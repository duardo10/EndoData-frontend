'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PatientDetail } from '@/components/patients/PatientDetail'

/**
 * Página de Detalhes do Paciente
 * 
 * @description Página para visualizar todos os dados de um paciente específico.
 * Exibe informações pessoais, dados médicos, histórico, prescrições e cálculos.
 * 
 * @route /dashboard/pacientes/[id]
 * 
 * @returns {React.ReactElement} Página de detalhes do paciente
 * 
 * @features
 * - Visualização completa dos dados do paciente
 * - Informações pessoais e médicas
 * - Histórico de consultas e prescrições
 * - Cálculos metabólicos
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

export default function PatientDetailPage({ params }: PageProps): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <PatientDetail patientId={params.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
