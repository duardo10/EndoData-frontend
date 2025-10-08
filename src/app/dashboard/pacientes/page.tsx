'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Pacientes
 * 
 * @description Página para gerenciar pacientes do sistema
 * 
 * @returns {React.ReactElement} Página de pacientes
 */
export default function Pacientes(): React.ReactElement {
  const features = [
    'Cadastro completo de pacientes',
    'Prontuário eletrônico integrado',
    'Histórico médico detalhado',
    'Agendamento de consultas',
    'Upload de exames e documentos',
    'Busca avançada e filtros',
    'Relatórios por paciente',
    'Integração com convênios'
  ]

  return (
    <UnderDevelopment
      title="Gestão de Pacientes"
      description="Sistema completo para cadastro, acompanhamento e gerenciamento de pacientes com prontuário eletrônico integrado."
      features={features}
      eta="Sprint 1 - Outubro 2025"
    />
  )
}