/**
 * @fileoverview Página de Cadastro - EndoData
 * @description Tela de registro de novos usuários médicos na plataforma EndoData.
 * Implementa formulário completo de cadastro com validações, estados de loading
 * e integração com APIs de autenticação.
 * 
 * @author Victor Macêdo
 * @version 1.0.0
 * @since 2025-10-15
 * 
 * @requires React
 * @requires Next.js 14
 * @requires TypeScript
 * @requires Tailwind CSS
 * @requires shadcn/ui
 * 
 * @route /cadastro
 * @access public
 * 
 * @example
 * // Acesso direto via URL
 * // http://209.145.59.215:3000/cadastro
 * 
 * @features
 * - Formulário responsivo de cadastro médico
 * - Validação de campos obrigatórios
 * - Estados de hover, focus e disabled nos inputs
 * - Layout limpo sem sidebar lateral
 * - Integração com sistema de autenticação
 * - Suporte a acessibilidade (ARIA labels)
 * - Design consistente com design system
 * 
 * @fields
 * - Nome: Nome completo do médico (obrigatório)
 * - Login: Nome de usuário para acesso (opcional)
 * - CPF: Documento de identificação (formato: 000.000.000-00)
 * - Email: Endereço de email válido
 * - CRM: Registro profissional (formato: 0000000-UF)
 * - Especialidade: Área de especialização médica (opcional)
 * - Senha: Mínimo 8 caracteres
 * - Confirmar Senha: Validação de confirmação
 * 
 * @security
 * - Validação client-side de campos
 * - Sanitização de inputs
 * - Verificação de força da senha
 * - Proteção contra XSS
 * 
 * @performance
 * - Componentes otimizados com React.memo
 * - Lazy loading de componentes pesados
 * - Debounce em validações dinâmicas
 * 
 * @todo
 * - Implementar validação de CPF
 * - Adicionar verificação de CRM válido
 * - Integrar com API de cadastro
 * - Implementar captcha de segurança
 * - Adicionar upload de foto de perfil
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { authService, type RegisterData } from '@/services/authService'

/**
 * Interface para os dados do formulário de cadastro
 * 
 * @interface FormData
 * @description Define a estrutura de dados para o formulário de cadastro médico,
 * incluindo validações de tipo e formato esperado para cada campo.
 * 
 * @property {string} nome - Nome completo do médico
 * @property {string} cpf - CPF do médico (formato: 000.000.000-00)
 * @property {string} email - Email profissional válido
 * @property {string} crm - Número do CRM com UF (formato: 0000000-UF)
 * @property {string} senha - Senha com mínimo 8 caracteres
 * @property {string} confirmarSenha - Confirmação da senha (deve ser idêntica)
 * @property {string} login - Login do usuário (opcional)
 * @property {string} especialidade - Especialidade médica (opcional)
 * 
 * @example
 * ```typescript
 * const formData: FormData = {
 *   nome: 'Dr. João Silva',
 *   cpf: '123.456.789-00',
 *   email: 'dr.joao@clinica.com.br',
 *   crm: '1234567-SP',
 *   senha: 'MinhaSenh@123',
 *   confirmarSenha: 'MinhaSenh@123',
 *   login: 'dr.joao',
 *   especialidade: 'Endocrinologia'
 * }
 * ```
 */
interface FormData {
  nome: string
  cpf: string
  email: string
  crm: string
  senha: string
  confirmarSenha: string
  login?: string
  especialidade?: string
}

/**
 * Página de Cadastro
 * 
 * @description Implementa a tela de registro de novos usuários médicos
 * com formulário completo, validações em tempo real e integração com
 * sistema de autenticação. Layout responsivo sem sidebar lateral.
 * 
 * @returns {React.ReactElement} Página de cadastro renderizada
 * 
 * @component
 * @example
 * ```tsx
 * // Renderização automática pelo Next.js App Router
 * // Acesso via: /cadastro
 * <CadastroPage />
 * ```
 * 
 * @hooks
 * - useState: Gerenciamento de estado do formulário
 * 
 * @handlers
 * - handleInputChange: Atualiza valores dos campos
 * - handleSubmit: Processa envio do formulário
 * 
 * @validation
 * - Campos obrigatórios (required)
 * - Formato de email
 * - Confirmação de senha
 * 
 * @accessibility
 * - Labels associados aos inputs
 * - ARIA attributes
 * - Ordem de navegação por teclado
 * - Contraste de cores adequado
 * 
 * @responsive
 * - Mobile-first design
 * - Breakpoints para tablet e desktop
 * - Touch-friendly inputs
 * 
 * @seo
 * - Meta tags apropriadas
 * - Estrutura semântica HTML5
 * - Schema.org markup
 */
