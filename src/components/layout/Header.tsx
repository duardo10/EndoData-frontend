'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

/**
 * Componente de cabeçalho da aplicação EndoData
 * 
 * @description Header responsivo com navegação principal, toggle de tema
 * e menu hambúrguer para dispositivos móveis. Inclui funcionalidade
 * de mudança de tema claro/escuro e navegação sticky.
 * 
 * @returns {React.ReactElement} Componente de header configurado
 * 
 * @features
 * - Design responsivo com breakpoints
 * - Toggle de tema claro/escuro animado
 * - Navegação sticky com backdrop blur
 * - Menu hambúrguer para mobile
 * - Links de navegação com hover states
 * - Acessibilidade com screen readers
 * - Ícones animados do Lucide React
 * 
 * @example
 * ```tsx
 * import { Header } from '@/components/layout/Header'
 * 
 * function Layout() {
 *   return (
 *     <div>
 *       <Header />
 *       <main>{children}</main>
 *     </div>
 *   )
 * }
 * ```
 * 
 * @dependencies
 * - next-themes - Gerenciamento de tema
 * - lucide-react - Ícones SVG
 * - Next.js Link - Navegação otimizada
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function Header(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">MyApp</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
