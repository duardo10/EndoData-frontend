'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

/**
 * Página de Pacientes
 * 
 * @description Página para gerenciar pacientes do sistema
 * 
 * @returns {React.ReactElement} Página de pacientes
 */
export default function Pacientes(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pacientes</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Página de gerenciamento de pacientes em desenvolvimento...
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}