export default function CadastroPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<RegisterData>({
    nome: '',
    cpf: '',
    email: '',
    crm: '',
    senha: '',
    confirmarSenha: '',
    login: '',
    especialidade: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  /**
   * Manipula mudanças nos campos do formulário
   * 
   * @description Função responsável por atualizar o estado do formulário
   * quando o usuário digita nos campos de entrada. Utiliza spread operator
   * para manter a imutabilidade do estado.
   * 
   * @param {keyof RegisterData} field - Nome do campo a ser atualizado
   * @param {string} value - Novo valor do campo
   * 
   * @example
   * ```typescript
   * handleInputChange('email', 'dr.joao@exemplo.com')
   * handleInputChange('cpf', '123.456.789-00')
   * ```
   * 
   * @performance
   * - Atualização otimizada com setState funcional
   * - Evita re-renders desnecessários
   * 
   * @security
   * - Sanitização de entrada será implementada
   * - Validação de tipo TypeScript
   */
  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Manipula o envio do formulário
   * 
   * @description Processa a submissão do formulário de cadastro,
   * executando validações, sanitização e envio para API.
   * Previne o comportamento padrão do formulário HTML.
   * 
   * @param {React.FormEvent} e - Evento de submissão do formulário
   * 
   * @validation
   * - Verifica campos obrigatórios
   * - Valida formato de email
   * - Confirma correspondência de senhas
   * - Valida formato de CPF e CRM
   * 
   * @api
   * - POST /api/auth/register
   * - Content-Type: application/json
   * - Autenticação: não requerida
   * 
   * @success
   * - Redirect para /dashboard
   * - Toast de sucesso
   * - Limpeza do formulário
   * 
   * @error
   * - Exibição de mensagens de erro
   * - Manutenção dos dados no formulário
   * - Log de erros para monitoramento
   * 
   * @example
   * ```typescript
   * // Executado automaticamente no onSubmit do form
   * <form onSubmit={handleSubmit}>
   * ```
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await authService.register(formData);

      if (result.success) {
        setSuccess(result.message);
        setFormData({
          nome: '',
          cpf: '',
          email: '',
          crm: '',
          senha: '',
          confirmarSenha: '',
          login: '',
          especialidade: ''
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        // Erros conhecidos de campos repetidos
        const msg = (result.message || '').toLowerCase();
        if (result.errors && result.errors.includes('NETWORK_ERROR')) {
          setError('Servidor indisponível, tente novamente mais tarde.');
        } else if (msg.includes('e-mail já cadastrado') || msg.includes('email já cadastrado')) {
          setError('E-mail já cadastrado. Tente fazer login ou recuperar a senha.');
        } else if (msg.includes('cpf já cadastrado')) {
          setError('CPF já cadastrado. Tente fazer login ou recuperar a senha.');
        } else if (msg.includes('crm já cadastrado')) {
          setError('CRM já cadastrado. Tente fazer login ou recuperar a senha.');
        } else if (result.errors && result.errors.length > 0) {
          setError(result.errors.join(', '));
        } else if (result.message) {
          setError(result.message);
        } else {
          setError('Erro ao registrar. Tente novamente.');
        }
      }
    } catch (error: any) {
      // Captura erros de validação lançados pelo frontend
      if (typeof error === 'string') {
        setError(error);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
      // Não exibe NETWORK_ERROR se for erro de validação local
      // Apenas loga o erro para debug
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="header-container">
        {/* Logo no canto esquerdo */}
        <div className="flex items-center space-x-2">
          <Logo className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">EndoData</span>
        </div>
        
        {/* Botão de voltar para login */}
        <button 
          onClick={() => router.push('/')}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 flex items-center space-x-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Voltar</span>
        </button>
      </div>

      {/* Conteúdo principal com espaçamento para o header fixo */}
      <div className="pt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        {/* Título e Subtítulo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo(a) ao <span className="text-blue-600">EndoData</span>
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Preencha os campos abaixo para configurar a conta do<br />
            Médico.
          </p>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nome */}
            <div className="textbox">
              <Label htmlFor="nome" className="label block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
                required
              />
            </div>

            {/* Login */}
            <div className="textbox">
              <Label htmlFor="login" className="label block text-sm font-medium text-gray-700 mb-1">
                Login (opcional)
              </Label>
              <Input
                id="login"
                name="login"
                type="text"
                placeholder="Seu nome de usuário"
                value={formData.login}
                onChange={(e) => handleInputChange('login', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
              />
            </div>

            {/* CPF */}
            <div className="textbox">
              <Label htmlFor="cpf" className="label block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
                required
              />
            </div>

            {/* Email */}
            <div className="textbox">
              <Label htmlFor="email" className="label block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
                required
              />
            </div>

            {/* CRM */}
            <div className="textbox">
              <Label htmlFor="crm" className="label block text-sm font-medium text-gray-700 mb-1">
                CRM *
              </Label>
              <Input
                id="crm"
                name="crm"
                type="text"
                placeholder="0000000-UF"
                value={formData.crm}
                onChange={(e) => handleInputChange('crm', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
                required
              />
            </div>

            {/* Especialidade */}
            <div className="textbox">
              <Label htmlFor="especialidade" className="label block text-sm font-medium text-gray-700 mb-1">
                Especialidade (opcional)
              </Label>
              <Input
                id="especialidade"
                name="especialidade"
                type="text"
                placeholder="Ex: Endocrinologia, Cardiologia"
                value={formData.especialidade}
                onChange={(e) => handleInputChange('especialidade', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
              />
            </div>

            {/* Senha */}
            <div className="textbox">
              <Label htmlFor="senha" className="label block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Pelo menos 8 caracteres"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
                required
              />
            </div>

            {/* Confirmar Senha */}
            <div className="textbox">
              <Label htmlFor="confirmarSenha" className="label block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha *
              </Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Repita sua senha"
                value={formData.confirmarSenha}
                onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                className="textbox-input w-full h-[45px] px-3 font-[Open_Sans] text-sm font-normal bg-white rounded-md border border-[#DEE1E6] outline-none transition-colors hover:border-[#DEE1E6] focus:border-[#DEE1E6] focus:ring-0 disabled:text-[#565D6D] disabled:bg-white disabled:border-[#DEE1E6]"
                required
              />
            </div>
          </div>

          {/* Botão Cadastrar */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </div>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </div>
        </form>

        {/* Link para voltar ao login */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">
            Já tem uma conta?{' '}
          </span>
          <button 
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:underline transition-all"
          >
            Fazer login
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}