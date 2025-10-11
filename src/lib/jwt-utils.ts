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
      return null
    }
    
    // Decodifica o payload (segunda parte)
    const payload = parts[1]
    
    // Adiciona padding se necessário
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
    
    // Decodifica de base64
    const decoded = atob(paddedPayload)
    
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
    const token = localStorage.getItem('auth_token')
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
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return null
    }
    
    return decodeJWT(token)
  } catch (error) {
    console.error('Erro ao extrair informações do usuário:', error)
    return null
  }
}