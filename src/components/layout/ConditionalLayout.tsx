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
 * Layout condicional que adapta a estrutura baseado na rota atual
 * 
 * @description Este componente verifica a rota atual e decide:
 * - Na página de login (/): Header simplificado + Footer
 * - Em outras páginas: Header completo + Footer + Layout lateral
 * 
 * @param {ConditionalLayoutProps} props - Propriedades do layout
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado
 * 
 * @returns {React.ReactElement} Layout condicional
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps): React.ReactElement {
  const pathname = usePathname()
  
  // Detecta se estamos na página de login
  const isLoginPage = pathname === '/'
  
  // Detecta se estamos em rotas do dashboard (que já têm seu próprio layout)
  const isDashboardRoute = pathname?.startsWith('/dashboard')
  
  if (isLoginPage) {
    // Layout para página de login: Header simplificado + Footer
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    )
  }
  
  if (isDashboardRoute) {
    // Para rotas do dashboard, não aplicar layout adicional (já têm DashboardLayout)
    return <>{children}</>
  }
  
  // Layout para outras páginas (como /ajuda): Header responsivo + conteúdo principal
  return (
    <div className="flex min-h-screen">
      {/* Header lateral responsivo */}
      <aside className="w-16 sm:w-20 md:w-48 lg:w-64 bg-background border-r border-border flex-shrink-0 sidebar-transition sidebar-mobile">
        <Header />
      </aside>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}