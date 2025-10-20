/**
 * @fileoverview Modal para visualização de receita médica.
 * 
 * Componente modal responsável por exibir detalhes completos de uma receita
 * médica em modo somente leitura. Apresenta informações organizadas em
 * seções para facilitar a visualização e compreensão dos dados.
 * 
 * @features
 * - Visualização completa dos dados da receita
 * - Informações do paciente e médico
 * - Lista detalhada de itens/serviços
 * - Status visual da receita
 * - Design responsivo e acessível
 * 
 * @author EndoData Team
 * @since 1.0.0
 * @version 1.0.0
 * @updated 2025-10-20
 */

'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Interface para os dados da receita a ser visualizada.
 */
interface Receipt {
  id: string
  patientId: string
  userId: string
  totalAmount: number
  status: string
  date: string
  updatedAt: string
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: string
    totalPrice: string
  }>
  patient: {
    id: string
    name: string
    cpf: string
    email: string
    phone: string
    birthDate: string
    gender: string
  }
  user: {
    id: string
    name: string
    email: string
    crm: string
    especialidade?: string
  }
}

/**
 * Props do componente ViewReceiptModal.
 */
interface ViewReceiptModalProps {
  /** Controla se o modal está visível */
  isOpen: boolean
  /** Função chamada ao fechar o modal */
  onClose: () => void
  /** Dados da receita a ser visualizada */
  receipt: Receipt | null
}

/**
 * Componente modal para visualização de receita médica.
 * 
 * Exibe todos os detalhes de uma receita de forma organizada e clara,
 * incluindo informações do paciente, médico, itens da receita e status.
 * 
 * @param {ViewReceiptModalProps} props - Props do componente
 * @returns {JSX.Element} Modal de visualização de receita
 */
export function ViewReceiptModal({ isOpen, onClose, receipt }: ViewReceiptModalProps) {
  if (!isOpen || !receipt) return null

  /**
   * Gera badge visual para o status da receita.
   */
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'paid': { label: 'Pago', className: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: 'Pendente', 
      className: 'bg-yellow-100 text-yellow-800' 
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  /**
   * Formata valores monetários para exibição.
   */
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  /**
   * Formata data para exibição em português.
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalhes da Receita</h2>
            <p className="text-gray-600">ID: {receipt.id}</p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge(receipt.status)}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 space-y-6">
          {/* Informações Gerais */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data da Receita</label>
                <p className="mt-1 text-gray-900">{formatDate(receipt.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Última Atualização</label>
                <p className="mt-1 text-gray-900">{formatDate(receipt.updatedAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor Total</label>
                <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(receipt.totalAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(receipt.status)}</div>
              </div>
            </div>
          </Card>

          {/* Informações do Paciente */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <p className="mt-1 text-gray-900">{receipt.patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <p className="mt-1 text-gray-900">{receipt.patient.cpf}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-gray-900">{receipt.patient.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <p className="mt-1 text-gray-900">{receipt.patient.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <p className="mt-1 text-gray-900">
                  {new Date(receipt.patient.birthDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gênero</label>
                <p className="mt-1 text-gray-900">
                  {receipt.patient.gender === 'male' ? 'Masculino' : 'Feminino'}
                </p>
              </div>
            </div>
          </Card>

          {/* Informações do Médico */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Médico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Médico</label>
                <p className="mt-1 text-gray-900">{receipt.user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CRM</label>
                <p className="mt-1 text-gray-900">{receipt.user.crm}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-gray-900">{receipt.user.email}</p>
              </div>
              {receipt.user.especialidade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Especialidade</label>
                  <p className="mt-1 text-gray-900">{receipt.user.especialidade}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Itens da Receita */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Itens da Receita</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Quantidade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Valor Unitário</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{item.description}</td>
                      <td className="py-3 px-4 text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-gray-900">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="py-3 px-4 text-right font-semibold text-gray-900">
                      Total Geral:
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-bold text-lg">
                      {formatCurrency(receipt.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Rodapé do Modal */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6"
          >
            Fechar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
        </div>
      </div>
    </div>
  )
}