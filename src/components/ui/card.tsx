/**
 * @fileoverview Componentes Card modulares baseados em shadcn/ui
 * @description Sistema de cards composável com header, título, descrição,
 * conteúdo e footer para organização visual de conteúdo.
 * 
 * @author shadcn/ui Team
 * @author EndoData Team (adaptações)
 * @since 1.0.0
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Componente Card base
 * 
 * @description Container principal do card com bordas, sombra e
 * background configurados pelo design system. Serve como wrapper
 * para outros componentes do card.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

/**
 * Componente CardHeader
 * 
 * @description Seção superior do card destinada a títulos e descrições.
 * Utiliza layout flex column com espaçamento vertical consistente.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

/**
 * Componente CardTitle
 * 
 * @description Título principal do card usando heading semântico h3.
 * Configurado com tipografia destacada e tracking otimizado.
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

/**
 * Componente CardDescription  
 * 
 * @description Texto descritivo secundário do card com tipografia
 * otimizada para legibilidade e hierarquia visual clara.
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

/**
 * Componente CardContent
 * 
 * @description Container principal para o conteúdo do card com padding
 * otimizado para diferentes tipos de conteúdo e layout consistente.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Título</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Conteúdo principal do card aqui</p>
 *   </CardContent>
 * </Card>
 * ```
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

/**
 * Componente CardFooter
 * 
 * @description Seção inferior do card para ações, botões ou informações
 * complementares com layout flexível e alinhamento otimizado.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardContent>Conteúdo</CardContent>
 *   <CardFooter>
 *     <Button>Confirmar</Button>
 *     <Button variant="outline">Cancelar</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
