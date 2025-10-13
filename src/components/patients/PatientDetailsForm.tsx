'use client'

import React, { useState } from 'react'
import { 
  Save, 
  UserPlus, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Pill,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

/**
 * Interface para dados pessoais do paciente
 */
interface PersonalInfo {
  nomeCompleto: string
  dataNascimento: string
  cpf: string
  telefone: string
  email: string
  bairro: string
  cidade: string
  estado: string
  sexo: string
}

/**
 * Interface para dados médicos do paciente
 */
interface MedicalInfo {
  tipoSanguineo: string
  alergias: string
  condicoesPreExistentes: string
}

/**
 * Interface para medicamento em uso
 */
interface Medication {
  id: string
  nome: string
  dosagem: string
}

/**
 * Interface para entrada do histórico do paciente
 */
interface PatientHistoryEntry {
  id: string
  data: string
  descricao: string
}

/**
 * Estado inicial dos dados pessoais
 */
const initialPersonalInfo: PersonalInfo = {
  nomeCompleto: 'Maria Silva Oliveira',
  dataNascimento: '1996-12-02',
  cpf: '123.456.789-00',
  telefone: '(11) 98765-4321',
  email: 'maria.silva@email.com',
  bairro: 'Junco',
  cidade: 'Araripina',
  estado: 'PI',
  sexo: 'Feminino'
}

/**
 * Estado inicial dos dados médicos
 */
const initialMedicalInfo: MedicalInfo = {
  tipoSanguineo: 'O+',
  alergias: 'Penicilina, Amendoim',
  condicoesPreExistentes: 'Hipertensão, Diabetes Tipo 2'
}

/**
 * Medicamentos iniciais em uso
 */
const initialMedications: Medication[] = [
  { id: '1', nome: 'Losartana', dosagem: '50mg' },
  { id: '2', nome: 'Metformina', dosagem: '850mg' }
]

/**
 * Histórico inicial do paciente
 */
const initialHistory: PatientHistoryEntry[] = [
  {
    id: '1',
    data: '2023-10-20',
    descricao: 'Consulta de rotina anual. Exames de sangue solicitados. Paciente relata bem-estar geral, mas com pequenos picos de pressão arterial em momentos de estresse.'
  },
  {
    id: '2',
    data: '2023-05-10',
    descricao: 'Retorno para ajuste de medicação para hipertensão. Aumentada a dose de Losartana. Monitoramento semanal da pressão arterial recomendado.'
  },
  {
    id: '3',
    data: '2022-12-01',
    descricao: 'Primeira consulta e diagnóstico de diabetes tipo 2. Iniciado tratamento com Metformina. Orientações sobre dieta e exercícios físicos fornecidas.'
  },
  {
    id: '4',
    data: '2022-08-15',
    descricao: 'Consulta inicial. Paciente apresenta histórico familiar de doenças cardíacas e diabetes. Realizados exames básicos.'
  }
]

/**
 * Componente principal do formulário de detalhes do paciente
 * 
 * @description Formulário completo para cadastro e edição de pacientes,
 * contendo informações pessoais, dados médicos, medicamentos em uso
 * e histórico de consultas.
 * 
 * @returns {React.ReactElement} Formulário de detalhes do paciente
 * 
 * @features
 * - Formulário dividido em duas colunas (Informações Pessoais e Dados Médicos)
 * - Gerenciamento dinâmico de medicamentos em uso
 * - Histórico de consultas com opções de adicionar/editar/excluir
 * - Validação de campos obrigatórios
 * - Design responsivo seguindo o protótipo
 * - Botões de ação para salvar informações
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function PatientDetailsForm(): React.ReactElement {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo)
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(initialMedicalInfo)
  const [medications, setMedications] = useState<Medication[]>(initialMedications)
  const [history, setHistory] = useState<PatientHistoryEntry[]>(initialHistory)
  const [newMedication, setNewMedication] = useState({ nome: '', dosagem: '' })
  const [newHistoryEntry, setNewHistoryEntry] = useState({ data: '', descricao: '' })

  /**
   * Adiciona um novo medicamento à lista
   */
  const addMedication = (): void => {
    if (newMedication.nome && newMedication.dosagem) {
      const medication: Medication = {
        id: Date.now().toString(),
        nome: newMedication.nome,
        dosagem: newMedication.dosagem
      }
      setMedications([...medications, medication])
      setNewMedication({ nome: '', dosagem: '' })
    }
  }

  /**
   * Remove um medicamento da lista
   * 
   * @param {string} id - ID do medicamento a ser removido
   */
  const removeMedication = (id: string): void => {
    setMedications(medications.filter(med => med.id !== id))
  }

  /**
   * Adiciona uma nova entrada ao histórico do paciente
   */
  const addHistoryEntry = (): void => {
    if (newHistoryEntry.data && newHistoryEntry.descricao) {
      const entry: PatientHistoryEntry = {
        id: Date.now().toString(),
        data: newHistoryEntry.data,
        descricao: newHistoryEntry.descricao
      }
      setHistory([entry, ...history])
      setNewHistoryEntry({ data: '', descricao: '' })
    }
  }

  /**
   * Remove uma entrada do histórico do paciente
   * 
   * @param {string} id - ID da entrada a ser removida
   */
  const removeHistoryEntry = (id: string): void => {
    setHistory(history.filter(entry => entry.id !== id))
  }

  /**
   * Salva as informações do paciente
   */
  const savePatientInfo = (): void => {
    // TODO: Implementar lógica de salvamento
    console.log('Salvando informações do paciente:', { personalInfo, medicalInfo, medications, history })
    alert('Informações do paciente salvas com sucesso!')
  }

  /**
   * Salva como novo paciente
   */
  const saveAsNewPatient = (): void => {
    // TODO: Implementar lógica de salvamento como novo paciente
    console.log('Salvando como novo paciente:', { personalInfo, medicalInfo, medications, history })
    alert('Novo paciente cadastrado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Formulário principal em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna esquerda - Informações Pessoais */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-[#2074E9]" />
            Informações Pessoais
          </h2>
          
          <div className="space-y-4">
            {/* Nome Completo */}
            <div>
              <Label htmlFor="nomeCompleto" className="text-sm font-medium text-gray-700">
                Nome Completo
              </Label>
              <Input
                id="nomeCompleto"
                value={personalInfo.nomeCompleto}
                onChange={(e) => setPersonalInfo({ ...personalInfo, nomeCompleto: e.target.value })}
                className="mt-1"
                placeholder="Digite o nome completo"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <Label htmlFor="dataNascimento" className="text-sm font-medium text-gray-700">
                Data de Nascimento
              </Label>
              <Input
                id="dataNascimento"
                type="date"
                value={personalInfo.dataNascimento}
                onChange={(e) => setPersonalInfo({ ...personalInfo, dataNascimento: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* CPF */}
            <div>
              <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                CPF
              </Label>
              <Input
                id="cpf"
                value={personalInfo.cpf}
                onChange={(e) => setPersonalInfo({ ...personalInfo, cpf: e.target.value })}
                className="mt-1"
                placeholder="000.000.000-00"
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={personalInfo.telefone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, telefone: e.target.value })}
                className="mt-1"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* E-mail */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="mt-1"
                placeholder="email@exemplo.com"
              />
            </div>

            {/* Bairro */}
            <div>
              <Label htmlFor="bairro" className="text-sm font-medium text-gray-700">
                Bairro
              </Label>
              <Input
                id="bairro"
                value={personalInfo.bairro}
                onChange={(e) => setPersonalInfo({ ...personalInfo, bairro: e.target.value })}
                className="mt-1"
                placeholder="Nome do bairro"
              />
            </div>

            {/* Cidade */}
            <div>
              <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                Cidade
              </Label>
              <Input
                id="cidade"
                value={personalInfo.cidade}
                onChange={(e) => setPersonalInfo({ ...personalInfo, cidade: e.target.value })}
                className="mt-1"
                placeholder="Nome da cidade"
              />
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                Estado
              </Label>
              <Input
                id="estado"
                value={personalInfo.estado}
                onChange={(e) => setPersonalInfo({ ...personalInfo, estado: e.target.value })}
                className="mt-1"
                placeholder="UF"
                maxLength={2}
              />
            </div>

            {/* Sexo */}
            <div>
              <Label htmlFor="sexo" className="text-sm font-medium text-gray-700">
                Sexo
              </Label>
              <Input
                id="sexo"
                value={personalInfo.sexo}
                onChange={(e) => setPersonalInfo({ ...personalInfo, sexo: e.target.value })}
                className="mt-1"
                placeholder="Masculino/Feminino/Outro"
              />
            </div>
          </div>
        </Card>

        {/* Coluna direita - Dados Médicos */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-[#2074E9]" />
            Dados Médicos
          </h2>
          
          <div className="space-y-4">
            {/* Tipo Sanguíneo */}
            <div>
              <Label htmlFor="tipoSanguineo" className="text-sm font-medium text-gray-700">
                Tipo Sanguíneo
              </Label>
              <Input
                id="tipoSanguineo"
                value={medicalInfo.tipoSanguineo}
                onChange={(e) => setMedicalInfo({ ...medicalInfo, tipoSanguineo: e.target.value })}
                className="mt-1"
                placeholder="Ex: O+, A-, B+, AB-"
              />
            </div>

            {/* Alergias */}
            <div>
              <Label htmlFor="alergias" className="text-sm font-medium text-gray-700">
                Alergias
              </Label>
              <Input
                id="alergias"
                value={medicalInfo.alergias}
                onChange={(e) => setMedicalInfo({ ...medicalInfo, alergias: e.target.value })}
                className="mt-1"
                placeholder="Liste as alergias conhecidas"
              />
            </div>

            {/* Condições Pré-existentes */}
            <div>
              <Label htmlFor="condicoesPreExistentes" className="text-sm font-medium text-gray-700">
                Condições Pré-existentes
              </Label>
              <Input
                id="condicoesPreExistentes"
                value={medicalInfo.condicoesPreExistentes}
                onChange={(e) => setMedicalInfo({ ...medicalInfo, condicoesPreExistentes: e.target.value })}
                className="mt-1"
                placeholder="Liste as condições médicas pré-existentes"
              />
            </div>

            {/* Medicamentos em Uso */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Medicamentos em Uso
              </Label>
              
              {/* Lista de medicamentos */}
              <div className="space-y-2 mb-4">
                {medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {medication.nome} {medication.dosagem}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Adicionar novo medicamento */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do medicamento"
                  value={newMedication.nome}
                  onChange={(e) => setNewMedication({ ...newMedication, nome: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Dosagem"
                  value={newMedication.dosagem}
                  onChange={(e) => setNewMedication({ ...newMedication, dosagem: e.target.value })}
                  className="w-24"
                />
                <Button
                  onClick={addMedication}
                  size="sm"
                  className="bg-[#2074E9] hover:bg-[#1a5bb8]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Histórico do Paciente */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-gray-700">
                  Histórico do Paciente
                </Label>
                <Button
                  onClick={addHistoryEntry}
                  size="sm"
                  variant="outline"
                  className="text-[#2074E9] border-[#2074E9] hover:bg-[#2074E9] hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Nova Nota
                </Button>
              </div>

              {/* Lista do histórico */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-50 p-4 rounded-lg border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {entry.data}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHistoryEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {entry.descricao}
                    </p>
                  </div>
                ))}
              </div>

              {/* Formulário para nova entrada */}
              {(newHistoryEntry.data || newHistoryEntry.descricao) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <Input
                      type="date"
                      placeholder="Data da consulta"
                      value={newHistoryEntry.data}
                      onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, data: e.target.value })}
                    />
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      placeholder="Descrição da consulta ou observações..."
                      value={newHistoryEntry.descricao}
                      onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, descricao: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={addHistoryEntry}
                        size="sm"
                        className="bg-[#2074E9] hover:bg-[#1a5bb8]"
                      >
                        Adicionar
                      </Button>
                      <Button
                        onClick={() => setNewHistoryEntry({ data: '', descricao: '' })}
                        size="sm"
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={savePatientInfo}
          className="bg-[#2074E9] hover:bg-[#1a5bb8] text-white px-8 py-3"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Informações do Paciente
        </Button>
        
        <Button
          onClick={saveAsNewPatient}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Salvar como Novo Paciente
        </Button>
      </div>
    </div>
  )
}

