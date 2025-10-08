'use client'

import React from 'react'
import { UnderDevelopment } from '@/components/ui/UnderDevelopment'

/**
 * Página de Configurações
 * 
 * @description Página para gerenciar configurações do sistema e perfil do usuário
 * 
 * @returns {React.ReactElement} Página de configurações
 */
export default function Configuracoes(): React.ReactElement {
  const features = [
    'Configurações de perfil do usuário',
    'Preferências de notificações',
    'Configurações de segurança e privacidade',
    'Personalização da interface',
    'Configurações de backup e sincronização',
    'Gerenciamento de permissões',
    'Configurações de relatórios automáticos',
    'Integração com sistemas externos'
  ]

  return (
    <UnderDevelopment
      title="Configurações"
      description="Central de configurações para personalizar sua experiência no EndoData. Configure seu perfil, preferências, segurança e muito mais."
      features={features}
      eta="Sprint 3 - Dezembro 2025"
    />
  )
}