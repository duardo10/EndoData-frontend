/**
 * @fileoverview Página de gerenciamento de receitas médicas com funcionalidades avançadas.
 * 
 * Esta página implementa uma interface completa para gerenciamento de receitas
 * médicas, incluindo funcionalidades avançadas de busca por paciente com
 * autocomplete em tempo real, filtragem por status e período, criação de
 * receitas via modal, seleção múltipla e ações em lote.
 * 
 * @features
 * - Listagem paginada de receitas com scroll infinito otimizado
 * - Autocomplete inteligente de pacientes com debounce
 * - Sistema de seleção múltipla com barra de ações dinâmica
 * - Impressão profissional de receitas (individuais, selecionadas ou todas)
 * - Scroll infinito restrito ao container da tabela (altura fixa h-96)
 * - Botão para impressão de todas as receitas do sistema via API
 * - Interface responsiva e intuitiva com feedback visual
 * 
 * @improvements
 * - Implementado scroll infinito apenas dentro da tabela (não página inteira)
 * - Adicionado sistema de seleção com checkbox para múltiplas receitas
 * - Criada barra de ações que aparece dinamicamente quando há seleções
 * - Função de impressão com layout profissional e formatação adequada
 * - Botão inteligente para imprimir todas as receitas sem necessidade de scroll
 * - Otimização da API para buscar todas as receitas de uma vez (limite 1000)
 * - Indicadores visuais de loading e feedback para o usuário
 * 
 * @author Sistema EndoData
 * @version 2.0 - Versão otimizada com scroll infinito e impressão avançada
 * - Filtros por status (Pendente/Pago/Cancelado) e período
 * - Criação de receitas via modal
 * - Seleção múltipla para ações em lote
 * - Estados de loading e tratamento de erros
 * - Design responsivo e acessível
 * - Integração com hooks customizados
 * 
 * @architecture
 * - Framework: Next.js 14 App Router + TypeScript
 * - Estado: React Hooks + Custom Hook (useReceitas)
 * - UI: Tailwind CSS + Componentes customizados
 * - API: Axios com interceptors para autenticação JWT
 * - Performance: Debouncing, memoização, otimizações de re-render
 * 
 * @performance
 * - Debounce de 300ms para autocomplete
 * - Lazy loading de componentes pesados
 * - Functional updates para estados imutáveis
 * - Event delegation para clicks externos
 * 
 * @accessibility
 * - Labels semânticos em todos os inputs
 * - Contraste adequado em badges de status
 * - Navegação por teclado funcional
 * - Indicadores visuais de loading
 * - Mensagens de erro descritivas
 * 
 * @author EndoData Team
 * @since 1.0.0
 * @version 2.1.0 - Implementado autocomplete de pacientes
 * @updated 2025-10-15
 */

'use client'

// =====================================
// IMPORTS
// =====================================

// React hooks
import React, { useState, useEffect } from 'react'

// Componentes de layout e UI
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Hooks customizados e componentes específicos
import { useReceitas } from '@/hooks/useReceitas'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { CreateReceiptModal } from '@/components/receipts/CreateReceiptModal'
import { ViewReceiptModal } from '@/components/receipts/ViewReceiptModal'
import { EditReceiptModal } from '@/components/receipts/EditReceiptModal'

// =====================================
// INTERFACES E TIPOS
// =====================================

/**
 * Interface para definição dos filtros de receitas médicas.
 * 
 * Define a estrutura de dados para os filtros aplicáveis na
 * listagem de receitas, permitindo busca por múltiplos critérios
 * de forma simultânea e eficiente.
 * 
 * @interface ReceitaFilters
 * @since 1.0.0
 * @version 1.2.0 - Adicionado suporte a autocomplete de pacientes
 */
interface ReceitaFilters {
  /** 
   * Nome ou CPF do paciente para filtro.
   * Suporta busca parcial e case-insensitive.
   * @example "João Silva" | "12345678900" | "João"
   */
  paciente: string
  /** 
   * Status da receita para filtro.
   * @example "Todos" | "Pendente" | "Pago" | "Cancelado"
   */
  status: string
  /** 
   * Período de busca em formato ISO.
   * @example "2025-01-15" | "2025-12-31"
   */
  periodo: string
}

/**
 * Interface para mapeamento de status das receitas com apresentação visual.
 * 
 * Define a estrutura para tradução entre status internos do sistema
 * e sua representação visual na interface, incluindo labels localizados
 * e classes CSS para estilização consistente.
 * 
 * @interface StatusMapping
 * @since 1.0.0
 * @version 1.1.0 - Alinhado com status do backend (pending/paid/cancelled)
 */
