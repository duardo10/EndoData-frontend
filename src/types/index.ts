/**
 * Definições de tipos TypeScript para a aplicação EndoData
 * 
 * @description Este arquivo centraliza todas as interfaces e tipos
 * utilizados na aplicação, garantindo type safety e documentação
 * clara das estruturas de dados.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

/**
 * Interface para representar um usuário do sistema
 * 
 * @interface User
 * @description Define a estrutura de dados de um usuário autenticado
 * no sistema EndoData, incluindo informações básicas e metadados.
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   name: "Dr. João Silva",
 *   email: "joao.silva@endodata.com",
 *   avatar: "https://example.com/avatar.jpg",
 *   createdAt: "2025-01-01T00:00:00.000Z"
 * }
 * ```
 */
export interface User {
  /** Identificador único do usuário (UUID) */
  id: string;
  
  /** Nome completo do usuário */
  name: string;
  
  /** Endereço de email do usuário (único no sistema) */
  email: string;
  
  /** URL do avatar do usuário (opcional) */
  avatar?: string;
  
  /** Data e hora de criação da conta (ISO 8601) */
  createdAt: string;
}

/**
 * Interface genérica para respostas da API
 * 
 * @template T - Tipo dos dados retornados
 * @interface ApiResponse
 * @description Padroniza o formato de resposta de todas as endpoints
 * da API, incluindo dados, mensagem e status de sucesso.
 * 
 * @example
 * ```typescript
 * // Resposta com lista de usuários
 * const response: ApiResponse<User[]> = {
 *   data: [user1, user2],
 *   message: "Usuários carregados com sucesso",
 *   success: true
 * }
 * 
 * // Resposta com usuário único
 * const response: ApiResponse<User> = {
 *   data: user,
 *   success: true
 * }
 * ```
 */
export interface ApiResponse<T> {
  /** Dados retornados pela API */
  data: T;
  
  /** Mensagem descritiva da operação (opcional) */
  message?: string;
  
  /** Indica se a operação foi bem-sucedida */
  success: boolean;
}

/**
 * Interface para erros da API
 * 
 * @interface ApiError
 * @description Define a estrutura padronizada para erros retornados
 * pela API, incluindo mensagem, código e detalhes adicionais.
 * 
 * @example
 * ```typescript
 * const error: ApiError = {
 *   message: "Email já cadastrado no sistema",
 *   code: "DUPLICATE_EMAIL",
 *   details: {
 *     field: "email",
 *     value: "user@example.com"
 *   }
 * }
 * ```
 */
export interface ApiError {
  /** Mensagem de erro legível para o usuário */
  message: string;
  
  /** Código de erro para identificação programática (opcional) */
  code?: string;
  
  /** Detalhes adicionais do erro (opcional) */
  details?: Record<string, unknown>;
}

/**
 * Interface para dados de login
 * 
 * @interface LoginCredentials
 * @description Define os dados necessários para autenticação no sistema
 * 
 * @example
 * ```typescript
 * const credentials: LoginCredentials = {
 *   email: "user@endodata.com",
 *   password: "senhaSegura123"
 * }
 * ```
 */
export interface LoginCredentials {
  /** Email do usuário */
  email: string;
  
  /** Senha do usuário */
  password: string;
}

/**
 * Interface para resposta de autenticação
 * 
 * @interface AuthResponse
 * @description Define os dados retornados após autenticação bem-sucedida
 * 
 * @example
 * ```typescript
 * const authResponse: AuthResponse = {
 *   user: userObject,
 *   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   expiresAt: "2025-01-02T00:00:00.000Z"
 * }
 * ```
 */
export interface AuthResponse {
  /** Dados do usuário autenticado */
  user: User;
  
  /** Token JWT para autenticação */
  token: string;
  
  /** Data/hora de expiração do token (ISO 8601) */
  expiresAt: string;
}
