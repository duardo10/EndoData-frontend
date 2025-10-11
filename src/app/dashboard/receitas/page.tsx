'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Edit, Download, FileText, Search, Calendar, Filter, Loader2, Trash2, Plus } from 'lucide-react'
import { useReceitas } from '@/hooks/useReceitas'
import { ReceiptStatus, StatusDisplayMap, StatusColorMap } from '@/types/receipt'
import { CreateReceiptModal } from '@/components/receipts/CreateReceiptModal'

export default function ReceitasPage() {
  const {
    receipts,
    loading,
    error,
    currentPage,
    totalPages,
    totalReceipts,
    filters,
    updateFilters,
    refreshReceipts,
    createReceipt,
    deleteReceipt,
    exportToPDF,
    exportToExcel
  } = useReceitas()

  const [showFilters, setShowFilters] = useState(false)
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Handle export to PDF - usar o método do hook que exporta todas as receitas filtradas
  const handleExportToPDF = async () => {
    try {
      await exportToPDF()
      console.log('Receitas exportadas para PDF com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar receitas:', error)
    }
  }

  // Handle bulk export - usar o método do hook para exportar CSV
  const handleBulkExport = async () => {
    if (selectedReceipts.length === 0) {
      console.warn('Selecione pelo menos uma receita para exportar')
      return
    }
    
    try {
      await exportToExcel()
      console.log('Receitas exportadas com sucesso!')
      setSelectedReceipts([])
    } catch (error) {
      console.error('Erro ao exportar receitas:', error)
    }
  }

  // Handle delete
  const handleDelete = async (receiptId: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      await deleteReceipt(receiptId)
    }
  }

  // Toggle receipt selection
  const toggleReceiptSelection = (receiptId: string) => {
    setSelectedReceipts(prev => 
      prev.includes(receiptId) 
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    )
  }

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Get status badge classes
  const getStatusBadgeClass = (status: ReceiptStatus) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium'
    const colorClass = StatusColorMap[status] || 'bg-gray-100 text-gray-800'
    return `${baseClass} ${colorClass}`
  }

  // Handle filter updates
  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  if (error && (error.fetch || error.update || error.delete)) {
    const errorMessage = error.fetch || error.update || error.delete || 'Erro desconhecido'
    
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar receitas</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Button onClick={refreshReceipts} className="bg-[#2074E9] hover:bg-[#104CA0]">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Handle create receipt
  const handleCreateReceipt = async (receiptData: any) => {
    try {
      await createReceipt(receiptData)
      // Refresh the list to show the new receipt
      await refreshReceipts()
    } catch (error) {
      console.error('Erro ao criar receita:', error)
      throw error
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receitas Médicas</h1>
            <p className="text-gray-600">
              Gerencie e visualize receitas médicas do sistema ({totalReceipts} receitas)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#2074E9] hover:bg-[#104CA0] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
          </div>
        </div>

        {/* Seção de Filtros */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter className="w-5 h-5 mr-2 text-[#2074E9]" />
              Filtrar Receitas
            </h2>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm"
            >
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Período</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2074E9] focus:border-[#2074E9]"
                  value={filters.period || ''}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                >
                  <option value="">Selecionar período</option>
                  <option value="day">Hoje</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mês</option>
                  <option value="year">Este ano</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data Inicial</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data Final</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2074E9] focus:border-[#2074E9]"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Todos os status</option>
                  {Object.entries(StatusDisplayMap).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Ações em lote */}
        {selectedReceipts.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedReceipts.length} receita(s) selecionada(s)
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Selecionadas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReceipts([])}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Receitas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Lista de Receitas</h2>
            {loading && (
              <div className="flex items-center text-sm text-gray-600">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando...
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReceipts(receipts.map(r => r.id))
                        } else {
                          setSelectedReceipts([])
                        }
                      }}
                      checked={selectedReceipts.length === receipts.length && receipts.length > 0}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Paciente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Médico</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data de Emissão</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Itens</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedReceipts.includes(receipt.id)}
                        onChange={() => toggleReceiptSelection(receipt.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{receipt.patient?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">ID: {receipt.patientId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{receipt.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(receipt.date)}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(receipt.status)}>
                        {StatusDisplayMap[receipt.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {receipt.items?.length || 0} item(s)
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleExportToPDF()}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(receipt.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {receipts.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma receita encontrada</p>
              </div>
            )}
          </div>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages} ({totalReceipts} receitas no total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Opções de Exportação */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Opções de Exportação</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBulkExport}
              disabled={selectedReceipts.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Selecionadas para PDF
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => exportToExcel()}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Todas (CSV)
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Create Receipt Modal */}
      <CreateReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReceipt}
      />
    </DashboardLayout>
  )
}