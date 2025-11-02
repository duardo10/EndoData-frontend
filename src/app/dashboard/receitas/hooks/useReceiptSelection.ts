/**
 * Hook customizado para gerenciar seleção múltipla de receitas
 */

import { useState } from 'react'

export function useReceiptSelection() {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([])

  /**
   * Alterna seleção de uma receita específica
   */
  function toggleSelection(receiptId: string) {
    setSelectedReceipts(prev =>
      prev.includes(receiptId)
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    )
  }

  /**
   * Seleciona todas as receitas
   */
  function selectAll(receiptIds: string[]) {
    setSelectedReceipts(receiptIds)
  }

  /**
   * Limpa todas as seleções
   */
  function clearSelection() {
    setSelectedReceipts([])
  }

  /**
   * Verifica se uma receita está selecionada
   */
  function isSelected(receiptId: string): boolean {
    return selectedReceipts.includes(receiptId)
  }

  return {
    selectedReceipts,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected
  }
}
