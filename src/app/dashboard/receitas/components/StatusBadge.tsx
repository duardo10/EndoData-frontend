/**
 * Componente de Badge de Status para receitas
 */

import React from 'react'
import { getStatusInfo } from '../utils/statusHelpers'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusInfo = getStatusInfo(status)
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
      {statusInfo.label}
    </span>
  )
}
