'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * Provider React Query para cache e gerenciamento de estado
 * 
 * @description Configura o QueryClient com otimizações para reduzir
 * requests desnecessários e melhorar a performance da aplicação
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos (dados considerados válidos)
            staleTime: 5 * 60 * 1000,
            // Mantém em cache por 10 minutos (gcTime = garbage collection time)
            gcTime: 10 * 60 * 1000,
            // Não refetch automático ao focar janela
            refetchOnWindowFocus: false,
            // Não refetch automático ao reconectar
            refetchOnReconnect: false,
            // Retry apenas 1x em caso de erro
            retry: 1,
            // Não refetch automático ao montar
            refetchOnMount: false,
          },
          mutations: {
            // Retry automático para mutations em caso de erro de rede
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}