/**
 * Utilitário para testar conexão com o backend
 * 
 * @description Funções para validar se o backend está respondendo corretamente
 * @file src/lib/testConnection.ts
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

import React from 'react'
import { api } from '@/lib/axios'

/**
 * Interface para resposta de health check
 */
interface HealthCheckResponse {
  status: 'ok' | 'error'
  message: string
  timestamp: string
  services?: {
    database: 'connected' | 'disconnected'
    api: 'running' | 'down'
  }
}

/**
 * Testa a conexão com o backend
 * 
 * @description Realiza uma requisição GET para o endpoint de health check
 * do backend e verifica se a resposta é bem-sucedida
 * 
 * @returns {Promise<boolean>} Retorna true se conectado, false caso contrário
 * 
 * @example
 * const isConnected = await testBackendConnection()
 * if (isConnected) {
 *   console.log('Backend está online')
 * }
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await api.get<HealthCheckResponse>('/health')
    
    console.log('Backend conectado:', response.data)
    return response.data.status === 'ok'
  } catch (error) {
    console.error('Erro ao conectar com backend:', error)
    return false
  }
}

/**
 * Verifica se todas as variáveis de ambiente estão configuradas
 * 
 * @description Valida se as variáveis de ambiente essenciais estão
 * definidas e exibe um resumo da configuração atual
 * 
 * @returns {Object} Objeto contendo status da configuração e valores
 * @returns {boolean} returns.isConfigured - Se todas as variáveis essenciais estão definidas
 * @returns {Object} returns.config - Objeto com valores das variáveis de ambiente
 * 
 * @example
 * const { isConfigured, config } = checkEnvironmentConfig()
 * if (!isConfigured) {
 *   console.warn('Configuração incompleta')
 * }
 */
export function checkEnvironmentConfig() {
  const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
    debug: process.env.NEXT_PUBLIC_DEBUG,
  }

  console.log('Configuracao do ambiente:')
  console.table(config)

  const isConfigured = Boolean(config.apiUrl && config.frontendUrl)
  
  if (!isConfigured) {
    console.warn('Algumas variaveis de ambiente nao estao configuradas')
  }

  return {
    isConfigured,
    config,
  }
}

/**
 * Testa endpoints específicos
 * 
 * @description Realiza uma requisição GET para um endpoint específico
 * e verifica se a resposta é bem-sucedida
 * 
 * @param {string} endpoint - Caminho do endpoint a ser testado (ex: '/health')
 * @returns {Promise<boolean>} Retorna true se o endpoint responder, false caso contrário
 * 
 * @example
 * const isHealthy = await testEndpoint('/health')
 * const isImcAvailable = await testEndpoint('/api/imc')
 */
export async function testEndpoint(endpoint: string): Promise<boolean> {
  try {
    const response = await api.get(endpoint)
    console.log(`Endpoint ${endpoint} respondeu:`, response.status)
    return true
  } catch (error) {
    console.error(`Endpoint ${endpoint} falhou:`, error)
    return false
  }
}

/**
 * Executa todos os testes de conexão
 * 
 * @description Executa uma bateria completa de testes incluindo:
 * - Verificação de variáveis de ambiente
 * - Teste de conexão com backend
 * - Teste de endpoints específicos
 * 
 * @returns {Promise<Object>} Objeto com resultado de todos os testes
 * @returns {boolean} returns.environmentConfigured - Se ambiente está configurado
 * @returns {boolean} returns.backendConnected - Se backend está conectado
 * @returns {Array} returns.endpoints - Resultado do teste de cada endpoint
 * @returns {boolean} returns.allTestsPassed - Se todos os testes passaram
 * 
 * @example
 * const results = await runConnectionTests()
 * if (results.allTestsPassed) {
 *   console.log('Todos os testes passaram')
 * }
 */
export async function runConnectionTests() {
  console.log('Iniciando testes de conexao...\n')

  // 1. Verificar variáveis de ambiente
  const envCheck = checkEnvironmentConfig()

  // 2. Testar conexão com backend
  const backendConnected = await testBackendConnection()

  // 3. Testar endpoints específicos (ajuste conforme sua API)
  const endpointsToTest = [
    '/health',
    // '/api/imc',
    // '/api/metabolismo',
    // '/api/pacientes',
  ]

  const endpointResults = await Promise.all(
    endpointsToTest.map(async (endpoint) => ({
      endpoint,
      status: await testEndpoint(endpoint),
    }))
  )

  const results = {
    environmentConfigured: envCheck.isConfigured,
    backendConnected,
    endpoints: endpointResults,
    allTestsPassed: 
      envCheck.isConfigured && 
      backendConnected && 
      endpointResults.every(r => r.status),
  }

  console.log('\nResultado dos testes:')
  console.table(results)

  return results
}

/**
 * Hook para usar em componentes React
 * 
 * @description Hook React que fornece funcionalidades de teste de conexão
 * com estados de loading e resultado
 * 
 * @returns {Object} Objeto com estados e função de teste
 * @returns {boolean|null} returns.isConnected - Estado da conexão (null = não testado)
 * @returns {boolean} returns.isLoading - Se está testando no momento
 * @returns {Function} returns.testConnection - Função para executar o teste
 * 
 * @example
 * const { isConnected, isLoading, testConnection } = useConnectionTest()
 * 
 * useEffect(() => {
 *   testConnection()
 * }, [])
 */
export function useConnectionTest() {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    const connected = await testBackendConnection()
    setIsConnected(connected)
    setIsLoading(false)
    return connected
  }

  return {
    isConnected,
    isLoading,
    testConnection,
  }
}

/**
 * Exportação default com todas as funções utilitárias
 * 
 * @description Objeto contendo todas as funções de teste de conexão
 * para uso via importação default
 */
export default {
  testBackendConnection,
  checkEnvironmentConfig,
  testEndpoint,
  runConnectionTests,
}