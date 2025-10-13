/**
 * Configuração do Axios
 * 
 * @description Cliente HTTP configurado com interceptors para
 * gerenciamento de tokens, erros e refresh automático
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

/**
 * Interface para resposta de erro da API
 */
interface ApiErrorResponse {
  message: string
  statusCode: number
  error?: string
}

/**
 * Instância configurada do Axios
 */
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Request
 * Adiciona o token de autenticação em todas as requisições
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Pegar token do localStorage ou cookie
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Interceptor de Response
 * Trata erros globalmente e faz refresh de token se necessário
 */
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config

    // Erro 401 - Token expirado
    if (error.response?.status === 401 && originalRequest) {
      // Tentar refresh do token
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (refreshToken) {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          )

          localStorage.setItem('token', data.token)
          
          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.token}`
          }
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh falhou, fazer logout
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    // Erro 403 - Sem permissão
    if (error.response?.status === 403) {
      console.error('Acesso negado:', error.response.data.message)
    }

    // Erro 404 - Não encontrado
    if (error.response?.status === 404) {
      console.error('Recurso não encontrado:', error.response.data.message)
    }

    // Erro 500 - Erro do servidor
    if (error.response?.status === 500) {
      console.error('Erro interno do servidor')
    }

    return Promise.reject(error)
  }
)

/**
 * Helper para extrair mensagem de erro
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    return axiosError.response?.data?.message || axiosError.message || 'Erro desconhecido'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'Erro desconhecido'
}

export default api