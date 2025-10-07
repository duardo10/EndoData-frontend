/**
 * @fileoverview Componente Button reutilizável baseado em shadcn/ui
 * @description Implementação de botão com múltiplas variantes e tamanhos
 * usando class-variance-authority para type-safe styling.
 * 
 * @author shadcn/ui Team
 * @author EndoData Team (adaptações)
 * @since 1.0.0
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Variantes de estilo do componente Button usando CVA
 * 
 * @description Define todas as classes CSS para diferentes variantes
 * e tamanhos do botão, garantindo consistência visual e type safety.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props do componente Button
 * 
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @extends VariantProps<typeof buttonVariants>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Se true, renderiza como Slot (delegação de props) */
  asChild?: boolean
}

/**
 * Componente Button reutilizável com suporte a múltiplas variantes
 * 
 * @description Botão flexível baseado em shadcn/ui com suporte a diferentes
 * estilos, tamanhos e comportamentos. Utiliza forwardRef para compatibilidade
 * com bibliotecas de formulário e acessibilidade.
 * 
 * @param {ButtonProps} props - Propriedades do botão
 * @param {React.Ref<HTMLButtonElement>} ref - Ref para o elemento button
 * 
 * @returns {React.ReactElement} Elemento button ou Slot configurado
 * 
 * @features
 * - 6 variantes de estilo (default, destructive, outline, secondary, ghost, link)
 * - 4 tamanhos (default, sm, lg, icon)
 * - Suporte a composição via Slot (asChild)
 * - Forward ref para acessibilidade
 * - Type safety com VariantProps
 * - Classes CSS otimizadas
 * 
 * @example
 * ```tsx
 * // Botão padrão
 * <Button>Click me</Button>
 * 
 * // Botão com variante e tamanho
 * <Button variant="destructive" size="lg">Delete</Button>
 * 
 * // Botão como link
 * <Button asChild>
 *   <Link href="/home">Home</Link>
 * </Button>
 * 
 * // Botão de ícone
 * <Button variant="ghost" size="icon">
 *   <Icon />
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
