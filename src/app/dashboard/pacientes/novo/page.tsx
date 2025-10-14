'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PatientDetailsForm } from '@/components/patients/PatientDetailsForm'

/**
 * Página de Novo Paciente
 * 
 * @description Página para cadastro de novos pacientes no sistema EndoData.
 * Contém formulário completo com informações pessoais, dados médicos,
 * medicamentos em uso e histórico do paciente.
 * 
 * @route /dashboard/pacientes/novo
 * 
 * @returns {React.ReactElement} Página de cadastro de novo paciente
 * 
 * @features
 * - Formulário completo de cadastro de paciente
 * - Validação de campos obrigatórios
 * - Gerenciamento de medicamentos em uso
 * - Histórico de consultas e notas médicas
 * - Layout responsivo seguindo design system
 * - Integração com sistema de navegação
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function NovoPaciente(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header da página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detalhes do Paciente
            </h1>
            <p className="text-gray-600">
              Cadastre um novo paciente ou edite informações existentes
            </p>
          </div>

          {/* Formulário principal */}
          <PatientDetailsForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

