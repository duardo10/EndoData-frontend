/**
 * Utilitários para gerenciamento de status de receitas
 */

interface StatusMapping {
  [key: string]: {
    label: string
    className: string
  }
}

/**
 * Mapeamento de status internos para apresentação visual
 */
export const statusMap: StatusMapping = {
  'pending': { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  'paid': { label: 'Pago', className: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
}

/**
 * Obtém informações de status para exibição
 */
export function getStatusInfo(status: string) {
  return statusMap[status] || { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' }
}
