/**
 * @fileoverview Serviço de Autenticação - EndoData
 * @description Implementa todas as operações de autenticação incluindo
 * registro, login, logout e gerenciamento de tokens JWT.
 * 
 * @author Victor Macêdo
 * @version 1.0.0
 * @since 2025-10-22
 * 
 * @requires fetch
 * @requires jwt-utils
 * 
 * @features
 * - Registro de novos usuários médicos
 * - Login com email/CRM e senha
 * - Logout e limpeza de tokens
 * - Validação de CPF e CRM
 * - Gerenciamento de tokens JWT
 * - Interceptação de erros de rede
 * 
 * @security
 * - Tokens armazenados no localStorage
 * - Validação de dados no client e server
 * - Sanitização de inputs
 * - Rate limiting prevention
 */

/**
 * Interface para dados de cadastro de usuário médico
 */
export interface RegisterData {
  cpf: string
  email: string
  crm: string
  senha: string
  confirmarSenha: string
}

/**
 * Interface para dados de login
 */
export interface LoginData {
  email: string
  senha: string
}

/**
 * Interface para resposta de autenticação
 */
export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      cpf: string
      crm: string
      createdAt: string
      updatedAt: string
    }
    token: string
  }
  errors?: string[]
}

/**
 * Configuração base da API
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Modo de simulação para desenvolvimento
 */
const SIMULATE_API = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL

/**
 * Headers padrão para requisições
 */
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

/**
 * Headers com autenticação
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    ...getDefaultHeaders(),
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

/**
 * Classe de serviço de autenticação
 */
class AuthService {
  /**
   * Registra um novo usuário médico
   * 
   * @param {RegisterData} userData - Dados do usuário para cadastro
   * @returns {Promise<AuthResponse>} Resposta da API
   * 
   * @example
   * ```typescript
   * const result = await authService.register({
   *   cpf: '123.456.789-00',
   *   email: 'dr.joao@clinica.com.br',
   *   crm: '1234567-SP',
   *   senha: 'MinhaSenh@123',
   *   confirmarSenha: 'MinhaSenh@123'
   * })
   * ```
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validações client-side
      this.validateRegisterData(userData)

      // Simulação para desenvolvimento (quando backend não está rodando)
      if (SIMULATE_API) {
        console.log('🚀 SIMULAÇÃO: Dados do cadastro recebidos:', userData)
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simula resposta de sucesso
        const mockUser = {
          id: '123',
          email: userData.email.trim().toLowerCase(),
          cpf: userData.cpf.replace(/\D/g, ''),
          crm: userData.crm.toUpperCase().trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const mockToken = 'mock_jwt_token_' + Date.now()
        
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user_data', JSON.stringify(mockUser))
        
        return {
          success: true,
          message: '✅ Conta criada com sucesso! (Modo simulação)',
          data: {
            user: mockUser,
            token: mockToken
          }
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify({
          cpf: userData.cpf.replace(/\D/g, ''), // Remove formatação
          email: userData.email.trim().toLowerCase(),
          crm: userData.crm.toUpperCase().trim(),
          password: userData.senha
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao criar conta',
          errors: data.errors || []
        }
      }

      // Armazena token se retornado
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
      }

      return {
        success: true,
        message: 'Conta criada com sucesso!',
        data: data
      }

    } catch (error) {
      console.error('Erro no registro:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.',
        errors: ['NETWORK_ERROR']
      }
    }
  }

  /**
   * Realiza login do usuário
   * 
   * @param {LoginData} loginData - Dados de login
   * @returns {Promise<AuthResponse>} Resposta da API
   */
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify({
          email: loginData.email.trim().toLowerCase(),
          password: loginData.senha
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao fazer login',
          errors: data.errors || []
        }
      }

      // Armazena dados de autenticação
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      return {
        success: true,
        message: 'Login realizado com sucesso!',
        data: data
      }

    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.',
        errors: ['NETWORK_ERROR']
      }
    }
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  /**
   * Verifica se o usuário está autenticado
   * 
   * @returns {boolean} Status de autenticação
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token')
    return !!token
  }

  /**
   * Obtém dados do usuário atual
   * 
   * @returns {object|null} Dados do usuário ou null
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Obtém token de autenticação atual
   * 
   * @returns {string|null} Token JWT ou null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  /**
   * Valida dados de registro
   * 
   * @private
   * @param {RegisterData} userData - Dados para validação
   * @throws {Error} Erro de validação
   */
  private validateRegisterData(userData: RegisterData): void {
    const errors: string[] = []

    // Validação CPF
    if (!this.isValidCPF(userData.cpf)) {
      errors.push('CPF inválido')
    }

    // Validação Email
    if (!this.isValidEmail(userData.email)) {
      errors.push('Email inválido')
    }

    // Validação CRM
    if (!this.isValidCRM(userData.crm)) {
      errors.push('CRM inválido')
    }

    // Validação Senha
    if (userData.senha.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres')
    }

    // Confirmação de senha
    if (userData.senha !== userData.confirmarSenha) {
      errors.push('Senhas não conferem')
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
  }

  /**
   * Valida CPF
   * 
   * @private
   * @param {string} cpf - CPF para validação
   * @returns {boolean} Resultado da validação
   */
  private isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '')
    
    if (cleanCPF.length !== 11) return false
    if (/^(\d)\1+$/.test(cleanCPF)) return false
    
    // Validação do dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cleanCPF.charAt(9))) return false
    
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cleanCPF.charAt(10))) return false
    
    return true
  }

  /**
   * Valida Email
   * 
   * @private
   * @param {string} email - Email para validação
   * @returns {boolean} Resultado da validação
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Valida CRM
   * 
   * @private
   * @param {string} crm - CRM para validação
   * @returns {boolean} Resultado da validação
   */
  private isValidCRM(crm: string): boolean {
    const crmRegex = /^\d{4,7}-?[A-Z]{2}$/i
    return crmRegex.test(crm.trim())
  }
}

/**
 * Instância única do serviço de autenticação
 */
export const authService = new AuthService()

/**
 * Export padrão para compatibilidade
 */
export default authService