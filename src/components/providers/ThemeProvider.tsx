'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

/**
 * Provider de tema para gerenciar modo claro/escuro na aplicação EndoData
 * 
 * @description Componente wrapper que encapsula o NextThemesProvider,
 * fornecendo funcionalidade de troca de tema automática baseada nas
 * preferências do sistema ou escolha manual do usuário.
 * 
 * @param {ThemeProviderProps} props - Propriedades do provider de tema
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {...any} props.props - Demais propriedades do NextThemesProvider
 * 
 * @returns {React.ReactElement} Provider de tema configurado
 * 
 * @features
 * - Detecção automática de preferência do sistema
 * - Persistência da escolha do usuário
 * - Transições suaves entre temas
 * - Suporte a temas personalizados
 * - Prevenção de flash de conteúdo não estilizado (FOUC)
 * 
 * @example
 * ```tsx
 * import { ThemeProvider } from '@/components/providers/ThemeProvider'
 * 
 * function App() {
 *   return (
 *     <ThemeProvider
 *       attribute="class"
 *       defaultTheme="system"
 *       enableSystem
 *       disableTransitionOnChange
 *     >
 *       <YourApp />
 *     </ThemeProvider>
 *   )
 * }
 * ```
 * 
 * @see {@link https://github.com/pacocoursey/next-themes} - Documentação next-themes
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps): React.ReactElement {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
