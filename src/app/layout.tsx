import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

/**
 * Configuração da fonte Inter do Google Fonts
 * 
 * @description Fonte principal da aplicação, usada para textos gerais
 * e elementos de interface que não requerem a fonte Roboto específica
 */
const inter = Inter({ subsets: ['latin'] });

/**
 * Configuração da fonte Roboto do Google Fonts
 * 
 * @description Fonte específica para o formulário de login e elementos
 * que seguem o design system fornecido. Inclui pesos 400, 500 e 700
 * para atender às especificações de design.
 */
const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

/**
 * Metadados da aplicação EndoData
 * 
 * @description Define informações SEO e de apresentação da aplicação
 * incluindo título, descrição e outras meta tags importantes
 */
export const metadata: Metadata = {
  title: 'EndoData - Sistema de Gerenciamento de Pacientes',
  description: 'Sistema moderno para gerenciamento de pacientes com Next.js 14, TypeScript, Tailwind CSS e shadcn/ui',
};

/**
 * Propriedades do componente RootLayout
 * 
 * @interface RootLayoutProps
 */
interface RootLayoutProps {
  /** Componentes filhos que serão renderizados dentro do layout */
  children: React.ReactNode;
}

/**
 * Layout raiz da aplicação EndoData
 * 
 * @description Este componente define a estrutura HTML base da aplicação,
 * incluindo configurações de tema, fontes, providers globais e estrutura
 * de layout principal com header, main e footer.
 * 
 * @param {RootLayoutProps} props - Propriedades do layout
 * @param {React.ReactNode} props.children - Conteúdo das páginas
 * 
 * @returns {React.ReactElement} Estrutura HTML completa da aplicação
 * 
 * @features
 * - Suporte a tema claro/escuro automático
 * - Configuração de fontes otimizadas
 * - Estrutura de layout flexível
 * - Supressão de warnings de hidratação
 * - Idioma configurado para português brasileiro
 * - Providers globais integrados
 * 
 * @example
 * Este layout é aplicado automaticamente pelo Next.js App Router
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactElement {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} ${roboto.variable}`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
