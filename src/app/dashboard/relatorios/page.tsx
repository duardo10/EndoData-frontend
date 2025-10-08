'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

/**
 * Página de Relatórios
 * 
 * @description Página para visualizar relatórios e estatísticas
 * 
 * @returns {React.ReactElement} Página de relatórios
 */
export default function Relatorios(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Relatórios</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Página de relatórios e estatísticas em desenvolvimento...
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}