'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { MainNavigation } from '@/components/dashboard/MainNavigation'

/**
 * Página principal do dashboard EndoData
 * 
 * @description Tela home do sistema após login, contendo:
 * - Seção de boas-vindas personalizada
 * - Ações rápidas (Paciente, Prescrição, Calcular IMC, Receitas)
 * - Navegação principal em cards (Pacientes, Prescrições, Relatórios, Cálculos Clínicos)
 * 
 * @route /dashboard (página principal pós-login)
 * 
 * @returns {React.ReactElement} Componente do dashboard
 * 
 * @features
 * - Layout responsivo com sidebar
 * - Navegação intuitiva por cards
 * - Ações rápidas para tarefas comuns
 * - Personalização com dados do usuário
 * - Design seguindo protótipo fornecido
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function Dashboard(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Seção de Boas-vindas */}
        <WelcomeSection 
          userName="Doutor João"
          userAvatar="/avatars/doutor-joao.jpg"
        />

        {/* Ações Rápidas */}
        <QuickActions />

        {/* Navegação Principal */}
        <MainNavigation />
      </div>
    </DashboardLayout>
  )
}