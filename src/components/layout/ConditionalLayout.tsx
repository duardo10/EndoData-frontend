'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

/**
 * Props do ConditionalLayout
 */
interface ConditionalLayoutProps {
  children: React.ReactNode
}

/**
 * Layout condicional que exibe Header/Footer apenas quando necessário
 * 
 * @description Este componente verifica a rota atual e decide se deve
 * exibir o Header e Footer padrão. Para rotas do dashboard, não exibe
 * pois o DashboardLayout já tem seu próprio header.
 * 
 * @param {ConditionalLayoutProps} props - Propriedades do layout
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado
 * 
 * @returns {React.ReactElement} Layout condicional
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps): React.ReactElement {
  const pathname = usePathname()
  
  // Não exibir Header/Footer nas rotas do dashboard
  const isDashboardRoute = pathname?.startsWith('/dashboard')
  
  if (isDashboardRoute) {
    return <>{children}</>
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}