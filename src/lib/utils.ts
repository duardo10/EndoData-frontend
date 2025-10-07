import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário para combinação inteligente de classes CSS
 * 
 * @description Função que combina classes CSS usando clsx para lógica condicional
 * e tailwind-merge para resolver conflitos entre classes do Tailwind CSS.
 * Esta é uma função essencial para o funcionamento dos componentes shadcn/ui.
 * 
 * @param {...ClassValue[]} inputs - Classes CSS a serem combinadas
 * @returns {string} String com classes CSS otimizadas e sem conflitos
 * 
 * @features
 * - Resolve conflitos entre classes do Tailwind
 * - Suporte a classes condicionais
 * - Otimização automática de duplicatas
 * - Compatibilidade total com shadcn/ui
 * 
 * @example
 * ```tsx
 * // Combinação simples
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // Resultado: "px-4 py-2 bg-blue-500"
 * 
 * // Resolução de conflitos
 * cn('px-4 px-6', 'py-2')
 * // Resultado: "px-6 py-2" (px-6 sobrescreve px-4)
 * 
 * // Classes condicionais
 * cn('base-class', {
 *   'active-class': isActive,
 *   'disabled-class': isDisabled
 * })
 * 
 * // Uso em componentes
 * <Button className={cn('default-styles', className)} />
 * ```
 * 
 * @see {@link https://github.com/dcastil/tailwind-merge} - Documentação tailwind-merge
 * @see {@link https://github.com/lukeed/clsx} - Documentação clsx
 * 
 * @author shadcn/ui Team
 * @since 1.0.0
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
