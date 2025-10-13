'use client'

import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import api, { getErrorMessage } from '@/lib/axios'
import { AuthTokens } from '@/lib/auth-utils'

/**
 * Componente de formulário de login para o sistema EndoData
 * 
 * @description Este componente renderiza uma tela de login moderna e responsiva
 * seguindo o design system especificado. Inclui validação de formulário,
 * estados de carregamento e integração com os componentes UI da aplicação.
 * 
 * @features
 * - Design pixel-perfect seguindo especificações fornecidas
 * - Validação de email em tempo real
 * - Estado de loading durante autenticação
 * - Layout responsivo para dispositivos móveis
 * - Acessibilidade com labels apropriados
 * - Integração com componentes shadcn/ui
 * 
 * @example
 * ```tsx
 * import LoginForm from '@/components/auth/LoginForm'
 * 
 * function App() {
 *   return <LoginForm />
 * }
 * ```
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function LoginForm() {
  const router = useRouter()
  
  // Estados do formulário
  /** Estado para armazenar o email/usuário inserido */
  const [email, setEmail] = useState<string>('')
  
  /** Estado para armazenar a senha inserida */
  const [password, setPassword] = useState<string>('')
  

  /** Estado para controlar o loading durante autenticação */
  const [isLoading, setIsLoading] = useState<boolean>(false)
  /** Estado para mensagem de erro */
  const [error, setError] = useState<string | null>(null)

  /**
   * Manipulador de submissão do formulário de login
   * 
   * @description Processa o envio do formulário, validando os dados
   * e iniciando o processo de autenticação
   * 
   * @param {React.FormEvent} e - Evento de submissão do formulário
   * @returns {Promise<void>} Promise que resolve após o processamento
   * 
   * @example
   * ```tsx
   * <form onSubmit={handleSubmit}>
   *   // campos do formulário
   * </form>
   * ```
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'endodata_token'
      const { data } = await api.post('/auth/login', { email, password })
      if (data?.access_token) {
        // Salva token usando utilitário padrão (compatível com AuthGuard)
        // Define expiração para 8h a partir de agora (ajuste conforme backend)
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        AuthTokens.setToken(data.access_token, expiresAt);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoading(false);
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
        setIsLoading(false);
      }
    } catch (err: any) {
      // Não mostrar erro no console
      if (err?.response?.status === 400 || err?.response?.status === 401) {
        setError('E-mail ou senha inválidos.')
      } else if (err?.response?.status === 404) {
        setError('Serviço de autenticação indisponível. Tente novamente mais tarde.')
      } else {
        setError('Erro ao tentar autenticar. Tente novamente mais tarde.')
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-[400px] h-[572px] bg-white rounded-[10px] shadow-xs relative max-sm:w-full max-sm:h-auto max-sm:min-h-[572px]">
        {/* Logo/Icon */}
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2">
          <div className="w-[61px] h-[50px] bg-[#2074E9] rounded-lg flex items-center justify-center text-white">
            <Logo className="w-8 h-8" />
          </div>
        </div>

        {/* Título */}
        <div className="absolute top-[126px] left-[92px] right-8">
          <h1 className="font-roboto text-[24px] leading-[32px] font-bold text-[#171A1F]">
            Bem-vindo de volta!
          </h1>
        </div>

        {/* Descrição */}
        <div className="absolute top-[182px] left-[32px] right-[32px]">
          <p className="font-roboto text-[14px] leading-[20px] font-normal text-[#565D6D]">
            Acesse sua conta para continuar gerenciando seus pacientes.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="absolute inset-0">
          {/* Campo Email */}
          <div className="absolute top-[244px] left-[32px] right-[32px]">
            <Label htmlFor="email" className="font-roboto text-[14px] leading-[22px] font-medium block mb-1 text-gray-700">
              Usuário ou E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[49px] px-3 font-roboto text-[14px] leading-[22px] font-normal bg-white border border-[#DEE1E6] rounded-[6px] outline-none focus:border-[#2074E9] hover:border-[#DEE1E6] focus:ring-1 focus:ring-[#2074E9] focus:ring-offset-0 transition-colors"
            />
          </div>

          {/* Campo Senha */}
          <div className="absolute top-[332px] left-[32px] right-[32px]">
            <Label htmlFor="password" className="font-roboto text-[14px] leading-[22px] font-medium block mb-1 text-gray-700">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[49px] px-3 font-roboto text-[14px] leading-[22px] font-normal bg-white border border-[#DEE1E6] rounded-[6px] outline-none focus:border-[#2074E9] hover:border-[#DEE1E6] focus:ring-1 focus:ring-[#2074E9] focus:ring-offset-0 transition-colors"
            />
          </div>

          {/* Exibir erro de autenticação */}
          {error && (
            <div className="absolute top-[390px] left-[32px] right-[32px] text-red-600 text-sm font-roboto" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {/* Link Esqueceu Senha */}
          <div className="absolute top-[422px] right-[32px]">
            <button
              type="button"
              className="font-roboto text-[14px] leading-[20px] font-normal text-[#2074E9] hover:underline transition-all"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Botão Entrar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="absolute top-[456px] left-[32px] right-[32px] h-[40px] font-roboto text-[14px] leading-[22px] font-medium text-white bg-[#2074E9] border-none rounded-[6px] hover:bg-[#104CA0] active:bg-[#0A3065] disabled:opacity-40 transition-colors focus:ring-2 focus:ring-[#2074E9] focus:ring-offset-0"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Link Criar Conta */}
        <div className="absolute top-[522px] left-[32px] right-[32px] text-center">
          <span className="font-roboto text-[14px] leading-[20px] font-normal text-[#171A1F]">
            Não tem uma conta?{' '}
          </span>
          <button type="button" className="font-roboto text-[14px] leading-[20px] font-normal text-[#2074E9] hover:underline transition-all">
            Criar uma conta
          </button>
        </div>
      </div>
    </div>
  )
}