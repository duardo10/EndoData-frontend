'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Ajuda
 * 
 * @description Central de ajuda com documentação, tutoriais e suporte
 * 
 * @returns {React.ReactElement} Página de ajuda
 */
export default function Ajuda(): React.ReactElement {
  const features = [
    'Base de conhecimento completa',
    'Tutoriais em vídeo passo-a-passo',
    'FAQ (Perguntas Frequentes)',
    'Chat de suporte em tempo real',
    'Tickets de suporte técnico',
    'Documentação da API',
    'Guias de melhores práticas',
    'Downloads de manuais em PDF'
  ]

  return (
    <UnderDevelopment
      title="Central de Ajuda"
      description="Centro de suporte completo com documentação, tutoriais e canais de atendimento para ajudá-lo a aproveitar ao máximo o EndoData."
      features={features}
      eta="Sprint 2 - Novembro 2025"
    />
  )
}