'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Relatórios
 * 
 * @description Página para visualizar relatórios e estatísticas
 * 
 * @returns {React.ReactElement} Página de relatórios
 */
export default function Relatorios(): React.ReactElement {
  const features = [
    'Dashboard com métricas em tempo real',
    'Relatórios de atendimentos por período',
    'Estatísticas de pacientes ativos',
    'Análise de prescrições mais comuns',
    'Gráficos interativos de performance',
    'Exportação em PDF e Excel',
    'Relatórios personalizáveis',
    'Comparativos mensais e anuais'
  ]

  return (
    <UnderDevelopment
      title="Relatórios e Estatísticas"
      description="Central de business intelligence com relatórios detalhados, gráficos interativos e análises para tomada de decisão."
      features={features}
      eta="Sprint 5 - Fevereiro 2026"
    />
  )
}