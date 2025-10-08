'use client'

import React from 'react'
import Link from 'next/link'
import { Users, FileText, Calculator, Receipt } from 'lucide-react'
import { Card } from '@/components/ui/card'

/**
 * Item de ação rápida
 */
interface QuickActionItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  description?: string
}

/**
 * Lista de ações rápidas disponíveis
 */
const quickActions: QuickActionItem[] = [
  {
    icon: Users,
    label: 'Paciente',
    href: '/dashboard/pacientes',
    description: 'Gerenciar pacientes'
  },
  {
    icon: FileText,
    label: 'Prescrição',
    href: '/dashboard/prescricao',
    description: 'Criar prescrições'
  },
  {
    icon: Calculator,
    label: 'Calcular IMC',
    href: '/dashboard/calculadora/imc',
    description: 'Calcular IMC'
  },
  {
    icon: Receipt,
    label: 'Receitas',
    href: '/dashboard/receitas',
    description: 'Gerenciar receitas'
  }
]

/**
 * Seção de ações rápidas do dashboard
 * 
 * @description Exibe um grid horizontal com 4 ações principais que o usuário
 * pode executar rapidamente: Paciente, Prescrição, Calcular IMC e Receitas.
 * 
 * @returns {React.ReactElement} Seção de ações rápidas
 * 
 * @features
 * - Grid responsivo de 4 colunas
 * - Ícones intuitivos para cada ação
 * - Hover states para feedback visual
 * - Links funcionais para navegação
 * - Design seguindo o protótipo
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function QuickActions(): React.ReactElement {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Ações Rápidas</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          
          return (
            <Link key={action.label} href={action.href}>
              <Card className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border border-gray-200 bg-white">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Ícone */}
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#2074E9]" />
                  </div>
                  
                  {/* Label */}
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">
                      {action.label}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}