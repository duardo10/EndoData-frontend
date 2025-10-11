'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Edit, Download, FileText, Search, Calendar, Filter } from 'lucide-react'

/**
 * Interface para os dados de uma receita
 */
interface Receita {
  id: string
  titulo: string
  paciente: string
  medico: string
  data: string
  status: 'ativa' | 'renovada' | 'expirada'
}

/**
 * Dados mock das receitas
 */
const receitasMock: Receita[] = [
  {
    id: '1',
    titulo: 'Receita para Hipertensão',
    paciente: 'João Silva',
    medico: 'Dra. Ana Costa',
    data: '10/05/2024',
    status: 'ativa'
  },
  {
    id: '2',
    titulo: 'Prescrição de Antibiótico',
    paciente: 'Maria Oliveira',
    medico: 'Dr. Pedro Santos',
    data: '08/05/2024',
    status: 'renovada'
  },
  {
    id: '3',
    titulo: 'Receita de Rotina',
    paciente: 'Carlos Souza',
    medico: 'Dra. Laura Mendes',
    data: '01/04/2024',
    status: 'expirada'
  },
  {
    id: '4',
    titulo: 'Receita para Diabetes',
    paciente: 'Ana Pereira',
    medico: 'Dr. Ricardo Alves',
    data: '15/03/2024',
    status: 'ativa'
  },
  {
    id: '5',
    titulo: 'Receita de Antidepressivo',
    paciente: 'Pedro Lima',
    medico: 'Dr. Lucas Martins',
    data: '22/04/2024',
    status: 'ativa'
  },
  {
    id: '6',
    titulo: 'Prescrição de Analgésico',
    paciente: 'Sofia Rocha',
    medico: 'Dra. Gabriela Nunes',
    data: '05/05/2024',
    status: 'renovada'
  }
]

/**
 * Função para retornar a cor do badge baseada no status
 */
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'ativa':
      return 'bg-blue-100 text-blue-800'
    case 'renovada':
      return 'bg-green-100 text-green-800'
    case 'expirada':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Função para formatar o status para exibição
 */
const formatStatus = (status: string) => {
  switch (status) {
    case 'ativa':
      return 'Ativa'
    case 'renovada':
      return 'Renovada'
    case 'expirada':
      return 'Expirada'
    default:
      return status
  }
}

/**
 * Página de Receitas
 * 
 * @description Página para gerenciar receitas médicas
 * 
 * @returns {React.ReactElement} Página de receitas
 */
export default function Receitas(): React.ReactElement {
  const [receitas] = useState<Receita[]>(receitasMock)
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receitas Médicas</h1>
            <p className="text-gray-600">Gerencie e visualize receitas médicas do sistema</p>
          </div>
          <Button className="bg-[#2074E9] hover:bg-[#104CA0]">
            <FileText className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        </div>

        {/* Seção de Filtros */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-[#2074E9]" />
            Filtrar Receitas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Paciente</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nome do paciente"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2074E9] focus:border-[#2074E9]"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="renovada">Renovada</option>
                <option value="expirada">Expirada</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Período</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <Button className="bg-[#2074E9] hover:bg-[#104CA0]">
                Aplicar Filtros
              </Button>
              <Button variant="outline">
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de Receitas */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lista de Prescrições</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Título da Receita</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Paciente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Médico</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((receita) => (
                  <tr key={receita.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{receita.titulo}</td>
                    <td className="py-3 px-4 text-gray-600">{receita.paciente}</td>
                    <td className="py-3 px-4 text-gray-600">{receita.medico}</td>
                    <td className="py-3 px-4 text-gray-600">{receita.data}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(receita.status)}`}>
                        {formatStatus(receita.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Opções de Exportação */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Opções de Exportação</h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar para PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar para DOCX
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}