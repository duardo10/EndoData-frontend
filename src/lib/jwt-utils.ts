/**
 * Utilitário para trabalhar com tokens JWT
 * 
 * @description Funções auxiliares para decodificar e extrair informações
 * dos tokens JWT utilizados na aplicação.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

interface JWTPayload {
  sub: string  // userId
  email: string
  name: string
  isAdministrador: boolean
  iat: number
  exp: number
}

/**
 * Decodifica um token JWT e retorna o payload
 * @param token - Token JWT
 * @returns Payload decodificado ou null se inválido
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // Remove o prefixo "Bearer " se presente
    const cleanToken = token.replace('Bearer ', '')
    
    // Separa as partes do token
    const parts = cleanToken.split('.')
    if (parts.length !== 3) {
      console.error('Token JWT inválido: número incorreto de partes')
      return null
    }
    
    // Decodifica o payload (segunda parte)
    const payload = parts[1]
    
    // Converte base64url para base64 padrão
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    
    // Adiciona padding se necessário
    while (base64.length % 4) {
      base64 += '='
    }
    
    // Decodifica de base64 usando uma abordagem mais robusta
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(decoded) as JWTPayload
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error)
    return null
  }
}

/**
 * Extrai o userId do token JWT armazenado
 * @returns userId ou null se não encontrado
 */
export function getCurrentUserId(): string | null {
  try {
    const token = localStorage.getItem('auth_token') // Volta para 'auth_token'
    if (!token) {
      return null
    }
    
    const payload = decodeJWT(token)
    return payload?.sub || null
  } catch (error) {
    console.error('Erro ao extrair userId:', error)
    return null
  }
}

/**
 * Extrai informações completas do usuário do token JWT
 * @returns Informações do usuário ou null se não encontrado
 */
export function getCurrentUser(): JWTPayload | null {
  try {
    const token = localStorage.getItem('auth_token') // Volta para 'auth_token'
    if (!token) {
      return null
    }
    
    return decodeJWT(token)
  } catch (error) {
    console.error('Erro ao extrair informações do usuário:', error)
    return null
  }
}