'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, X } from 'lucide-react'
import { CreateReceiptInput, CreateReceiptItemInput, ReceiptStatus } from '@/types/receipt'
import { PatientService, Patient as PatientType } from '@/services/patientService'

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
  // Autocomplete patient search states
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<PatientType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(null);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSearchTerm && !selectedPatient) {
        searchPatients(patientSearchTerm);
        setShowPatientDropdown(true);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm, selectedPatient]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.patient-autocomplete')) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search patients from API
  const searchPatients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPatientSearchResults([]);
      return;
    }
    setIsSearchingPatients(true);
    try {
      const response = await PatientService.searchPatients(searchTerm);
      setPatientSearchResults(response.patients || []);
    } catch (error) {
      setPatientSearchResults([]);
    } finally {
      setIsSearchingPatients(false);
    }
  };

  // Select patient from dropdown
  const selectPatient = (patient: PatientType) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(patient.name);
    setShowPatientDropdown(false);
    setFormData(prev => ({ ...prev, patientId: patient.id }));
  };

  // Clear patient selection
  const clearPatientSelection = () => {
    setSelectedPatient(null);
    setPatientSearchTerm('');
    setPatientSearchResults([]);
    setShowPatientDropdown(false);
    setFormData(prev => ({ ...prev, patientId: '' }));
  };

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
          {/* Autocomplete Paciente */}
          <div className="space-y-2 relative patient-autocomplete">
            <Label htmlFor="patient">Paciente *</Label>
            <Input
              id="patient"
              type="text"
              placeholder="Digite o nome do paciente"
              value={patientSearchTerm}
              onChange={e => {
                setPatientSearchTerm(e.target.value);
                if (!e.target.value) clearPatientSelection();
              }}
              onFocus={() => {
                if (patientSearchResults.length > 0) setShowPatientDropdown(true);
              }}
              className="w-full pr-10"
              required
            />
            {selectedPatient && (
              <button
                onClick={clearPatientSelection}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                ✕
              </button>
            )}
            {isSearchingPatients && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></span>
              </div>
            )}
            {showPatientDropdown && patientSearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {patientSearchResults.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => selectPatient(patient)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    type="button"
                  >
                    {patient.name} ({patient.cpf})
                  </button>
                ))}
              </div>
            )}
            {selectedPatient && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <span className="text-green-700">Selecionado: {selectedPatient.name} ({selectedPatient.cpf})</span>
              </div>
            )}
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
