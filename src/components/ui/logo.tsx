import React from 'react'

/**
 * Props do componente Logo
 * 
 * @interface LogoProps
 */
interface LogoProps {
  /** Classes CSS personalizadas para o logo (opcional) */
  className?: string
}

/**
 * Componente Logo da aplicação EndoData
 * 
 * @description Renderiza o logotipo da aplicação usando SVG responsivo.
 * O logo utiliza layers empilhados simbolizando dados e organização,
 * adequado para sistemas de gerenciamento médico.
 * 
 * @param {LogoProps} props - Propriedades do componente
 * @param {string} [props.className="w-8 h-8"] - Classes CSS para estilização
 * 
 * @returns {React.ReactElement} Elemento SVG do logo
 * 
 * @features
 * - Design responsivo usando viewBox
 * - Herda cor do elemento pai (currentColor)
 * - Tamanho configurável via className
 * - Otimizado para diferentes temas (claro/escuro)
 * 
 * @example
 * ```tsx
 * // Logo padrão
 * <Logo />
 * 
 * // Logo com tamanho personalizado
 * <Logo className="w-12 h-12" />
 * 
 * // Logo em contexto colorido
 * <div className="text-blue-600">
 *   <Logo className="w-16 h-16" />
 * </div>
 * ```
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function Logo({ className = "w-8 h-8" }: LogoProps): React.ReactElement {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="w-full h-full"
        role="img"
        aria-label="Logo EndoData"
      >
        {/* Camadas representando organização de dados */}
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    </div>
  )
}