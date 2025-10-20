/**
 * @fileoverview Modal para edição de receita médica.
 * 
 * Componente modal responsável por permitir a edição de receitas médicas
 * existentes. Oferece formulário completo com validação e integração
 * com a API para atualização dos dados.
 * 
 * @features
 * - Formulário de edição completo
 * - Validação de campos obrigatórios
 * - Gerenciamento dinâmico de itens
 * - Atualização de status da receita
 * - Estados de loading e tratamento de erros
 * 
 * @author EndoData Team
 * @since 1.0.0
 * @version 1.0.0
 * @updated 2025-10-20
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Interface para os dados da receita a ser editada.
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
 * Interface para os itens do formulário de edição.
 */
interface EditableItem {
  id?: string
  description: string
  quantity: number
  unitPrice: string
  totalPrice: string
}

/**
 * Props do componente EditReceiptModal.
 */
interface EditReceiptModalProps {
  /** Controla se o modal está visível */
  isOpen: boolean
  /** Função chamada ao fechar o modal */
  onClose: () => void
  /** Dados da receita a ser editada */
  receipt: Receipt | null
  /** Função chamada ao salvar as alterações */
  onSave: (receiptData: any) => Promise<void>
}

/**
 * Componente modal para edição de receita médica.
 * 
 * Permite editar todos os campos de uma receita, incluindo itens,
 * status e valores. Inclui validação e cálculo automático de totais.
 * 
 * @param {EditReceiptModalProps} props - Props do componente
 * @returns {JSX.Element} Modal de edição de receita
 */
export function EditReceiptModal({ isOpen, onClose, receipt, onSave }: EditReceiptModalProps) {
  // Estados do formulário
  const [formData, setFormData] = useState({
    status: '',
    date: '',
    items: [] as EditableItem[]
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Inicializa o formulário quando a receita é carregada
  useEffect(() => {
    if (receipt) {
      setFormData({
        status: receipt.status,
        date: receipt.date.split('T')[0], // Converte para formato de data HTML
        items: receipt.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      })
    }
  }, [receipt])

  // Reset quando modal fechar
  useEffect(() => {
    if (!isOpen) {
      setError('')
      setFormData({
        status: '',
        date: '',
        items: []
      })
    }
  }, [isOpen])

  if (!isOpen || !receipt) return null

  /**
   * Atualiza um item específico do formulário.
   */
  const updateItem = (index: number, field: keyof EditableItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalcula o total do item se quantidade ou preço unitário mudaram
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity
      const unitPrice = field === 'unitPrice' ? String(value) : newItems[index].unitPrice
      const totalPrice = (quantity * parseFloat(unitPrice || '0')).toFixed(2)
      newItems[index].totalPrice = totalPrice
    }

    setFormData(prev => ({ ...prev, items: newItems }))
  }

  /**
   * Adiciona um novo item à receita.
   */
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: '0.00',
        totalPrice: '0.00'
      }]
    }))
  }

  /**
   * Remove um item da receita.
   */
  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  /**
   * Calcula o total geral da receita.
   */
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + parseFloat(item.totalPrice || '0')
    }, 0)
  }

  /**
   * Valida o formulário antes do envio.
   */
  const validateForm = () => {
    if (!formData.status) {
      setError('Status é obrigatório')
      return false
    }

    if (!formData.date) {
      setError('Data é obrigatória')
      return false
    }

    if (formData.items.length === 0) {
      setError('Pelo menos um item é obrigatório')
      return false
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i]
      if (!item.description.trim()) {
        setError(`Descrição do item ${i + 1} é obrigatória`)
        return false
      }
      if (item.quantity <= 0) {
        setError(`Quantidade do item ${i + 1} deve ser maior que zero`)
        return false
      }
      if (parseFloat(item.unitPrice) <= 0) {
        setError(`Preço unitário do item ${i + 1} deve ser maior que zero`)
        return false
      }
    }

    return true
  }

  /**
   * Submete o formulário de edição.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const updateData = {
        status: formData.status,
        date: formData.date,
        totalAmount: calculateTotal(),
        items: formData.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.totalPrice)
        }))
      }

      await onSave(updateData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar receita:', error)
      setError('Erro ao salvar receita. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Formata valores monetários para exibição.
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Receita</h2>
            <p className="text-gray-600">ID: {receipt.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Informações do Paciente (Somente Leitura) */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded">{receipt.patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded">{receipt.patient.cpf}</p>
              </div>
            </div>
          </Card>

          {/* Dados Editáveis da Receita */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados da Receita</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione o status</option>
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Itens da Receita */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Itens da Receita</h3>
              <Button
                type="button"
                onClick={addItem}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1"
                    >
                      Remover
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição *
                      </label>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Descrição do serviço/produto"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade *
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Unitário *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <span className="text-lg font-medium">
                      Total do Item: {formatCurrency(parseFloat(item.totalPrice || '0'))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Geral */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">
                  Total Geral: {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}