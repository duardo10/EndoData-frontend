'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { MainNavigation } from '@/components/dashboard/MainNavigation'
import { useUserProfile } from '@/hooks/useUserProfile'

/**
 * Página principal do dashboard EndoData
 * 
 * @description Tela home do sistema após login, contendo:
 * - Seção de boas-vindas personalizada com dados reais do médico
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
 * - Personalização com dados reais do usuário logado
 * - Design seguindo protótipo fornecido
 * - Estados de loading e erro para melhor UX
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function Dashboard(): React.ReactElement {
  const { user, loading, error } = useUserProfile()

  // Estado de loading
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Estado de erro
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar dados
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Seção de Boas-vindas com dados reais */}
        <WelcomeSection 
          userName={user?.name || 'Médico'}
          userSpecialty={user?.especialidade}
          userCrm={user?.crm}
        />

        {/* Ações Rápidas */}
        <QuickActions />

        {/* Navegação Principal */}
        <MainNavigation />
      </div>
    </DashboardLayout>
  )
}