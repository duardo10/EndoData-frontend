import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce'

/**
 * Hook personalizado para debouncing de funções
 * 
 * @param callback - Função que será executada após o delay
 * @param delay - Tempo de delay em milissegundos
 * @param deps - Dependências que fazem o debounce ser recriado
 * 
 * @example
 * ```typescript
 * const debouncedSearch = useDebounce(
 *   (searchTerm: string) => {
 *     // Função de busca que será executada após 300ms
 *     fetchData(searchTerm)
 *   },
 *   300,
 *   [] // dependências
 * )
 * 
 * // No input:
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
) {
  const callbackRef = useRef(callback)

  // Atualiza a referência do callback
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cria função debouncada memoizada
  const debouncedCallback = useMemo(() => {
    return debounce((...args: Parameters<T>) => {
      callbackRef.current(...args)
    }, delay)
  }, [delay, ...deps])

  // Cleanup para cancelar debounce pendente
  useEffect(() => {
    return () => {
      debouncedCallback.cancel()
    }
  }, [debouncedCallback])

  return debouncedCallback
}

/**
 * Hook para debouncing de valores (mais simples)
 * 
 * @param value - Valor que será debouncado
 * @param delay - Tempo de delay em milissegundos
 * 
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
 * 
 * // debouncedSearchTerm será atualizado apenas após 300ms
 * // sem digitação no searchTerm
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}