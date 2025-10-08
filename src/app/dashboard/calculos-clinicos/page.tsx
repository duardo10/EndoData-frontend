'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Cálculos Clínicos
 * 
 * @description Centro de ferramentas para cálculos clínicos diversos
 * 
 * @returns {React.ReactElement} Página de cálculos clínicos
 */
export default function CalculosClinicos(): React.ReactElement {
  const features = [
    'Calculadora de IMC e composição corporal',
    'Taxa de filtração glomerular (TFG)',
    'Cálculo de dosagem de medicamentos',
    'Scores clínicos (Apache, Glasgow, etc.)',
    'Conversões de unidades médicas',
    'Cálculos pediátricos específicos',
    'Ferramentas cardiológicas',
    'Calculadoras de risco cardiovascular'
  ]

  return (
    <UnderDevelopment
      title="Cálculos Clínicos"
      description="Suite completa de calculadoras e ferramentas para cálculos clínicos essenciais na prática médica diária."
      features={features}
      eta="Sprint 2 - Novembro 2025"
    />
  )
}