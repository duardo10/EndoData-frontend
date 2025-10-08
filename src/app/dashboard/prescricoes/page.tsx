'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Prescrições (Módulo Completo)
 * 
 * @description Módulo completo para gerenciamento de prescrições médicas
 * 
 * @returns {React.ReactElement} Página de prescrições
 */
export default function Prescricoes(): React.ReactElement {
  const features = [
    'Dashboard de prescrições ativas',
    'Histórico completo por paciente',
    'Busca avançada de prescrições',
    'Templates e protocolos médicos',
    'Controle de medicamentos controlados',
    'Alertas de renovação automática',
    'Estatísticas de prescrições',
    'Exportação de relatórios'
  ]

  return (
    <UnderDevelopment
      title="Prescrições"
      description="Módulo completo para gerenciar todas as prescrições médicas, com controles avançados, históricos e relatórios detalhados."
      features={features}
      eta="Sprint 4 - Janeiro 2026"
    />
  )
}