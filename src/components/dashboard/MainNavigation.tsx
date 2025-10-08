'use client'

import React from 'react'
import Link from 'next/link'
import { Users, FileText, BarChart3, Calculator, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

/**
 * Item de navegação principal
 */
interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  actionLabel: string
}

/**
 * Lista de itens de navegação principal
 */
const navigationItems: NavigationItem[] = [
  {
    icon: Users,
    title: 'Pacientes',
    description: 'Gerencie e visualize cadastros de pacientes, históricos e consultas.',
    href: '/dashboard/pacientes',
    actionLabel: 'Abrir'
  },
  {
    icon: FileText,
    title: 'Prescrições',
    description: 'Crie e gerencie prescrições médicas de forma eficiente e segura.',
    href: '/dashboard/prescricoes',
    actionLabel: 'Abrir'
  },
  {
    icon: BarChart3,
    title: 'Relatórios',
    description: 'Acesse relatórios detalhados sobre pacientes, atendimentos e estatísticas.',
    href: '/dashboard/relatorios',
    actionLabel: 'Abrir'
  },
  {
    icon: Calculator,
    title: 'Cálculos Clínicos',
    description: 'Realize cálculos de IMC, metabolismo basal e outras métricas importantes.',
    href: '/dashboard/calculos-clinicos',
    actionLabel: 'Abrir'
  }
]

/**
 * Seção de navegação principal do dashboard
 * 
 * @description Exibe um grid 2x2 com os principais módulos do sistema:
 * Pacientes, Prescrições, Relatórios e Cálculos Clínicos. Cada card
 * contém ícone, título, descrição e botão de ação.
 * 
 * @returns {React.ReactElement} Seção de navegação principal
 * 
 * @features
 * - Grid responsivo 2x2 (1 coluna no mobile)
 * - Cards expansivos com hover effects
 * - Ícones intuitivos para cada módulo
 * - Descrições explicativas
 * - Botões de ação com setas
 * - Design seguindo o protótipo
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function MainNavigation(): React.ReactElement {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Navegação Principal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationItems.map((item) => {
          const Icon = item.icon
          
          return (
            <Link key={item.title} href={item.href}>
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200 bg-white group">
                <div className="space-y-4">
                  {/* Header com ícone e título */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-[#2074E9]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#2074E9] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Botão de ação */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-[#2074E9] text-sm font-medium group-hover:text-[#104CA0] transition-colors">
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
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