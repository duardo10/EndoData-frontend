'use client'

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * Props do componente WelcomeSection
 */
interface WelcomeSectionProps {
  userName: string
  userAvatar?: string
}

/**
 * Seção de boas-vindas do dashboard
 * 
 * @description Exibe uma mensagem personalizada de boas-vindas com o nome do usuário,
 * avatar, texto explicativo e botão de ação principal "Novo Paciente".
 * 
 * @param {WelcomeSectionProps} props - Propriedades do componente
 * @param {string} props.userName - Nome do usuário logado
 * @param {string} [props.userAvatar] - URL do avatar do usuário (opcional)
 * 
 * @returns {React.ReactElement} Seção de boas-vindas
 * 
 * @features
 * - Mensagem personalizada com nome do usuário
 * - Avatar do usuário (fallback para iniciais)
 * - Botão de ação principal destacado
 * - Design responsivo
 * - Cores e layout seguindo o protótipo
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function WelcomeSection({ userName, userAvatar }: WelcomeSectionProps): React.ReactElement {
  // Extrair iniciais do nome para fallback do avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="bg-gradient-to-r from-gray-100 to-gray-200 border-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar do usuário */}
            <div className="relative">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 bg-[#2074E9] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(userName)}
                  </span>
                </div>
              )}
            </div>

            {/* Mensagem de boas-vindas */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Olá, {userName}!
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                Bem-vindo(a) ao seu painel de controle. Acesse rapidamente as funcionalidades essenciais e 
                mantenha-se atualizado(a) com as informações dos seus pacientes.
              </p>
            </div>
          </div>

          {/* Botão Novo Paciente */}
          <div className="hidden md:block">
            <Link href="/dashboard/pacientes/novo">
              <Button 
                className="bg-[#2074E9] hover:bg-[#104CA0] text-white px-6 py-2 h-auto font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </Link>
          </div>
        </div>

        {/* Botão móvel */}
        <div className="md:hidden mt-4 flex justify-end">
          <Link href="/dashboard/pacientes/novo">
            <Button 
              className="bg-[#2074E9] hover:bg-[#104CA0] text-white px-4 py-2 h-auto font-medium shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}