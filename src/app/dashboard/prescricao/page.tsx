'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

/**
 * Página de Prescrições
 * 
 * @description Página para gerenciar prescrições médicas
 * 
 * @returns {React.ReactElement} Página de prescrições
 */
export default function Prescricao(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Prescrições</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Página de gerenciamento de prescrições em desenvolvimento...
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}