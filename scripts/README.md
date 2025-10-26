# Cadastro em Massa de Pacientes

Este script permite cadastrar 50 pacientes no backend usando os CPFs fornecidos.

## Pré-requisitos

1. Backend rodando em `http://localhost:3001`
2. Token JWT válido de um usuário autenticado
3. Node.js instalado

## Como usar

### 1. Obter o token JWT

1. Faça login no frontend
2. Abra as ferramentas de desenvolvedor (F12)
3. Vá em **Application > Local Storage**
4. Copie o valor do campo `token`

### 2. Configurar o script

1. Abra o arquivo `scripts/create-bulk-patients.js`
2. Substitua `'SEU_TOKEN_JWT_AQUI'` pelo token copiado
3. Substitua `'USER_ID_AQUI'` por um UUID válido de usuário do sistema

### 3. Instalar dependências

```bash
npm install node-fetch
```

### 4. Executar o script

```bash
node scripts/create-bulk-patients.js
```

## O que o script faz

- Gera dados fictícios mas realistas para cada CPF
- Cria nomes brasileiros aleatórios
- Gera emails, telefones e endereços fictícios
- Atribui tipos sanguíneos, alergias e históricos médicos aleatórios
- Cria os pacientes via API REST
- Exibe relatório de sucessos e erros

## Dados gerados

Cada paciente terá:
- **Nome**: Combinação aleatória de nomes brasileiros
- **CPF**: Um dos 50 CPFs fornecidos
- **Email**: Baseado no nome + domínio aleatório
- **Telefone**: Número brasileiro válido (formato: DDDnúmero)
- **Data de nascimento**: Idade entre 18-80 anos
- **Gênero**: Masculino ou feminino
- **Endereço**: Cidade, bairro e estado brasileiros
- **Tipo sanguíneo**: A+, A-, B+, B-, AB+, AB-, O+, O-
- **Alergias**: Lista pré-definida de alergias comuns
- **Histórico médico**: Condições médicas comuns

## Exemplo de saída

```
🏥 Iniciando cadastro em massa de 50 pacientes...

📝 Criando paciente 1/50: Ana Silva (868.801.115-05)
✅ Paciente criado com sucesso! ID: abc123
📝 Criando paciente 2/50: Carlos Santos (600.349.210-44)
✅ Paciente criado com sucesso! ID: def456
...

📊 RELATÓRIO FINAL:
✅ Pacientes criados com sucesso: 48
❌ Erros: 2
📋 Total processado: 50
```

## Resolução de problemas

- **Erro 401**: Token inválido ou expirado
- **Erro 400**: Dados inválidos (verificar formato CPF/campos obrigatórios)
- **Erro 409**: CPF já cadastrado no sistema
- **Erro de conexão**: Verificar se o backend está rodando