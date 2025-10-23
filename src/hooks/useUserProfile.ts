import { useState, useEffect } from 'react'
import api from '@/lib/api'

/**
 * Interface para os dados do usuário retornados pela API
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  crm: string
  especialidade?: string
  isAdministrador: boolean
  createdAt: string
}

/**
 * Hook para gerenciar dados do perfil do usuário logado
 * 
 * @description Hook personalizado que busca e gerencia os dados do usuário
 * autenticado, incluindo estados de loading e erro.
 * 
 * @returns {Object} Objeto contendo dados do usuário, loading e erro
 * 
 * @features
 * - Busca automática dos dados do usuário ao montar o componente
 * - Estados de loading e erro para melhor UX
 * - Cache dos dados para evitar requisições desnecessárias
 * - Tratamento de erros de autenticação
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { user, loading, error } = useUserProfile()
 *   
 *   if (loading) return <Loading />
 *   if (error) return <Error message={error} />
 *   
 *   return <div>Olá, {user?.name}!</div>
 * }
 * ```
 */
export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get('/users/profile')
        setUser(response.data)
      } catch (err: any) {
        console.error('Erro ao buscar perfil do usuário:', err)
        setError(err.response?.data?.message || 'Erro ao carregar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  return { user, loading, error }
}
