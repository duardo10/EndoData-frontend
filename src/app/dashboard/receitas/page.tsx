'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Receitas
 * 
 * @description Página para gerenciar receitas médicas
 * 
 * @returns {React.ReactElement} Página de receitas
 */
export default function Receitas(): React.ReactElement {
  const features = [
    'Criação de receitas médicas digitais',
    'Templates de receitas pré-definidos',
    'Banco de dados de medicamentos',
    'Verificação de interações medicamentosas',
    'Histórico de receitas por paciente',
    'Assinatura digital certificada',
    'Impressão e envio por email',
    'Integração com farmácias parceiras'
  ]

  return (
    <UnderDevelopment
      title="Receitas Médicas"
      description="Sistema completo para criação, gerenciamento e controle de receitas médicas digitais com total segurança e conformidade legal."
      features={features}
      eta="Sprint 4 - Janeiro 2026"
    />
  )
}