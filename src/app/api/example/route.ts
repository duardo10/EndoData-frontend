/**
 * @fileoverview API Route de exemplo para demonstrar funcionalidades básicas
 * 
 * @description Este arquivo implementa rotas de exemplo (GET e POST) 
 * para demonstrar o padrão de API Routes do Next.js 14 com App Router.
 * 
 * @author Victor Macêdo
 * @since 1.0.0
 */

import { NextResponse } from 'next/server';

/**
 * Handler GET para rota de exemplo
 * 
 * @description Retorna informações básicas da API incluindo status,
 * timestamp atual e versão da aplicação para verificação de saúde.
 * 
 * @returns {Promise<NextResponse>} Response JSON com dados de exemplo
 * 
 * @example
 * ```bash
 * curl -X GET /api/example
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "success": true,
 *   "message": "API funcionando!",
 *   "data": {
 *     "timestamp": "2024-01-15T10:30:00.000Z",
 *     "version": "1.0.0"
 *   }
 * }
 * ```
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'API funcionando!',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
}

/**
 * Handler POST para rota de exemplo
 * 
 * @description Recebe dados via POST e retorna uma confirmação com os
 * dados recebidos, demonstrando o processamento de requisições POST.
 * 
 * @param {Request} request - Objeto Request do Next.js contendo o body
 * @returns {Promise<NextResponse>} Response JSON com os dados recebidos
 * 
 * @example
 * ```bash
 * curl -X POST /api/example \
 *   -H "Content-Type: application/json" \
 *   -d '{"name": "João", "email": "joao@email.com"}'
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "success": true,
 *   "message": "Dados recebidos com sucesso",
 *   "data": {
 *     "name": "João",
 *     "email": "joao@email.com"
 *   }
 * }
 * ```
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  
  return NextResponse.json({
    success: true,
    message: 'Dados recebidos com sucesso',
    data: body
  });
}
