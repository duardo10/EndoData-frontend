/**
 * Cliente HTTP configurado para a API do EndoData
 * 
 * @description Este módulo configura uma instância do Axios com interceptors
 * para autenticação automática, tratamento de erros e configurações padrão
 * otimizadas para comunicação com a API backend.
 * 
 * @author EndoData Team
 * @since 1.0.0
 */

import axios, { AxiosError } from 'axios';

/**
 * Instância configurada do Axios para requisições HTTP
 * 
 * @description Cliente HTTP pré-configurado com URL base, headers padrão,
 * timeout e interceptors para autenticação e tratamento de erros.
 * 
 * @features
 * - URL base configurável via variável de ambiente
 * - Timeout de 10 segundos para evitar travamentos
 * - Headers padrão para JSON
 * - Interceptors para autenticação automática
 * - Tratamento automático de erros 401 (não autorizado)
 * 
 * @example
 * ```typescript
 * import api from '@/lib/api'
 * 
 * // GET request
 * const users = await api.get('/users')
 * 
 * // POST request
 * const newUser = await api.post('/users', userData)
 * 
 * // Request com autenticação automática (se token existir)
 * const profile = await api.get('/profile')
 * ```
 */
const api = axios.create({
  // URL base da API - usa variável de ambiente ou fallback local
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://209.145.59.215:4000/api',
  
  // Headers padrão para todas as requisições
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Timeout de 10 segundos para evitar requisições travadas
  timeout: 10000,
});

/**
 * Interceptor de requisição para autenticação automática
 * 
 * @description Adiciona automaticamente o token de autenticação
 * no header Authorization de todas as requisições, se disponível
 * no localStorage do navegador.
 * 
 * @param {import('axios').InternalAxiosRequestConfig} config - Configuração da requisição
 * @returns {import('axios').InternalAxiosRequestConfig} Configuração modificada
 */
api.interceptors.request.use(
  (config) => {
    // Verifica se está executando no navegador (client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token'); // Volta para 'auth_token'
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta para tratamento de erros de autenticação
 * 
 * @description Intercepta respostas HTTP e trata automaticamente
 * erros 401 (não autorizado) removendo o token inválido e
 * redirecionando para a página de login.
 * 
 * @param {import('axios').AxiosResponse} response - Resposta HTTP bem-sucedida
 * @param {AxiosError} error - Erro HTTP capturado
 * @returns {Promise} Promise resolvida ou rejeitada
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Tratamento para token expirado ou inválido
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Remove token inválido
        localStorage.removeItem('jwt'); // Mudança para usar 'jwt'
        // Redireciona para login na raiz
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
