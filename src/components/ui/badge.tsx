import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}



/**
 * Componente Badge estilizado para exibir rótulos, status ou categorias de forma visual e acessível.
 *
 * @component
 * @param {BadgeProps} props - Propriedades do badge, incluindo classe CSS, variante de cor e atributos do div.
 * @returns {JSX.Element} Elemento visual de badge
 *
 * @example
 * <Badge variant="destructive">Erro</Badge>
 * <Badge variant="secondary" className="ml-2">Novo</Badge>
 *
 * @remarks
 * Use para destacar informações rápidas, status de entidades ou categorias em listas e cards.
 * Suporta variantes de cor para diferentes contextos (default, secondary, destructive, outline).
 *
 * @see https://ui.endodata.com/components/badge
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }