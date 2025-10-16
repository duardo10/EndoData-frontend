'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X, Home, Users, Pill, FileText, Settings, HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * Componente Header responsivo da aplicação EndoData
 * 
 * @description Header adaptativo que muda sua apresentação baseado na rota atual.
 * Na página de login exibe apenas o logo centralizado, enquanto em outras páginas
 * apresenta navegação lateral completa com menu responsivo e controle de tema.
 * 
 * @returns {React.ReactElement} Componente header
 * 
 * @features
 * - Layout adaptativo baseado na rota
 * - Navegação lateral responsiva
 * - Controle de tema (claro/escuro)
 * - Menu hambúrguer para mobile
 * - Logo centralizado na página de login
 * - Links de navegação com ícones
 * - Tooltips para melhor UX
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function Header(): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Detecta se estamos na página de login ou cadastro
  const isLoginPage = pathname === '/';
  const isCadastroPage = pathname === '/cadastro';

  // NavLinks responsivo que se adapta ao tamanho da tela
  const NavLinks = () => {
    const navItems = [
      { href: "/", icon: Home, label: "Início" },
      { href: "/pacientes", icon: Users, label: "Pacientes" },
      { href: "/prescricao", icon: Pill, label: "Prescrição" },
      { href: "/relatorios", icon: FileText, label: "Relatórios" },
      { href: "/configuracoes", icon: Settings, label: "Configurações" },
      { href: "/ajuda", icon: HelpCircle, label: "Teste" },
    ];

    return (
      <div className="flex flex-col space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 p-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-accent nav-item-hover"
            title={label} // Tooltip para telas pequenas
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="hidden sm:block md:block lg:block truncate">
              {label}
            </span>
          </Link>
        ))}
      </div>
    );
  };

  // Header simplificado para página de login e cadastro
  if (isLoginPage || isCadastroPage) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
        <div className="container flex h-16 items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">EndoData</span>
          </Link>
        </div>
      </header>
    );
  }

  // Header completo para outras páginas (lateral responsivo)
  return (
    <div className="h-full flex flex-col">
      {/* Logo responsivo */}
      <div className="p-2 sm:p-4 md:p-6 border-b border-border">
        <Link href="/" className="flex items-center justify-center sm:justify-start">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 logo-icon">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="hidden sm:block md:block lg:block ml-2 text-lg font-bold text-primary truncate">
            EndoData
          </span>
        </Link>
      </div>

      {/* Navegação responsiva */}
      <nav className="flex-1 p-2 sm:p-3 md:p-4">
        <NavLinks />
      </nav>

      {/* Botões de controle responsivos */}
      <div className="p-2 sm:p-3 md:p-4 border-t border-border">
        <div className="flex items-center justify-center sm:justify-start">
          {/* Botão de tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-full sm:w-auto"
            title="Alternar tema"
          >
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
