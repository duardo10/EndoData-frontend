import Link from 'next/link';

/**
 * Componente de rodapé da aplicação EndoData
 * 
 * @description Footer responsivo com informações de copyright e links
 * para páginas legais. Adapta-se automaticamente entre layout vertical
 * (mobile) e horizontal (desktop).
 * 
 * @returns {React.ReactElement} Componente de footer estilizado
 * 
 * @features
 * - Layout responsivo (coluna no mobile, linha no desktop)
 * - Links para páginas legais (Privacy, Terms)
 * - Espaçamento consistente com container
 * - Tipografia otimizada para informações secundárias
 * - Hover states nos links
 * - Bordas superiores para separação visual
 * 
 * @example
 * ```tsx
 * import { Footer } from '@/components/layout/Footer'
 * 
 * function Layout() {
 *   return (
 *     <div className="min-h-screen flex flex-col">
 *       <Header />
 *       <main className="flex-1">{children}</main>
 *       <Footer />
 *     </div>
 *   )
 * }
 * ```
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function Footer(): React.ReactElement {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 MyApp. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
