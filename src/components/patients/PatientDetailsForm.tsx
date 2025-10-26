'use client'

import React, { useState, useEffect } from 'react'
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
  peso: string
  altura: string
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
  nomeCompleto: '',
  dataNascimento: '',
  cpf: '',
  telefone: '',
  email: '',
  bairro: '',
  cidade: '',
  estado: '',
  sexo: ''
}

/**
 * Estado inicial dos dados médicos
 */
const initialMedicalInfo: MedicalInfo = {
  tipoSanguineo: '',
  alergias: '',
  condicoesPreExistentes: '',
  peso: '',
  altura: ''
}

/**
 * Medicamentos iniciais em uso
 */
const initialMedications: Medication[] = []

/**
 * Histórico inicial do paciente
 */
const initialHistory: PatientHistoryEntry[] = []

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
import { PatientService, Patient } from '@/services/patientService'
import { getCurrentUserId } from '@/lib/jwt-utils'

interface Props {
  patientId?: string
}

export function PatientDetailsForm({ patientId }: Props): React.ReactElement {
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
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo)
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(initialMedicalInfo)
  const [medications, setMedications] = useState<Medication[]>(initialMedications)
  const [history, setHistory] = useState<PatientHistoryEntry[]>(initialHistory)
  const [newMedication, setNewMedication] = useState({ nome: '', dosagem: '' })
  const [newHistoryEntry, setNewHistoryEntry] = useState({ data: '', descricao: '' })
  const [showHistoryForm, setShowHistoryForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carrega paciente quando um patientId for fornecido
  useEffect(() => {
    if (!patientId) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usar endpoint completo para obter todos os dados
        const data = await PatientService.getPatientComplete(patientId);
        if (!mounted) return;
        const patient = data.patient || data;
        setPersonalInfo({
          nomeCompleto: patient.name || '',
          dataNascimento: patient.birthDate || '',
          cpf: patient.cpf || '',
          telefone: patient.phone || '',
          email: patient.email || '',
          bairro: (patient as any).neighborhood || '',
          cidade: (patient as any).city || '',
          estado: (patient as any).state || '',
          sexo: patient.gender || ''
        });
        setMedicalInfo({
          tipoSanguineo: (patient as any).bloodType || '',
          alergias: (patient as any).allergies || '',
          condicoesPreExistentes: (patient as any).medicalHistory || '',
          peso: (patient as any).weight || '',
          altura: (patient as any).height || ''
        });
        setMedications((data as any).medications || []);
        setHistory((data as any).history || []);
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar paciente');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [patientId]);

  /**
   * Valida os campos obrigatórios e formato antes de enviar
   * @returns {string|null} Mensagem de erro ou null se válido
   */
  function validateFields(): string | null {
    const cleanCpf = personalInfo.cpf ? personalInfo.cpf.replace(/\D/g, '') : ''
    const cleanPhone = personalInfo.telefone ? personalInfo.telefone.replace(/\D/g, '') : ''
    const state = personalInfo.estado.trim().toUpperCase()
    const birthDate = personalInfo.dataNascimento
    const name = personalInfo.nomeCompleto.trim()
    const gender = personalInfo.sexo
    const userId = getCurrentUserId()

    if (!name) return 'Nome completo é obrigatório.'
    if (!cleanCpf || cleanCpf.length !== 11) return 'CPF deve conter 11 dígitos.'
    // Validação de CPF (algoritmo oficial)
    function isValidCpf(cpf: string): boolean {
      if (!cpf || cpf.length !== 11) return false;
      if (/^(\d)\1{10}$/.test(cpf)) return false;
      const calcCheckDigit = (base: string, factorStart: number): number => {
        let total = 0;
        for (let i = 0; i < base.length; i++) {
          total += parseInt(base.charAt(i), 10) * (factorStart - i);
        }
        const remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };
      const baseNine = cpf.substring(0, 9);
      const d1 = calcCheckDigit(baseNine, 10);
      const baseTen = baseNine + String(d1);
      const d2 = calcCheckDigit(baseTen, 11);
      return cpf === baseNine + String(d1) + String(d2);
    }
    if (!isValidCpf(cleanCpf)) return 'CPF inválido.'
    if (!birthDate) return 'Data de nascimento é obrigatória.'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return 'Data de nascimento deve estar no formato YYYY-MM-DD.'
    if (!gender || !['Masculino','Feminino','Outro','male','female','other'].includes(gender)) return 'Sexo é obrigatório.'
    if (!userId) return 'Usuário não autenticado.'
    if (state && !/^[A-Z]{2}$/.test(state)) return 'Estado deve ser a sigla com 2 letras maiúsculas (ex: SP, RJ).'
    if (cleanPhone && (cleanPhone.length < 10 || cleanPhone.length > 15)) return 'Telefone deve conter entre 10 e 15 dígitos.'
    return null;
  }

  /**
   * Salva as informações do paciente
   */
  const savePatientInfo = (): void => {
    ;(async () => {
      setSaving(true)
      setError(null)
      try {
        const validationError = validateFields();
        if (validationError) {
          setError(validationError);
          alert(`Erro: ${validationError}`);
          setSaving(false);
          return;
        }

        const userId = getCurrentUserId()
        // Mapear gênero para os valores esperados pelo backend
        const mapGender = (gender: string): string => {
          const genderMap: { [key: string]: string } = {
            'Masculino': 'male',
            'Feminino': 'female',
            'Outro': 'other',
            'male': 'male',
            'female': 'female',
            'other': 'other',
            'MASCULINO': 'male',
            'FEMININO': 'female',
            'OUTRO': 'other'
          }
          return genderMap[gender] || 'other'
        }

        // Limpar CPF (remover pontos, traços, etc.) - apenas dígitos
        const cleanCpf = personalInfo.cpf ? personalInfo.cpf.replace(/\D/g, '') : ''
        // Limpar telefone (remover formatação)
        const cleanPhone = personalInfo.telefone ? personalInfo.telefone.replace(/\D/g, '') : undefined

        const payload: any = {
          name: personalInfo.nomeCompleto,
          cpf: cleanCpf,
          email: personalInfo.email || undefined,
          phone: cleanPhone,
          birthDate: personalInfo.dataNascimento,
          gender: mapGender(personalInfo.sexo),
          neighborhood: personalInfo.bairro || undefined,
          city: personalInfo.cidade || undefined,
          state: personalInfo.estado ? personalInfo.estado.trim().toUpperCase() : undefined,
          medicalHistory: medicalInfo.condicoesPreExistentes || undefined,
          allergies: medicalInfo.alergias || undefined,
          userId,
        }
        console.log('Payload enviado ao backend:', payload);
        // Envia para o backend (create/update) e trata resposta
        if (patientId) {
          await PatientService.updatePatient(patientId, payload)
          alert('Informações do paciente atualizadas com sucesso!')
          // Redirecionar para busca após edição
          window.location.href = '/dashboard/pacientes/busca'
        } else {
          await PatientService.createPatient(payload)
          alert('Paciente criado com sucesso!')
          // Limpar dados do formulário após cadastro bem-sucedido
          clearFormData()
        }
      } catch (err: any) {
        console.error('Erro ao salvar paciente:', err)
        const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao salvar paciente'
        setError(errorMessage)
        alert(`Erro: ${errorMessage}`)
      } finally {
        setSaving(false)
      }
    })()
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
   * Limpa todos os dados do formulário
   */
  const clearFormData = (): void => {
    setPersonalInfo(initialPersonalInfo)
    setMedicalInfo(initialMedicalInfo)
    setMedications([])
    setError(null)
  }

  /**
   * Salva como novo paciente
   */
  const saveAsNewPatient = (): void => {
    ;(async () => {
      setSaving(true)
      setError(null)
      try {
        const userId = getCurrentUserId()
        if (!userId) {
          setError('Usuário não autenticado')
          setSaving(false)
          return
        }

        // Mapear gênero para os valores esperados pelo backend
        const mapGender = (gender: string): string => {
          const genderMap: { [key: string]: string } = {
            'Masculino': 'male',
            'Feminino': 'female',
            'Outro': 'other',
            'male': 'male',
            'female': 'female',
            'other': 'other',
            'MASCULINO': 'male',
            'FEMININO': 'female',
            'OUTRO': 'other'
          }
          return genderMap[gender] || 'other'
        }

        // Forçar state uppercase
        const stateVal = personalInfo.estado ? personalInfo.estado.toUpperCase() : undefined;

        // Certificar que peso/altura são válidos por regex
        const validWeight = medicalInfo.peso && /^\d{1,3}(\.\d{1,2})?$/.test(medicalInfo.peso) ? medicalInfo.peso : undefined;
        const validHeight = medicalInfo.altura && /^\d{1,3}(\.\d)?$/.test(medicalInfo.altura) ? medicalInfo.altura : undefined;

        // Data ISO do input date (já é, mas garantir formato)
        const birthDate = personalInfo.dataNascimento ? personalInfo.dataNascimento : undefined;

        // Limpar CPF e telefone
        const cleanCpf = personalInfo.cpf ? personalInfo.cpf.replace(/\D/g, '') : '';
        const cleanPhone = personalInfo.telefone ? personalInfo.telefone.replace(/\D/g, '') : undefined;

        // Mapear only if exists (para enums): tipo sanguíneo
        const validBloodTypes = [
          'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
        ];
        const bloodType = validBloodTypes.includes(medicalInfo.tipoSanguineo) ? medicalInfo.tipoSanguineo : undefined;

        const payload: any = {
          name: personalInfo.nomeCompleto,
          cpf: cleanCpf,
          birthDate,
          gender: mapGender(personalInfo.sexo),
          userId,
        };
        if(personalInfo.email) payload.email = personalInfo.email;
        if(cleanPhone) payload.phone = cleanPhone;
        if(personalInfo.bairro) payload.neighborhood = personalInfo.bairro;
        if(personalInfo.cidade) payload.city = personalInfo.cidade;
        if(stateVal) payload.state = stateVal;
        if(validWeight) payload.weight = validWeight;
        if(validHeight) payload.height = validHeight;
        if(bloodType) payload.bloodType = bloodType;
        if(medicalInfo.condicoesPreExistentes) payload.medicalHistory = medicalInfo.condicoesPreExistentes;
        if(medicalInfo.alergias) payload.allergies = medicalInfo.alergias;
        await PatientService.createPatient(payload)
        alert('Novo paciente cadastrado com sucesso!')
        // Limpar dados do formulário após cadastro bem-sucedido
        clearFormData()
      } catch (err: any) {
        console.error(err)
        setError(err?.response?.data?.message || err?.message || 'Erro ao criar paciente')
      } finally {
        setSaving(false)
      }
    })()
  }

  return (
    <div className="space-y-6">
      {/* Formulário principal em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Coluna esquerda - Informações Pessoais */}
  <Card className="p-6 bg-white border border-gray-100 shadow-sm">
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
              <select
                id="estado"
                value={personalInfo.estado}
                onChange={(e) => setPersonalInfo({ ...personalInfo, estado: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione o estado</option>
                <option value="AC">Acre (AC)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="AP">Amapá (AP)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="DF">Distrito Federal (DF)</option>
                <option value="ES">Espírito Santo (ES)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PA">Pará (PA)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="PE">Pernambuco (PE)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="RO">Rondônia (RO)</option>
                <option value="RR">Roraima (RR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SE">Sergipe (SE)</option>
                <option value="TO">Tocantins (TO)</option>
              </select>
            </div>

            {/* Sexo */}
            <div>
              <Label htmlFor="sexo" className="text-sm font-medium text-gray-700">
                Sexo
              </Label>
              <select
                id="sexo"
                value={personalInfo.sexo}
                onChange={(e) => setPersonalInfo({ ...personalInfo, sexo: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione o sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
        </Card>

  {/* Coluna direita - Dados Médicos */}
  <Card className="p-6 bg-white border border-gray-100 shadow-sm">
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
              <select
                id="tipoSanguineo"
                value={medicalInfo.tipoSanguineo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMedicalInfo({ ...medicalInfo, tipoSanguineo: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
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
                  onClick={() => setShowHistoryForm(true)}
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
              {(showHistoryForm || newHistoryEntry.data || newHistoryEntry.descricao) && (
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
                        onClick={() => { setNewHistoryEntry({ data: '', descricao: '' }); setShowHistoryForm(false) }}
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
            disabled={saving}
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Salvando...' : (patientId ? 'Atualizar Paciente' : 'Salvar Informações do Paciente')}
          </Button>
        
        {!patientId && (
          <Button
            onClick={saveAsNewPatient}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Salvar como Novo Paciente
          </Button>
        )}
      </div>
      {error && (
        <div className="text-red-600 text-center mt-2">{error}</div>
      )}
    </div>
  )
}

