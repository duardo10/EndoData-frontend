/**
 * @fileoverview Componente Input reutilizável baseado em shadcn/ui
 * @description Campo de entrada estilizado com design system consistente
 * e suporte completo a acessibilidade.
 * 
 * @author shadcn/ui Team
 * @author EndoData Team (adaptações)
 * @since 1.0.0
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props do componente Input
 * 
 * @interface InputProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 * @description Herda todas as propriedades nativas de um input HTML
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Componente Input com design system integrado
 * 
 * @description Campo de entrada reutilizável com estilização consistente,
 * estados de foco, hover e disabled. Suporta todos os tipos de input
 * HTML5 e integra-se perfeitamente com formulários.
 * 
 * @param {InputProps} props - Propriedades do input
 * @param {React.Ref<HTMLInputElement>} ref - Ref para o elemento input
 * 
 * @returns {React.ReactElement} Elemento input estilizado
 * 
 * @features
 * - Design consistente com design system
 * - Estados visuais (focus, hover, disabled)
 * - Suporte a todos os tipos HTML5
 * - Ring de foco para acessibilidade
 * - Placeholder estilizado
 * - Suporte a file inputs
 * - Forward ref para bibliotecas de formulário
 * 
 * @example
 * ```tsx
 * // Input básico
 * <Input type="text" placeholder="Digite seu nome" />
 * 
 * // Input de email
 * <Input type="email" placeholder="seu@email.com" />
 * 
 * // Input de senha
 * <Input type="password" placeholder="Sua senha" />
 * 
 * // Input com ref
 * const inputRef = useRef<HTMLInputElement>(null)
 * <Input ref={inputRef} type="text" />
 * 
 * // Input customizado
 * <Input 
 *   className="w-full" 
 *   type="search" 
 *   placeholder="Buscar..." 
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
