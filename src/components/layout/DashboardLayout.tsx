'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Bell,
  Menu,
  X,
  Receipt,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { UserProfile } from '@/components/ui/UserProfile'

/**
 * Props do componente DashboardLayout
 */
interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * Itens do menu da sidebar
 */
const menuItems = [
  {
    icon: Home,
    label: 'Início',
    href: '/dashboard',
  },
  {
    icon: Search,
    label: 'Buscar',
    href: '/dashboard/pacientes/busca',
  },
  {
    icon: Users,
    label: 'Pacientes',
    href: '/dashboard/pacientes/novo',
  },
  {
    icon: FileText,
    label: 'Prescrições',
    href: '/dashboard/prescricoes',
  },
  {
    icon: Receipt,
    label: 'Receitas',
    href: '/dashboard/receitas',
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
    href: '/dashboard/relatorios',
  },
  {
    icon: Settings,
    label: 'Configurações',
    href: '/dashboard/configuracoes',
  },
  {
    icon: HelpCircle,
    label: 'Ajuda',
    href: '/dashboard/ajuda',
  },
]

/**
 * Layout principal do dashboard EndoData
 * 
 * @description Layout que contém sidebar de navegação, header com logo e avatar,
 * e área principal de conteúdo. Responsivo com menu hambúrguer para mobile.
 * 
 * @param {DashboardLayoutProps} props - Propriedades do layout
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado
 * 
 * @returns {React.ReactElement} Layout do dashboard
 * 
 * @features
 * - Sidebar com navegação principal
 * - Header com logo EndoData e avatar
 * - Responsivo para mobile
 * - Indicador de página ativa
 * - Menu colapsável
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2074E9] rounded-lg flex items-center justify-center">
              <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#2074E9]">EndoData</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-[#2074E9] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#2074E9] rounded-lg flex items-center justify-center">
                <Logo className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#2074E9]">EndoData</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                2
              </span>
            </Button>

            {/* Avatar do usuário */}
            <UserProfile 
              showName 
              size="md"
              className="hidden md:flex"
            />
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}