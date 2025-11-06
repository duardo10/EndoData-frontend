"use client"

import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

/**
 * Componente de alternância de tema (claro/escuro/sistema)
 * 
 * @description Botão que permite ao usuário alternar entre
 * tema claro, escuro ou seguir as preferências do sistema
 * 
 * @returns {React.ReactElement} Botão de alternância de tema
 */
export function ThemeToggle(): React.ReactElement {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      case 'system':
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Tema claro (clique para escuro)'
      case 'dark':
        return 'Tema escuro (clique para sistema)'
      case 'system':
        return 'Tema do sistema (clique para claro)'
      default:
        return 'Alternar tema'
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={handleToggle}
      aria-label={getLabel()}
      title={getLabel()}
      className="relative transition-all duration-200 hover:scale-105"
    >
      {getIcon()}
    </Button>
  )
}