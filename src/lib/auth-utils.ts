/**
 * @fileoverview Utilitários específicos para autenticação e gerenciamento de estado
 * @description Este arquivo contém funções auxiliares para autenticação,
 * validação e manipulação de dados específicos da aplicação EndoData.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

import { LoginCredentials, AuthResponse, ApiError } from '@/types'

/**
 * Valida formato de email usando regex
 * 
 * @description Verifica se o email fornecido está em formato válido
 * usando expressão regular que segue o padrão RFC 5322 simplificado.
 * 
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se o email for válido, false caso contrário
 * 
 * @example
 * ```typescript
 * isValidEmail("user@example.com")    // true
 * isValidEmail("invalid-email")       // false
 * isValidEmail("test@domain")         // false
 * isValidEmail("@domain.com")         // false
 * ```
 * 
 * @since 1.0.0
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida força da senha baseada em critérios de segurança
 * 
 * @description Verifica se a senha atende aos critérios mínimos de segurança:
 * - Pelo menos 8 caracteres
 * - Contém pelo menos 1 letra maiúscula
 * - Contém pelo menos 1 letra minúscula
 * - Contém pelo menos 1 número
 * - Contém pelo menos 1 caractere especial
 * 
 * @param {string} password - Senha a ser validada
 * @returns {object} Objeto com resultado da validação e detalhes
 * 
 * @example
 * ```typescript
 * validatePassword("Senha123!")
 * // Retorna: { isValid: true, errors: [] }
 * 
 * validatePassword("123")
 * // Retorna: { 
 * //   isValid: false, 
 * //   errors: ["Muito curta", "Sem maiúscula", "Sem minúscula", "Sem especial"]
 * // }
 * ```
 * 
 * @since 1.0.0
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("Deve ter pelo menos 8 caracteres")
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Deve conter pelo menos 1 letra maiúscula")
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Deve conter pelo menos 1 letra minúscula")
  }
  
  if (!/\d/.test(password)) {
    errors.push("Deve conter pelo menos 1 número")
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Deve conter pelo menos 1 caractere especial")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Formata mensagens de erro da API para exibição ao usuário
 * 
 * @description Converte erros técnicos da API em mensagens amigáveis
 * para o usuário final, mantendo informações técnicas para logs.
 * 
 * @param {ApiError | Error | unknown} error - Erro a ser formatado
 * @returns {string} Mensagem de erro formatada para o usuário
 * 
 * @example
 * ```typescript
 * const apiError: ApiError = {
 *   message: "Validation failed",
 *   code: "INVALID_EMAIL",
 *   details: { field: "email" }
 * }
 * 
 * formatErrorMessage(apiError)
 * // Retorna: "Email inválido. Verifique e tente novamente."
 * ```
 * 
 * @since 1.0.0
 */
export function formatErrorMessage(error: ApiError | Error | unknown): string {
  // Se for um ApiError estruturado
  if (error && typeof error === 'object' && 'code' in error) {
    const apiError = error as ApiError
    
    switch (apiError.code) {
      case 'INVALID_EMAIL':
        return 'Email inválido. Verifique e tente novamente.'
      case 'INVALID_PASSWORD':
        return 'Senha incorreta. Tente novamente.'
      case 'USER_NOT_FOUND':
        return 'Usuário não encontrado.'
      case 'ACCOUNT_LOCKED':
        return 'Conta temporariamente bloqueada. Tente mais tarde.'
      case 'NETWORK_ERROR':
        return 'Erro de conexão. Verifique sua internet.'
      default:
        return apiError.message || 'Erro inesperado. Tente novamente.'
    }
  }
  
  // Se for um Error padrão
  if (error instanceof Error) {
    return error.message
  }
  
  // Fallback para erros não estruturados
  return 'Erro inesperado. Tente novamente.'
}

/**
 * Sanitiza dados de entrada removendo caracteres perigosos
 * 
 * @description Remove ou escapa caracteres que podem causar problemas
 * de segurança (XSS) ou formatação incorreta.
 * 
 * @param {string} input - String a ser sanitizada
 * @returns {string} String sanitizada
 * 
 * @example
 * ```typescript
 * sanitizeInput("<script>alert('xss')</script>")
 * // Retorna: "&lt;script&gt;alert('xss')&lt;/script&gt;"
 * 
 * sanitizeInput("Nome do Usuário")
 * // Retorna: "Nome do Usuário"
 * ```
 * 
 * @since 1.0.0
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Debounce para otimizar performance em inputs
 * 
 * @description Atrasa a execução de uma função até que ela pare de ser
 * chamada por um determinado período, útil para validações em tempo real.
 * 
 * @template T - Tipo da função a ser "debouncificada"
 * @param {T} func - Função a ser executada após o delay
 * @param {number} delay - Tempo em millisegundos para aguardar
 * @returns {Function} Função debounced
 * 
 * @example
 * ```typescript
 * const debouncedValidation = debounce((email: string) => {
 *   console.log('Validating email:', email)
 * }, 300)
 * 
 * // Será executado apenas após parar de digitar por 300ms
 * debouncedValidation('user@example.com')
 * ```
 * 
 * @since 1.0.0
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Gerencia tokens de autenticação no localStorage
 * 
 * @description Utilitários para armazenar, recuperar e limpar tokens
 * de autenticação de forma segura no navegador.
 * 
 * @namespace AuthTokens
 * @since 1.0.0
 */
export const AuthTokens = {
  /**
   * Armazena token de autenticação no localStorage
   * 
   * @param {string} token - Token JWT a ser armazenado
   * @param {string} expiresAt - Data/hora de expiração do token
   * 
   * @example
   * ```typescript
   * AuthTokens.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', '2025-01-02T00:00:00.000Z')
   * ```
   */
  setToken(token: string, expiresAt: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_token_expires', expiresAt)
    }
  },

  /**
   * Recupera token de autenticação do localStorage
   * 
   * @returns {string | null} Token se válido e não expirado, null caso contrário
   * 
   * @example
   * ```typescript
   * const token = AuthTokens.getToken()
   * if (token) {
   *   // Usuário autenticado
   * }
   * ```
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    const token = localStorage.getItem('auth_token')
    const expiresAt = localStorage.getItem('auth_token_expires')
    
    if (!token || !expiresAt) return null
    
    // Verifica se o token expirou
    if (new Date() > new Date(expiresAt)) {
      this.clearToken()
      return null
    }
    
    return token
  },

  /**
   * Remove token de autenticação do localStorage
   * 
   * @example
   * ```typescript
   * // Logout do usuário
   * AuthTokens.clearToken()
   * ```
   */
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_token_expires')
    }
  },

  /**
   * Verifica se existe um token válido
   * 
   * @returns {boolean} True se existe token válido, false caso contrário
   */
  hasValidToken(): boolean {
    return this.getToken() !== null
  }
}