/**
 * Script para cadastrar 50 pacientes em massa no backend
 * 
 * Para executar:
 * 1. Certifique-se de que o backend está rodando
 * 2. Faça login no frontend para obter um token válido
 * 3. Execute: node scripts/create-bulk-patients.js
 */

const API_BASE_URL = 'http://localhost:4000/api'

// Lista de CPFs fornecidos
const cpfs = [
  '868.801.115-05', '600.349.210-44', '299.091.863-90', '101.747.447-81', '296.316.239-12',
  '374.698.272-34', '625.995.299-64', '856.892.288-00', '930.057.505-82', '824.169.238-20',
  '865.014.957-09', '146.308.199-59', '185.113.841-20', '251.140.669-19', '490.948.770-07',
  '680.320.791-90', '379.098.958-44', '161.759.708-29', '778.759.279-60', '861.175.989-39',
  '455.348.724-11', '238.093.522-09', '909.336.873-70', '278.650.316-70', '052.327.547-18',
  '860.817.703-03', '496.342.808-38', '226.208.010-01', '079.236.018-44', '873.600.097-31',
  '094.862.771-92', '222.585.614-18', '223.485.792-94', '265.027.942-70', '261.035.751-68',
  '790.306.437-14', '445.252.284-07', '664.813.089-09', '328.511.717-63', '799.445.407-06',
  '309.031.283-22', '647.961.512-30', '749.392.159-89', '411.787.084-03', '784.776.367-29',
  '576.337.229-83', '300.331.434-39', '849.274.644-07', '794.162.821-03', '421.122.387-95'
]

// Nomes fictícios brasileiros
const firstNames = [
  'Ana', 'Carlos', 'Maria', 'João', 'Fernanda', 'Ricardo', 'Juliana', 'Pedro', 'Camila', 'André',
  'Beatriz', 'Felipe', 'Larissa', 'Marcos', 'Gabriela', 'Rafael', 'Patrícia', 'Lucas', 'Renata', 'Diego',
  'Amanda', 'Thiago', 'Cristina', 'Bruno', 'Vanessa', 'Rodrigo', 'Luciana', 'Daniel', 'Priscila', 'Gustavo',
  'Monica', 'Vinícius', 'Tatiana', 'Alexandre', 'Débora', 'Leonardo', 'Alessandra', 'Henrique', 'Adriana', 'Fábio',
  'Carla', 'Maurício', 'Sandra', 'Roberto', 'Silvia', 'Eduardo', 'Mariana', 'Paulo', 'Claudia', 'José'
]

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
  'Rocha', 'Dias', 'Monteiro', 'Mendes', 'Cardoso', 'Reis', 'Araújo', 'Nascimento', 'Freitas', 'Campos',
  'Cunha', 'Moreira', 'Pinto', 'Machado', 'Teixeira', 'Castro', 'Miranda', 'Moura', 'Correia', 'Farias'
]

const cities = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília', 'Fortaleza', 'Curitiba',
  'Recife', 'Porto Alegre', 'Goiânia', 'Belém', 'Guarulhos', 'Campinas', 'São Luís', 'São Gonçalo',
  'Maceió', 'Duque de Caxias', 'Campo Grande', 'Natal', 'Teresina'
]

const neighborhoods = [
  'Centro', 'Vila Nova', 'Jardim América', 'Copacabana', 'Ipanema', 'Liberdade', 'Vila Madalena',
  'Perdizes', 'Moema', 'Jardim Paulista', 'Tijuca', 'Botafogo', 'Leblon', 'Barra da Tijuca',
  'Savassi', 'Funcionários', 'Lourdes', 'Serra', 'Pituba', 'Barra'
]

const states = ['SP', 'RJ', 'MG', 'BA', 'PR', 'RS', 'PE', 'CE', 'PA', 'SC', 'GO', 'MA', 'AL', 'RN', 'MS', 'PI', 'DF']

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const genders = ['male', 'female']

const allergies = [
  'Nenhuma alergia conhecida',
  'Alergia a penicilina',
  'Alergia a frutos do mar',
  'Alergia a pólen',
  'Alergia a ácaros',
  'Alergia a aspirina',
  'Alergia a látex',
  'Alergia a dipirona'
]

const medicalHistories = [
  'Sem histórico médico relevante',
  'Hipertensão arterial controlada',
  'Diabetes tipo 2',
  'Colesterol alto',
  'Asma brônquica',
  'Artrite reumatoide',
  'Enxaqueca crônica',
  'Gastrite crônica'
]

// Função para gerar número aleatório
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Função para escolher item aleatório do array
function randomChoice(array) {
  return array[randomInt(0, array.length - 1)]
}

// Função para gerar data de nascimento aleatória (18-80 anos)
function randomBirthDate() {
  const currentYear = new Date().getFullYear()
  const birthYear = currentYear - randomInt(18, 80)
  const month = String(randomInt(1, 12)).padStart(2, '0')
  const day = String(randomInt(1, 28)).padStart(2, '0')
  return `${birthYear}-${month}-${day}`
}

// Função para gerar telefone aleatório (formato brasileiro)
function randomPhone() {
  const ddd = randomInt(11, 99)
  const firstDigit = 9 // Celular sempre começa com 9
  const number = randomInt(1000, 9999)
  const suffix = randomInt(1000, 9999)
  return `${ddd}${firstDigit}${number}${suffix}`
}

// Função para gerar email
function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br']
  const name = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
  return `${name}@${randomChoice(domains)}`
}

// Função para limpar CPF
function cleanCpf(cpf) {
  return cpf.replace(/\D/g, '')
}

