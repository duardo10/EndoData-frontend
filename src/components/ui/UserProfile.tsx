'use client'

import React from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'

/**
 * Props do componente UserProfile
 */
interface UserProfileProps {
  showName?: boolean
  showSpecialty?: boolean
  showCrm?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Componente de perfil do usuário
 * 
 * @description Componente reutilizável que exibe avatar e informações do usuário
 * logado, com diferentes tamanhos e opções de exibição.
 * 
 * @param {UserProfileProps} props - Propriedades do componente
 * @param {boolean} [props.showName=true] - Se deve exibir o nome do usuário
 * @param {boolean} [props.showSpecialty=false] - Se deve exibir a especialidade
 * @param {boolean} [props.showCrm=false] - Se deve exibir o CRM
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Tamanho do avatar
 * @param {string} [props.className] - Classes CSS adicionais
 * 
 * @returns {React.ReactElement} Componente de perfil do usuário
 * 
 * @features
 * - Avatar com iniciais do nome
 * - Estados de loading e erro
 * - Diferentes tamanhos (sm, md, lg)
 * - Exibição opcional de informações
 * - Design consistente com o sistema
 * 
 * @example
 * ```tsx
 * // Avatar simples
 * <UserProfile />
 * 
 * // Avatar com nome
 * <UserProfile showName />
 * 
 * // Avatar completo
 * <UserProfile showName showSpecialty showCrm size="lg" />
 * ```
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function UserProfile({ 
  showName = true, 
  showSpecialty = false, 
  showCrm = false, 
  size = 'md',
  className = ''
}: UserProfileProps): React.ReactElement {
  const { user, loading, error } = useUserProfile()

  // Configurações de tamanho
  const sizeConfig = {
    sm: {
      avatar: 'w-6 h-6',
      text: 'text-xs',
      name: 'text-xs'
    },
    md: {
      avatar: 'w-8 h-8',
      text: 'text-sm',
      name: 'text-sm'
    },
    lg: {
      avatar: 'w-12 h-12',
      text: 'text-base',
      name: 'text-base'
    }
  }

  const config = sizeConfig[size]

  // Função para extrair iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Estado de loading
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${config.avatar} bg-gray-200 rounded-full animate-pulse`}></div>
        {showName && (
          <div className="bg-gray-200 h-4 w-20 rounded animate-pulse"></div>
        )}
      </div>
    )
  }

  // Estado de erro
  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${config.avatar} bg-red-100 rounded-full flex items-center justify-center`}>
          <span className={`${config.text} text-red-600 font-medium`}>!</span>
        </div>
        {showName && (
          <span className={`${config.name} text-red-600`}>Erro</span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Avatar */}
      <div className={`${config.avatar} bg-[#2074E9] rounded-full flex items-center justify-center`}>
        <span className={`${config.text} text-white font-medium`}>
          {user ? getInitials(user.name) : 'U'}
        </span>
      </div>

      {/* Informações do usuário */}
      {showName && (
        <div className="flex flex-col">
          <span className={`${config.name} font-medium text-gray-700`}>
            {user ? user.name : 'Usuário'}
          </span>
          
          {/* Especialidade */}
          {showSpecialty && user?.especialidade && (
            <span className={`${config.text} text-gray-500`}>
              {user.especialidade}
            </span>
          )}
          
          {/* CRM */}
          {showCrm && user?.crm && (
            <span className={`${config.text} text-gray-500`}>
              CRM: {user.crm}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
