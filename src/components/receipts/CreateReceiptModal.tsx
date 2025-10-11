'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, X } from 'lucide-react'
import { CreateReceiptInput, CreateReceiptItemInput, ReceiptStatus } from '@/types/receipt'

interface Patient {
  id: string
  name: string
  email: string
  cpf?: string
}

interface CreateReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (receipt: CreateReceiptInput) => Promise<void>
  loading?: boolean
}

export function CreateReceiptModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CreateReceiptModalProps) {
  const [formData, setFormData] = useState<CreateReceiptInput>({
    patientId: '',
    status: ReceiptStatus.PENDING,
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  })
  const [patients, setPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)

  // Simular carregamento de pacientes (substituir por chamada real da API)
  useEffect(() => {
    const mockPatients: Patient[] = [
      { id: '3041a16e-8023-45a3-be41-96d5170d0644', name: 'João da Silva', email: 'joao.silva@email.com', cpf: '11144477735' },
      { id: 'patient-2', name: 'Maria Santos', email: 'maria@email.com', cpf: '222.333.444-55' },
      { id: 'patient-3', name: 'Pedro Costa', email: 'pedro@email.com', cpf: '333.444.555-66' }
    ]
    
    setTimeout(() => {
      setPatients(mockPatients)
      setLoadingPatients(false)
    }, 500)
  }, [])

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const updateItem = (index: number, field: keyof CreateReceiptItemInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const getTotalAmount = () => {
    return formData.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.patientId || formData.items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        patientId: '',
        status: ReceiptStatus.PENDING,
        items: [{ description: '', quantity: 1, unitPrice: 0 }]
      })
      onClose()
    } catch (error) {
      console.error('Erro ao criar receita:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      status: ReceiptStatus.PENDING,
      items: [{ description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Nova Receita Médica</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              resetForm()
              onClose()
            }}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção do Paciente */}
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente *</Label>
            <select
              id="patient"
              value={formData.patientId}
              onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              disabled={loadingPatients}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{loadingPatients ? "Carregando..." : "Selecione um paciente"}</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.cpf})
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ReceiptStatus }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ReceiptStatus.PENDING}>Pendente</option>
              <option value={ReceiptStatus.PAID}>Pago</option>
              <option value={ReceiptStatus.CANCELLED}>Cancelado</option>
            </select>
          </div>

          {/* Itens da Receita */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Itens da Receita *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <Label htmlFor={`description-${index}`}>Descrição *</Label>
                    <Input
                      id={`description-${index}`}
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Ex: Consulta médica"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`quantity-${index}`}>Quantidade *</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`unitPrice-${index}`}>Valor Unitário (R$) *</Label>
                    <Input
                      id={`unitPrice-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="text-right text-sm text-gray-600">
                  Subtotal: R$ {(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="text-right text-lg font-semibold">
              Total: R$ {getTotalAmount().toFixed(2)}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm()
                onClose()
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Receita'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}