// Função para criar um paciente
function createPatient(cpf, index) {
  const firstName = randomChoice(firstNames)
  const lastName = randomChoice(lastNames)
  
  // Construir payload apenas com campos válidos (sem undefined)
  const patient = {
    name: `${firstName} ${lastName}`,
    cpf: cleanCpf(cpf),
    birthDate: randomBirthDate(),
    gender: randomChoice(genders),
    userId: 'ee5ab1fa-07af-4c1a-8efd-5dd3dd8afda7'
  }
  
  // Adicionar campos opcionais apenas se tiverem valor
  const patientEmail = generateEmail(firstName, lastName)
  const patientPhone = randomPhone()
  const patientNeighborhood = randomChoice(neighborhoods)
  const patientCity = randomChoice(cities)
  const patientState = randomChoice(states)
  const patientBloodType = randomChoice(bloodTypes)
  const patientMedicalHistory = randomChoice(medicalHistories)
  const patientAllergies = randomChoice(allergies)
  
  if (patientEmail) patient.email = patientEmail
  if (patientPhone) patient.phone = patientPhone
  if (patientNeighborhood) patient.neighborhood = patientNeighborhood
  if (patientCity) patient.city = patientCity
  if (patientState) patient.state = patientState
  if (patientBloodType) patient.bloodType = patientBloodType
  if (patientMedicalHistory) patient.medicalHistory = patientMedicalHistory
  if (patientAllergies) patient.allergies = patientAllergies
  
  return patient
}

// Função para fazer requisição HTTP
async function makeRequest(url, method, data, token) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    })
    
    // Clona a resposta para poder ler o corpo múltiplas vezes se necessário
    const responseClone = response.clone()
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      try {
        const errorData = await responseClone.json()
        errorMessage += `: ${errorData.message || errorData.error || 'Erro desconhecido'}`
      } catch {
        // Se não conseguir fazer parse do JSON, tenta texto
        try {
          const errorText = await response.text()
          errorMessage += `: ${errorText || 'Erro desconhecido'}`
        } catch {
          errorMessage += ': Erro desconhecido'
        }
      }
      throw new Error(errorMessage)
    }
    
    // Só lê o corpo da resposta se a requisição foi bem-sucedida
    return response.json()
  } catch (error) {
    if (error.name === 'FetchError') {
      throw new Error(`Erro de conexão: ${error.message}. Verifique se o backend está rodando em ${API_BASE_URL}`)
    }
    throw error
  }
}

// Função principal
async function createBulkPatients() {
  console.log('🏥 Iniciando cadastro em massa de 50 pacientes...\n')
  
  // ⚠️ IMPORTANTE: Substitua por um token JWT válido
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZTVhYjFmYS0wN2FmLTRjMWEtOGVmZC01ZGQzZGQ4YWZkYTciLCJlbWFpbCI6Imxlb25hcmRvMkB0ZXN0ZS5jb20iLCJuYW1lIjoiRHIuIExlb25hcmRvIFNpbHZhIiwiaXNBZG1pbmlzdHJhZG9yIjpmYWxzZSwiaWF0IjoxNzYxNDg0OTQ3LCJleHAiOjE3NjE1NzEzNDd9.UPj9Q96VgLa_LaPPkWjefFRvK-BvyWndnQsTCHArAP0" 
  
  if (!token || token === 'SEU_TOKEN_JWT_AQUI') {
    console.error('❌ ERRO: Você precisa definir um token JWT válido na variável "token"')
    console.log('💡 Para obter o token:')
    console.log('   1. Faça login no frontend')
    console.log('   2. Abra as ferramentas de desenvolvedor (F12)')
    console.log('   3. Vá em Application > Local Storage')
    console.log('   4. Copie o valor do campo "token"\n')
    return
  }
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < cpfs.length; i++) {
    const cpf = cpfs[i]
    const patient = createPatient(cpf, i)
    
    try {
      console.log(`📝 Criando paciente ${i + 1}/50: ${patient.name} (${cpf})`)
      
      // Debug: mostrar payload sendo enviado
      console.log(`🔍 Payload:`, JSON.stringify(patient, null, 2))
      
      const result = await makeRequest(
        `${API_BASE_URL}/patients`,
        'POST',
        patient,
        token
      )
      
      console.log(`✅ Paciente criado com sucesso! ID: ${result.id}`)
      successCount++
      
      // Pequena pausa para não sobrecarregar o servidor
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Erro ao criar paciente ${patient.name}: ${error.message}`)
      
      // Debug adicional
      if (error.message.includes('HTML') || error.message.includes('<')) {
        console.error('🚨 ERRO: Resposta em HTML detectada - possível problema de autenticação ou redirecionamento')
      }
      
      errorCount++
      
      // Para no primeiro erro para análise
      if (errorCount === 1) {
        console.log('\n🔍 PAUSANDO para análise do primeiro erro...')
        console.log('Verifique:')
        console.log('1. Se o backend está rodando em http://localhost:3001')
        console.log('2. Se o token JWT ainda é válido')
        console.log('3. Se o endpoint /patients existe')
        break
      }
    }
  }
  
  console.log('\n📊 RELATÓRIO FINAL:')
  console.log(`✅ Pacientes criados com sucesso: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log(`📋 Total processado: ${successCount + errorCount}`)
}

// Verificar se está rodando no Node.js
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch')
  createBulkPatients().catch(console.error)
} else {
  // Browser environment
  console.log('Este script deve ser executado no Node.js, não no navegador.')
}