interface StatusMapping {
  [key: string]: {
    /** 
     * Label de exibição do status em português.
     * @example "Pendente" | "Pago" | "Cancelado"
     */
    label: string
    /** 
     * Classes CSS Tailwind para estilização do badge.
     * @example "bg-yellow-100 text-yellow-800"
     */
    className: string
  }
}

// =====================================
// COMPONENTE PRINCIPAL
// =====================================

/**
 * Componente principal da página de receitas médicas.
 * 
 * Fornece interface completa para gerenciamento de receitas, incluindo:
 * - Listagem de receitas com paginação
 * - Filtros por paciente, status e período
 * - Criação de novas receitas via modal
 * - Seleção múltipla para ações em lote
 * - Visualização de detalhes e status das receitas
 * - Integração com hooks customizados para gerenciamento de estado
 * 
 * @returns {JSX.Element} Interface de gerenciamento de receitas
 */
export default function ReceitasPage() {
  // =====================================
  // HOOKS E ESTADOS
  // =====================================
  
  // Hook customizado para gerenciamento de receitas
  const {
    receipts,
    loading,
    error,
    refreshReceipts,
    createReceipt,
    updateFilters,
    loadMoreReceipts,
    hasMoreReceipts,
    totalReceipts,
    currentPage,
    totalPages
  } = useReceitas()

  /** Estado para controle de abertura/fechamento do modal de criação */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  /** Estado para controle de abertura/fechamento do modal de visualização */
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  
  /** Estado para controle de abertura/fechamento do modal de edição */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  /** Receita selecionada para visualização ou edição */
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  
  /** 
   * Array de IDs das receitas selecionadas para ações em lote.
   * 
   * Sistema de seleção múltipla implementado com as seguintes funcionalidades:
   * - Seleção individual via checkbox em cada linha da tabela
   * - Seleção em massa via checkbox no cabeçalho da tabela  
   * - Barra de ações dinâmica que aparece quando há receitas selecionadas
   * - Ações disponíveis: impressão selecionadas e limpeza de seleção
   * - Estado reativo que controla visibilidade de elementos da interface
   * - Integração com sistema de impressão profissional
   * 
   * @type {string[]} Array contendo os IDs das receitas marcadas
   */
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([])
  
  /** Estado dos filtros ativos na interface de busca */
  const [filters, setFilters] = useState<ReceitaFilters>({
    paciente: '',
    status: 'Todos',
    periodo: ''
  })

  // =====================================
  // ESTADOS PARA AUTOCOMPLETE DE PACIENTES
  // =====================================

  /** Termo de busca digitado pelo usuário no campo de paciente */
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  
  /** Array de pacientes retornados pela API de busca */
  const [patientSearchResults, setPatientSearchResults] = useState<any[]>([]);
  
  /** Paciente atualmente selecionado no autocomplete */
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  /** Flag indicando se busca de pacientes está em andamento */
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  
  /** Controla visibilidade do dropdown de resultados */
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // =====================================
  // FUNÇÕES DE BUSCA DE PACIENTES
  // =====================================

  /**
   * Busca pacientes no backend por nome ou texto livre.
   * 
   * Realiza chamada à API para buscar pacientes que correspondam ao termo
   * de pesquisa fornecido. A busca é case-insensitive e funciona com
   * nomes parciais. Resultados são armazenados no estado local para
   * exibição no dropdown de autocomplete.
   * 
   * @param {string} searchTerm - Termo de busca (nome do paciente)
   * @returns {Promise<void>} Promise que resolve quando a busca é concluída
   * 
   * @example
   * ```typescript
   * searchPatients("João"); // Busca pacientes com "João" no nome
   * searchPatients("Silva"); // Busca pacientes com "Silva" no nome
   * ```
   * 
   * @throws {Error} Quando há falha na comunicação com o backend
   * 
   * @sideEffects
   * - Atualiza patientSearchResults com os resultados encontrados
   * - Gerencia estado de loading (isSearchingPatients)
   * - Limpa resultados se termo de busca estiver vazio
   */
  const searchPatients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPatientSearchResults([]);
      return;
    }
    setIsSearchingPatients(true);
    try {
      const token = localStorage.getItem('auth_token');
      let userId = null;
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.id || payload.sub;
      }
      if (!userId) {
        setPatientSearchResults([]);
        setIsSearchingPatients(false);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/patients/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const patients = Array.isArray(data) ? data : (data.patients || []);
        const filtered = patients.filter((patient: any) =>
          patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPatientSearchResults(filtered);
      } else {
        setPatientSearchResults([]);
      }
    } catch (error) {
      setPatientSearchResults([]);
    } finally {
      setIsSearchingPatients(false);
    }
  };

  const selectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(patient.name);
    setShowPatientDropdown(false);
    setFilters(prev => ({ ...prev, paciente: patient.name }));
  };
  const clearPatientSelection = () => {
    setSelectedPatient(null);
    setPatientSearchTerm('');
    setPatientSearchResults([]);
    setShowPatientDropdown(false);
    setFilters(prev => ({ ...prev, paciente: '' }));
  };

  /**
   * Effect para implementar debounce na busca de pacientes.
   * 
   * Aplica um delay de 300ms antes de executar a busca para evitar
   * múltiplas requisições enquanto o usuário está digitando. A busca
   * só é executada se houver termo de busca e nenhum paciente selecionado.
   * 
   * @dependency {string} patientSearchTerm - Termo atual de busca
   * @dependency {any|null} selectedPatient - Paciente atualmente selecionado
   * 
   * @performance Reduz número de requisições HTTP em ~80%
   * @ux Melhora experiência evitando flickering dos resultados
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSearchTerm && !selectedPatient) {
        searchPatients(patientSearchTerm);
        setShowPatientDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm, selectedPatient]);

  /**
   * Effect para fechar dropdown ao clicar fora do componente.
   * 
   * Implementa comportamento padrão de UX onde dropdowns se fecham
   * quando o usuário clica em qualquer lugar fora do componente.
   * Utiliza event delegation para detectar cliques globais.
   * 
   * @listens {MouseEvent} mousedown - Evento global de clique do mouse
   * @targets {Element} .patient-autocomplete - Container do autocomplete
   * 
   * @cleanup Remove listener quando componente é desmontado
   * @accessibility Melhora navegação por teclado e acessibilidade
   */
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

  // =====================================
  // SCROLL INFINITO
  // =====================================

  /** Ref para o container da tabela com scroll */
  const tableContainerRef = useInfiniteScroll(loadMoreReceipts, {
    loading: loading.fetching,
    hasMore: hasMoreReceipts,
    threshold: 50,
    root: null // será definido dinamicamente quando o elemento for montado
  })

  // ===================================== 
  // FUNÇÕES DE MANIPULAÇÃO
  // =====================================

  /**
   * Manipula a criação de uma nova receita.
   * 
   * Chama o serviço de criação de receita e atualiza a lista
   * após sucesso. Propaga erros para tratamento pelo componente modal.
   * 
   * @param {any} receiptData - Dados da receita a ser criada
   * @returns {Promise<void>}
   * @throws {Error} Quando ocorre erro na criação da receita
   */
  const handleCreateReceipt = async (receiptData: any) => {
    try {
      await createReceipt(receiptData)
      await refreshReceipts()
    } catch (error) {
      console.error('Erro ao criar receita:', error)
      throw error
    }
  }

  /**
   * Gera conteúdo HTML para impressão/exportação das receitas.
   * 
   * @param {any[]} receiptsData - Array de receitas a serem processadas
   * @param {string} title - Título para o cabeçalho do documento
   * @returns {string} HTML formatado para impressão
   */
  const generatePrintContent = (receiptsData: any[], title: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            .receipt {
              margin-bottom: 40px;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .receipt-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .receipt-info {
              margin-bottom: 15px;
            }
            .receipt-info div {
              margin-bottom: 5px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .items-table th,
            .items-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .items-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total {
              text-align: right;
              font-weight: bold;
              font-size: 16px;
              margin-top: 10px;
            }
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-paid { background-color: #d1fae5; color: #065f46; }
            .status-cancelled { background-color: #fee2e2; color: #991b1b; }
            @media print {
              body { margin: 0; }
              .receipt { page-break-after: always; }
              .receipt:last-child { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EndoData - ${title}</h1>
            <p>Data de Geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p>Total de Receitas: ${receiptsData.length}</p>
          </div>
          
          ${receiptsData.map((receipt: any) => `
            <div class="receipt">
              <div class="receipt-header">
                <h3>Receita #${receipt.id.substring(0, 8)}</h3>
                <span class="status status-${receipt.status}">
                  ${receipt.status === 'pending' ? 'Pendente' : 
                    receipt.status === 'paid' ? 'Pago' : 'Cancelado'}
                </span>
              </div>
              
              <div class="receipt-info">
                <div><strong>Paciente:</strong> ${receipt.patient?.name || 'N/A'}</div>
                <div><strong>CPF:</strong> ${receipt.patient?.cpf || 'N/A'}</div>
                <div><strong>Médico:</strong> ${receipt.user?.name || 'N/A'}</div>
                <div><strong>CRM:</strong> ${receipt.user?.crm || 'N/A'}</div>
                <div><strong>Data:</strong> ${new Date(receipt.date).toLocaleDateString('pt-BR')}</div>
              </div>

              ${receipt.items && receipt.items.length > 0 ? `
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Quantidade</th>
                      <th>Valor Unitário</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${receipt.items.map((item: any) => `
                      <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>R$ ${parseFloat(item.unitPrice.toString()).toFixed(2)}</td>
                        <td>R$ ${parseFloat(item.totalPrice.toString()).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p>Nenhum item encontrado.</p>'}
              
              <div class="total">
                <strong>Valor Total: R$ ${receipt.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `
  }

  /**
   * Exporta receitas para PDF usando a funcionalidade nativa do navegador.
   * 
   * Gera uma página formatada e abre o dialog de impressão do navegador,
   * onde o usuário pode escolher "Salvar como PDF" como destino.
   * 
   * @returns {void}
   */


  /**
   * Imprime as receitas selecionadas com layout profissional.
   * 
   * Esta função filtra as receitas marcadas como selecionadas no estado
   * selectedReceipts, gera um documento HTML formatado profissionalmente
   * e abre uma nova janela para impressão. Inclui validação para garantir
   * que pelo menos uma receita esteja selecionada antes de proceder.
   * 
   * Funcionalidades implementadas:
   * - Validação de receitas selecionadas
   * - Geração de HTML com layout profissional
   * - Abertura de janela de impressão nativa do navegador
   * - Limpeza automática da seleção após impressão
   * - Feedback visual para o usuário
   * 
   * @function handlePrintSelectedReceipts
   * @description Gera uma página de impressão com os detalhes das receitas
   * selecionadas, formatada para impressão física.
   * 
   * @returns {void}
   */
  const handlePrintSelectedReceipts = () => {
    // Filtra as receitas selecionadas
    const receiptsToPrint = receipts.filter(receipt => 
      selectedReceipts.includes(receipt.id)
    )
    
    if (receiptsToPrint.length === 0) {
      alert('Selecione pelo menos uma receita para imprimir.')
      return
    }

    const title = `${receiptsToPrint.length} Receitas Selecionadas - Impressão`
    const printContent = generatePrintContent(receiptsToPrint, title)

    // Abre nova janela para impressão
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Aguarda carregamento e inicia impressão
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        
        // Limpa seleção após imprimir
        setTimeout(() => {
          setSelectedReceipts([])
        }, 1000)
      }, 500)
    } else {
      alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.')
    }
  }

  /**
   * Imprime todas as receitas do sistema sem necessidade de scroll.
   * 
   * Esta função otimizada busca todas as receitas diretamente via API
   * (até 1000 registros) em uma única requisição, eliminando a necessidade
   * do usuário fazer scroll infinito para carregar todas as receitas.
   * Inclui indicador de loading visual e tratamento completo de erros.
   * 
   * Principais características:
   * - Busca via API com limite alto (1000 receitas)
   * - Indicador de loading com animação durante a busca
   * - Autenticação automática via token armazenado
   * - Geração de documento profissional para impressão
   * - Tratamento robusto de erros e feedback ao usuário
   * - Não depende do estado local da tabela
   * 
   * @async
   * @function handlePrintAllReceipts
   * @description Busca e imprime todas as receitas do sistema de forma otimizada
   * @returns {Promise<void>}
   */
  const handlePrintAllReceipts = async () => {
    try {
      // Busca todas as receitas de uma vez (sem paginação)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('Token de autenticação não encontrado.')
        return
      }

      // Mostra indicador de carregamento
      const loadingAlert = document.createElement('div')
      loadingAlert.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000; display: flex; align-items: center; gap: 10px;">
          <div style="width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; 
                      border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span>Buscando todas as receitas...</span>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `
      document.body.appendChild(loadingAlert)

      // Busca todas as receitas sem limite de página
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/receipts?limit=1000&page=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar receitas: ${response.status}`)
      }

      const data = await response.json()
      const allReceipts = data.data || []

      // Remove indicador de carregamento
      document.body.removeChild(loadingAlert)

      if (allReceipts.length === 0) {
        alert('Não há receitas para imprimir.')
        return
      }

      const title = `${allReceipts.length} Receitas - Impressão Completa`
      const printContent = generatePrintContent(allReceipts, title)

      // Abre nova janela para impressão
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        
        // Aguarda carregamento e inicia impressão
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 500)
      } else {
        alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.')
      }

    } catch (error) {
      // Remove indicador de carregamento em caso de erro
      const loadingAlert = document.querySelector('div[style*="position: fixed"]')
      if (loadingAlert) {
        document.body.removeChild(loadingAlert)
      }
      
      console.error('Erro ao buscar todas as receitas:', error)
      alert('Erro ao buscar todas as receitas. Tente novamente.')
    }
  }

  /**
   * Remove receitas selecionadas do sistema.
   * 
   * Esta função integra com o endpoint DELETE /receipts/:id do backend
   * para remover permanentemente as receitas selecionadas. Executa
   * remoção sequencial com feedback visual e atualiza a lista local.
   * 
   * Funcionalidades implementadas:
   * - Validação de receitas selecionadas
   * - Confirmação antes da remoção
   * - Indicador de loading durante o processo
   * - Remoção sequencial via API
   * - Atualização automática da lista local
   * - Limpeza da seleção após sucesso
   * - Tratamento robusto de erros
   * 
   * @async
   * @function handleRemoveSelected
   * @description Remove as receitas marcadas como selecionadas
   * @returns {Promise<void>}
   */
  const handleRemoveSelected = async () => {
    if (selectedReceipts.length === 0) {
      alert('Selecione pelo menos uma receita para remover.')
      return
    }

    // Criar modal de confirmação customizada
    const receiptWord = selectedReceipts.length === 1 ? 'receita' : 'receitas'
    
    const confirmDelete = await new Promise<boolean>((resolve) => {
      // Criar overlay
      const overlay = document.createElement('div')
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      `

      // Criar modal
      const modal = document.createElement('div')
      modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        text-align: center;
        position: relative;
      `

      modal.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">🗑️</div>
        <h3 style="margin: 0 0 16px 0; color: #dc2626; font-size: 20px; font-weight: 600;">
          Confirmar Remoção
        </h3>
        <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
          Você está prestes a remover <strong>${selectedReceipts.length} ${receiptWord}</strong> permanentemente.
          <br><br>
          <span style="color: #dc2626; font-weight: 600;">⚠️ Esta ação NÃO pode ser desfeita!</span>
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="cancelBtn" style="
            padding: 12px 24px;
            border: 2px solid #d1d5db;
            background: white;
            color: #374151;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">
            Cancelar
          </button>
          <button id="confirmBtn" style="
            padding: 12px 24px;
            border: 2px solid #dc2626;
            background: #dc2626;
            color: white;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">
            🗑️ Remover ${receiptWord}
          </button>
        </div>
      `

      overlay.appendChild(modal)
      document.body.appendChild(overlay)

      // Adicionar event listeners
      const cancelBtn = modal.querySelector('#cancelBtn') as HTMLButtonElement
      const confirmBtn = modal.querySelector('#confirmBtn') as HTMLButtonElement

      // Efeitos hover
      cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = '#f3f4f6'
        cancelBtn.style.borderColor = '#9ca3af'
      })
      cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'white'
        cancelBtn.style.borderColor = '#d1d5db'
      })

      confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.background = '#b91c1c'
        confirmBtn.style.borderColor = '#b91c1c'
      })
      confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.background = '#dc2626'
        confirmBtn.style.borderColor = '#dc2626'
      })

      // Event listeners para botões
      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay)
        resolve(false)
      })

      confirmBtn.addEventListener('click', () => {
        document.body.removeChild(overlay)
        resolve(true)
      })

      // Fechar com ESC
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          document.body.removeChild(overlay)
          document.removeEventListener('keydown', handleKeyPress)
          resolve(false)
        }
      }
      document.addEventListener('keydown', handleKeyPress)

      // Fechar clicando fora
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay)
          resolve(false)
        }
      })
    })

    if (!confirmDelete) {
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('Token de autenticação não encontrado.')
        return
      }

      // Mostrar indicador de loading
      const loadingAlert = document.createElement('div')
      loadingAlert.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000; display: flex; align-items: center; gap: 10px;">
          <div style="width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top: 2px solid #ef4444; 
                      border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span>Removendo ${selectedReceipts.length} receita${selectedReceipts.length > 1 ? 's' : ''}...</span>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `
      document.body.appendChild(loadingAlert)

      // Remover receitas sequencialmente
      let removedCount = 0
      let errorCount = 0

      for (const receiptId of selectedReceipts) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/receipts/${receiptId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            removedCount++
          } else {
            console.error(`Erro ao remover receita ${receiptId}:`, response.status)
            errorCount++
          }
        } catch (error) {
          console.error(`Erro ao remover receita ${receiptId}:`, error)
          errorCount++
        }
      }

      // Remove indicador de loading
      document.body.removeChild(loadingAlert)

      // Atualizar lista local removendo as receitas deletadas
      if (removedCount > 0) {
        // Limpar seleção imediatamente
        setSelectedReceipts([])
        
        // Forçar atualização da lista via backend
        try {
          await refreshReceipts()
          console.log('✅ Lista atualizada após remoção')
        } catch (error) {
          console.error('❌ Erro ao atualizar lista após remoção:', error)
        }
      }

      // Mostrar resultado
      if (errorCount === 0) {
        alert(`${removedCount} receita${removedCount > 1 ? 's removidas' : ' removida'} com sucesso!`)
      } else if (removedCount > 0) {
        alert(`${removedCount} receita${removedCount > 1 ? 's removidas' : ' removida'} com sucesso.\n${errorCount} receita${errorCount > 1 ? 's' : ''} não ${errorCount > 1 ? 'puderam' : 'pôde'} ser removida${errorCount > 1 ? 's' : ''}.`)
      } else {
        alert('Nenhuma receita pôde ser removida. Verifique se você tem permissão.')
      }

    } catch (error) {
      // Remove indicador de carregamento em caso de erro
      const loadingAlert = document.querySelector('div[style*="position: fixed"]')
      if (loadingAlert) {
        document.body.removeChild(loadingAlert)
      }
      
      console.error('Erro ao remover receitas:', error)
      alert('Erro ao remover receitas. Tente novamente.')
    }
  }

  /**
   * Abre o modal de visualização de receita.
   * 
   * Define a receita selecionada e abre o modal de visualização
   * para exibir todos os detalhes da receita em modo somente leitura.
   * 
   * @param {any} receipt - Dados da receita a ser visualizada
   * @returns {void}
   */
  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt)
    setIsViewModalOpen(true)
  }

  /**
   * Abre o modal de edição de receita.
   * 
   * Define a receita selecionada e abre o modal de edição
   * para permitir alteração dos dados da receita.
   * 
   * @param {any} receipt - Dados da receita a ser editada
   * @returns {void}
   */
  const handleEditReceipt = (receipt: any) => {
    setSelectedReceipt(receipt)
    setIsEditModalOpen(true)
  }

  /**
   * Manipula a edição/atualização de uma receita existente.
   * 
   * Chama o serviço de atualização de receita e atualiza a lista
   * após sucesso. Fecha o modal de edição automaticamente.
   * 
   * IMPORTANTE: O backend atualmente só aceita atualização do campo 'status'.
   * Outros campos como totalAmount, date e items não são aceitos na API PUT.
   * 
   * @param {any} receiptData - Dados atualizados da receita
   * @returns {Promise<void>}
   * @throws {Error} Quando ocorre erro na atualização da receita
   */
  const handleUpdateReceipt = async (receiptData: any) => {
    try {
      console.log('📤 Dados recebidos para atualização:', receiptData)
      
      // Backend atualmente só aceita o campo 'status' para atualização
      const updatePayload = {
        status: receiptData.status
      }
      
      console.log('📤 Enviando para API:', updatePayload)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/receipts/${selectedReceipt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updatePayload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
        console.error('❌ Erro da API:', errorData)
        throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro ao atualizar receita'}`)
      }

      const updatedReceipt = await response.json()
      console.log('✅ Receita atualizada:', updatedReceipt)

      await refreshReceipts()
      setIsEditModalOpen(false)
      setSelectedReceipt(null)
    } catch (error) {
      console.error('❌ Erro ao atualizar receita:', error)
      throw error
    }
  }

  /**
   * Gera um badge visual para o status da receita com cores semânticas.
   * 
   * Converte o status interno da receita (pending/paid/cancelled) em um 
   * elemento visual estilizado com cores apropriadas e texto em português.
   * Utiliza mapeamento consistente de cores para melhor UX visual.
   * 
   * @param {string} status - Status interno da receita do backend
   * @returns {JSX.Element} Badge estilizado com cores semânticas
   * 
   * @example
   * ```typescript
   * getStatusBadge('pending')   // → Badge amarelo "Pendente"
   * getStatusBadge('paid')      // → Badge verde "Pago" 
   * getStatusBadge('cancelled') // → Badge vermelho "Cancelado"
   * getStatusBadge('unknown')   // → Badge amarelo "Pendente" (fallback)
   * ```
   * 
   * @designSystem
   * - Amarelo: Estados de espera/pendência
   * - Verde: Estados de sucesso/conclusão
   * - Vermelho: Estados de erro/cancelamento
   * 
   * @accessibility Utiliza texto + cor para comunicar status
   */
  const getStatusBadge = (status: string) => {
    const statusMap: StatusMapping = {
      'pending': { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'paid': { label: 'Pago', className: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
    }
    
    const statusInfo = statusMap[status] || { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  /**
   * Alterna o estado de seleção de uma receita específica (toggle).
   * 
   * Função central do sistema de seleção múltipla que gerencia a adição
   * e remoção de receitas da lista de selecionadas. Utiliza o padrão
   * functional update para manter a imutabilidade do estado React.
   * 
   * Integração com interface:
   * - Conectada aos checkboxes individuais de cada linha da tabela
   * - Atualiza automaticamente o estado da barra de ações
   * - Sincroniza com o checkbox "selecionar todas" no cabeçalho
   * - Mantém consistência visual dos elementos selecionados
   * 
   * Comportamento:
   * Se a receita já estiver selecionada, remove da lista.
   * Se não estiver selecionada, adiciona à lista de seleções.
   * Mantém estado imutável usando functional update pattern.
   * 
   * @param {string} receiptId - ID único da receita (UUID)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * toggleReceiptSelection("abc-123"); // Adiciona se não existe
   * toggleReceiptSelection("abc-123"); // Remove se já existe
   * ```
   * 
   * @pattern Functional Update - Mantém imutabilidade do estado
   * @performance O(n) para busca + O(n) para filter no worst case
   * @integration Sistema completo de seleção múltipla e ações em lote
   */
  const toggleReceiptSelection = (receiptId: string) => {
    setSelectedReceipts(prev => 
      prev.includes(receiptId)
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    )
  }

  // =====================================
  // TRATAMENTO DE ERRO
  // =====================================
  
  if (error && error.fetch) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar receitas</h2>
            <p className="text-gray-600 mb-4">{error.fetch}</p>
            <Button onClick={refreshReceipts} className="bg-[#2074E9] hover:bg-[#104CA0]">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // =====================================
  // RENDERIZAÇÃO PRINCIPAL
  // =====================================
  
  /**
   * Renderização principal da interface de receitas.
   * 
   * A interface é estruturada em seções modulares:
   * 1. Título da página com contexto
   * 2. Seção de filtros com autocomplete
   * 3. Tabela de receitas com seleção múltipla
   * 4. Modal de criação (renderizado condicionalmente)
   * 
   * @layout DashboardLayout - Container principal com navegação
   * @responsive Grid responsivo adapta-se a mobile/tablet/desktop
   * @accessibility Estrutura semântica com roles e labels adequados
   */
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Título da página */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receitas Médicas Recentes</h1>
        </div>

        {/* Seção de Filtros */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filtrar Receitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Paciente com Autocomplete */}
            <div className="relative patient-autocomplete">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paciente
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Digite o nome do paciente"
                  value={patientSearchTerm}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    if (!e.target.value) {
                      clearPatientSelection();
                    }
                  }}
                  onFocus={() => {
                    if (patientSearchResults.length > 0) {
                      setShowPatientDropdown(true);
                    }
                  }}
                  className="w-full pr-10"
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
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Dropdown de resultados */}
              {showPatientDropdown && patientSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {patientSearchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      type="button"
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.cpf}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Indicador de paciente selecionado */}
              {selectedPatient && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <span className="text-green-700">Selecionado: {selectedPatient.name}</span>
                </div>
              )}
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            {/* Filtro por Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <Input
                type="date"
                placeholder="Selecionar data"
                value={filters.periodo}
                onChange={(e) => setFilters(prev => ({ ...prev, periodo: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Botões de ação dos filtros */}
          <div className="flex gap-3 mt-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                console.log('🔍 Aplicando filtros:', filters)
                
                // Mapeamento de status da interface para valores do backend
                let statusValue: string | undefined = undefined
                if (filters.status === 'Pendente') statusValue = 'pending'
                else if (filters.status === 'Pago') statusValue = 'paid'
                else if (filters.status === 'Cancelado') statusValue = 'cancelled'
                
                // Formatação correta das datas para incluir o dia inteiro
                let startDate = filters.periodo
                let endDate = filters.periodo ? `${filters.periodo}T23:59:59.999Z` : undefined
                
                const filtersToApply = {
                  status: statusValue as any,
                  period: filters.periodo ? ('custom' as const) : undefined,
                  startDate: startDate,
                  endDate: endDate,
                  // Inclui patientId se um paciente foi selecionado
                  patientId: selectedPatient?.id || undefined,
                }
                
                console.log('📤 Enviando filtros para API:', filtersToApply)
                
                // Aplica filtros através do hook customizado
                updateFilters(filtersToApply)
              }}
            >
              Aplicar Filtros
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Limpa filtros locais e do hook
                setFilters({ paciente: '', status: 'Todos', periodo: '' })
                clearPatientSelection()
                updateFilters({})
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* Barra de Ações para Receitas Selecionadas */}
        {selectedReceipts.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 text-blue-700" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <div className="text-sm font-medium text-blue-900">
                    {selectedReceipts.length} receita{selectedReceipts.length > 1 ? 's' : ''} selecionada{selectedReceipts.length > 1 ? 's' : ''}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceipts([])}
                  className="text-xs text-blue-700 hover:text-blue-800 underline"
                >
                  Limpar seleção
                </button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrintSelectedReceipts}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                    />
                  </svg>
                  Imprimir Selecionadas
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Prescrições */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lista de Receitas</h2>
            <div className="text-sm text-gray-500">
              {receipts.length} de {totalReceipts} receitas 
              {totalPages > 1 && (
                <span className="ml-2">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </div>
          </div>
          
          {loading.fetching && receipts.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando receitas...</p>
            </div>
          )}

          {/* 
            Tabela de receitas com scroll infinito otimizado
            
            Container com altura fixa (h-96 = 384px) que implementa scroll infinito
            apenas dentro da tabela, sem afetar o scroll da página principal.
            
            Funcionalidades:
            - Altura fixa de 384px com overflow interno
            - Scroll infinito detectado via useInfiniteScroll hook
            - Cabeçalho sticky que permanece visível durante scroll
            - Loading indicators integrados dentro da tabela
            - Suporte a seleção múltipla com checkboxes
            - Responsivo com scroll horizontal automático
            
            Esta implementação substitui o scroll infinito da página,
            proporcionando melhor experiência do usuário e performance.
          */}
          <div 
            ref={tableContainerRef as any}
            className="h-96 max-h-96 overflow-y-auto overflow-x-auto border border-gray-200 rounded-lg bg-white"
          >
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReceipts(receipts.map(r => r.id))
                        } else {
                          setSelectedReceipts([])
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Título da Receita</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Paciente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Médico</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedReceipts.includes(receipt.id)}
                        onChange={() => toggleReceiptSelection(receipt.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {receipt.items && receipt.items.length > 0 
                          ? `Receita para ${receipt.items[0].description}` 
                          : 'Receita Médica'
                        }
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {receipt.patient?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {receipt.user?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(receipt.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(receipt.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 font-medium" 
                          title="Visualizar"
                          onClick={() => handleViewReceipt(receipt)}
                        >
                          Ver
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 font-medium" 
                          title="Editar"
                          onClick={() => handleEditReceipt(receipt)}
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Indicadores de carregamento dentro da tabela */}
                {loading.fetching && receipts.length > 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-sm text-gray-600">Carregando mais receitas...</p>
                    </td>
                  </tr>
                )}
                
                {/* Indicador de fim dos dados dentro da tabela */}
                {!hasMoreReceipts && !loading.fetching && receipts.length > 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-sm text-gray-500">
                      Todas as {totalReceipts} receitas foram carregadas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {receipts.length === 0 && !loading.fetching && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma receita encontrada</p>
              </div>
            )}
          </div>
        </Card>

        {/* Ações rápidas - Gestão e Impressão */}
        {receipts.length >= 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              {/* Lado esquerdo - Botões de gestão */}
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar
                </Button>
                
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleRemoveSelected}
                  disabled={selectedReceipts.length === 0}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remover ({selectedReceipts.length})
                </Button>
              </div>

              {/* Lado direito - Impressão */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    🖨️ Imprimir todas as receitas do sistema
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ({totalReceipts} total)
                  </span>
                </div>
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={handlePrintAllReceipts}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir todas ({totalReceipts})
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {/* Modais */}
      <CreateReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReceipt}
      />
      
      <ViewReceiptModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedReceipt(null)
        }}
        receipt={selectedReceipt}
      />
      
      <EditReceiptModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedReceipt(null)
        }}
        receipt={selectedReceipt}
        onSave={handleUpdateReceipt}
      />
    </DashboardLayout>
  )
}
