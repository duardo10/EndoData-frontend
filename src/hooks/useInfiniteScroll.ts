/**
 * @fileoverview Hook para implementar scroll infinito.
 * 
 * Este hook detecta quando o usuário atinge o final de um elemento
 * scrollável e dispara uma callback para carregar mais dados.
 * Inclui throttling para evitar chamadas excessivas.
 * 
 * @features
 * - Detecção de fim de scroll
 * - Throttling para performance
 * - Suporte a diferentes elementos scroll
 * - Estados de loading e fim de dados
 * 
 * @author EndoData Team
 * @since 1.0.0
 * @version 1.0.0
 * @updated 2025-10-20
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Opções de configuração do hook de scroll infinito.
 */
interface UseInfiniteScrollOptions {
  /** Distância em pixels do final antes de disparar o carregamento (padrão: 100px) */
  threshold?: number
  /** Se o carregamento está ativo no momento */
  loading?: boolean
  /** Se não há mais dados para carregar */
  hasMore?: boolean
  /** Elemento raiz para observar o scroll (padrão: window) */
  root?: Element | null
}

/**
 * Hook personalizado para implementar scroll infinito.
 * 
 * Monitora o scroll de um elemento e executa uma callback quando
 * o usuário se aproxima do final, permitindo carregamento incremental
 * de dados de forma performática.
 * 
 * @param {() => void} onLoadMore - Função callback para carregar mais dados
 * @param {UseInfiniteScrollOptions} options - Opções de configuração
 * @returns {React.RefObject<HTMLElement>} - Ref para anexar ao elemento que será monitorado
 * 
 * @example
 * ```typescript
 * function InfiniteList() {
 *   const [data, setData] = useState([])
 *   const [loading, setLoading] = useState(false)
 *   const [hasMore, setHasMore] = useState(true)
 * 
 *   const loadMore = useCallback(async () => {
 *     setLoading(true)
 *     const newData = await fetchMoreData()
 *     setData(prev => [...prev, ...newData])
 *     setHasMore(newData.length > 0)
 *     setLoading(false)
 *   }, [])
 * 
 *   const scrollRef = useInfiniteScroll(loadMore, {
 *     loading,
 *     hasMore,
 *     threshold: 50
 *   })
 * 
 *   return (
 *     <div ref={scrollRef} style={{ maxHeight: '400px', overflow: 'auto' }}>
 *       {data.map(item => <div key={item.id}>{item.name}</div>)}
 *       {loading && <div>Carregando...</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 100,
    loading = false,
    hasMore = true,
    root = null
  } = options

  // Ref para o elemento que será monitorado
  const elementRef = useRef<HTMLElement>(null)
  
  // Throttle para evitar chamadas excessivas
  const throttleRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Função throttled para verificar scroll.
   * Limita a frequência de verificações para melhor performance.
   */
  const throttledScrollCheck = useCallback(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current)
    }

    throttleRef.current = setTimeout(() => {
      if (loading || !hasMore) return

      // Usa o próprio elemento como container se root for null
      const scrollContainer = root || elementRef.current || window

      let scrollTop: number
      let scrollHeight: number
      let clientHeight: number

      if (scrollContainer === window) {
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        scrollHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        )
        clientHeight = window.innerHeight
      } else {
        const container = scrollContainer as Element
        scrollTop = container.scrollTop
        scrollHeight = container.scrollHeight
        clientHeight = container.clientHeight
      }

      // Verifica se está próximo do final
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
      
      if (distanceFromBottom <= threshold) {
        console.log('🔄 Scroll infinito na tabela: Carregando mais dados...', {
          distanceFromBottom,
          threshold,
          scrollTop,
          scrollHeight,
          clientHeight,
          containerType: scrollContainer === window ? 'window' : 'element'
        })
        onLoadMore()
      }
    }, 100) // Throttle de 100ms
  }, [loading, hasMore, threshold, onLoadMore, root])

  /**
   * Effect para configurar e limpar listeners de scroll.
   */
  useEffect(() => {
    // Usa o próprio elemento como container de scroll se root for null
    const scrollContainer = root || elementRef.current || window
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', throttledScrollCheck, { passive: true })
      
      // Verificação inicial caso já esteja no final
      throttledScrollCheck()
      
      return () => {
        scrollContainer.removeEventListener('scroll', throttledScrollCheck)
        if (throttleRef.current) {
          clearTimeout(throttleRef.current)
        }
      }
    }
  }, [throttledScrollCheck, root, elementRef.current])

  return elementRef
}

/**
 * Hook alternativo para scroll infinito usando Intersection Observer.
 * Mais performático para casos onde você tem um elemento sentinela.
 * 
 * @param {() => void} onLoadMore - Função callback para carregar mais dados
 * @param {UseInfiniteScrollOptions} options - Opções de configuração
 * @returns {React.RefObject<HTMLElement>} - Ref para anexar ao elemento sentinela
 * 
 * @example
 * ```typescript
 * function InfiniteListWithSentinel() {
 *   const [data, setData] = useState([])
 *   const [loading, setLoading] = useState(false)
 *   const [hasMore, setHasMore] = useState(true)
 * 
 *   const loadMore = useCallback(async () => {
 *     if (loading) return
 *     setLoading(true)
 *     const newData = await fetchMoreData()
 *     setData(prev => [...prev, ...newData])
 *     setHasMore(newData.length > 0)
 *     setLoading(false)
 *   }, [loading])
 * 
 *   const sentinelRef = useInfiniteScrollWithObserver(loadMore, {
 *     loading,
 *     hasMore
 *   })
 * 
 *   return (
 *     <div>
 *       {data.map(item => <div key={item.id}>{item.name}</div>)}
 *       <div ref={sentinelRef} style={{ height: '1px' }} />
 *       {loading && <div>Carregando...</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useInfiniteScrollWithObserver(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { loading = false, hasMore = true, threshold = 0 } = options
  const sentinelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || loading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading && hasMore) {
          console.log('🔄 Intersection Observer: Carregando mais dados...')
          onLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, loading, hasMore, threshold])

  return sentinelRef
}

export default useInfiniteScroll