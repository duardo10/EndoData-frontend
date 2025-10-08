'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Calculadora de IMC
 * 
 * @description Calculadora de Índice de Massa Corporal e outras métricas
 * 
 * @returns {React.ReactElement} Página de calculadora de IMC
 */
export default function CalculadoraIMC(): React.ReactElement {
  const features = [
    'Cálculo de IMC (Índice de Massa Corporal)',
    'Classificação automática dos resultados',
    'Gráficos de evolução temporal',
    'Cálculo de peso ideal',
    'Taxa de metabolismo basal (TMB)',
    'Necessidade calórica diária',
    'Relatórios personalizados para pacientes',
    'Histórico de medições por paciente'
  ]

  return (
    <UnderDevelopment
      title="Calculadora de IMC"
      description="Ferramentas completas para cálculo de IMC e outras métricas importantes para avaliação nutricional e acompanhamento de pacientes."
      features={features}
      eta="Sprint 1 - Outubro 2025"
    />
  )
}