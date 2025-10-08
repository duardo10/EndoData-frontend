'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Prescrição (Criar Nova)
 * 
 * @description Página para criar nova prescrição médica
 * 
 * @returns {React.ReactElement} Página de prescrição
 */
export default function Prescricao(): React.ReactElement {
  const features = [
    'Formulário intuitivo de prescrição',
    'Busca inteligente de medicamentos',
    'Verificação automática de interações',
    'Templates de prescrições frequentes',
    'Assinatura digital integrada',
    'Preview antes da finalização',
    'Envio automático para farmácias',
    'Histórico de prescrições do paciente'
  ]

  return (
    <UnderDevelopment
      title="Nova Prescrição"
      description="Interface simplificada para criação de prescrições médicas com verificações automáticas e assinatura digital certificada."
      features={features}
      eta="Sprint 3 - Dezembro 2025"
    />
  )
}