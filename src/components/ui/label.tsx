/**
 * @fileoverview Componente Label acessível baseado em Radix UI
 * @description Label semântico com acessibilidade integrada para
 * associação com campos de formulário.
 * 
 * @author Radix UI Team
 * @author EndoData Team (adaptações)
 * @since 1.0.0
 */

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Variantes de estilo do componente Label
 * 
 * @description Define classes CSS base com suporte a estados
 * de elementos peer (irmãos adjacentes) para melhor UX.
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Componente Label acessível para formulários
 * 
 * @description Label semântico baseado em Radix UI que garante
 * acessibilidade adequada e associação correta com campos de entrada.
 * Inclui estados visuais para elementos peer disabled.
 * 
 * @param {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} props - Props do Radix Label
 * @param {React.Ref} ref - Ref para o elemento label
 * 
 * @returns {React.ReactElement} Elemento label acessível
 * 
 * @features
 * - Acessibilidade nativa do Radix UI
 * - Associação automática com campos
 * - Estados visuais para peer elements
 * - Tipografia consistente
 * - Cursor apropriado para elementos disabled
 * - Forward ref suportado
 * 
 * @example
 * ```tsx
 * // Label básico
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 * 
 * // Label com campo peer
 * <div className="space-y-2">
 *   <Label htmlFor="password">Senha</Label>
 *   <Input 
 *     id="password" 
 *     type="password" 
 *     disabled 
 *     className="peer"
 *   />
 * </div>
 * 
 * // Label customizado
 * <Label 
 *   className="text-lg font-bold"
 *   htmlFor="name"
 * >
 *   Nome Completo
 * </Label>
 * ```
 * 
 * @see {@link https://www.radix-ui.com/docs/primitives/components/label} - Radix UI Label
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
