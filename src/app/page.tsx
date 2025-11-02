import LoginForm from '@/components/auth/LoginForm'

/**
 * Página inicial da aplicação EndoData
 * 
 * @description Esta é a página raiz da aplicação que renderiza diretamente
 * o formulário de login. Seguindo o padrão de Single Page Application (SPA)
 * focado exclusivamente na autenticação de usuários.
 * 
 * @route / (página principal)
 * 
 * @returns {React.ReactElement} Componente de formulário de login
 * 
 * @features
 * - Acesso direto ao login sem páginas intermediárias
 * - Design focado e minimalista
 * - Otimizado para conversão de login
 * - Compatível com Next.js App Router
 * 
 * @example
 * Acesso via URL:
 * - http://209.145.59.215:3000/ (desenvolvimento)
 * - https://endodata.com/ (produção)
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function Home(): React.ReactElement {
  return <LoginForm />
}
