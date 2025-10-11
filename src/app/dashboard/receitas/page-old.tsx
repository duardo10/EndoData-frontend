'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Download, FileText } from 'lucide-react'

/**
 * Interface para os dados de uma receita
 */
interface Receita {
  id: string
  titulo: string
  paciente: string
  medico: string
  data: string
  status: 'ativa' | 'renovada' | 'expirada'
}

/**
 * Dados mock das receitas
 */
const receitasMock: Receita[] = [
  {
    id: '1',
    titulo: 'Receita para Hipertensão',
    paciente: 'João Silva',
    medico: 'Dra. Ana Costa',
    data: '10/05/2024',
    status: 'ativa'
  },
  {
    id: '2',
    titulo: 'Prescrição de Antibiótico',
    paciente: 'Maria Oliveira',
    medico: 'Dr. Pedro Santos',
    data: '08/05/2024',
    status: 'renovada'
  },
  {
    id: '3',
    titulo: 'Receita de Rotina',
    paciente: 'Carlos Souza',
    medico: 'Dra. Laura Mendes',
    data: '01/04/2024',
    status: 'expirada'
  },
  {
    id: '4',
    titulo: 'Receita para Diabetes',
    paciente: 'Ana Pereira',
    medico: 'Dr. Ricardo Alves',
    data: '15/03/2024',
    status: 'ativa'
  },
  {
    id: '5',
    titulo: 'Receita de Antidepressivo',
    paciente: 'Pedro Lima',
    medico: 'Dr. Lucas Martins',
    data: '22/04/2024',
    status: 'ativa'
  },
  {
    id: '6',
    titulo: 'Prescrição de Analgésico',
    paciente: 'Sofia Rocha',
    medico: 'Dra. Gabriela Nunes',
    data: '05/05/2024',
    status: 'renovada'
  }
]

/**
 * Componente Sidebar
 */
const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: '🏠', label: 'Início', active: false },
    { icon: '👥', label: 'Pacientes', active: false },
    { icon: '📋', label: 'Prescrição', active: false },
    { icon: '�', label: 'Receitas', active: true },
    { icon: '📊', label: 'Relatórios', active: false },
    { icon: '⚙️', label: 'Configurações', active: false },
    { icon: '❓', label: 'Ajuda', active: false }
  ]

  return (
    <div className={styles.sidebarContainer}>
      {/* Logo EndoData */}
      <div className={styles.sidebarLogo}>
        <div className={styles.logoText}>
          <span className={styles.logoIcon}>⚡</span>
          EndoData
        </div>
      </div>
      
      {/* Menu */}
      <div className={styles.sidebarMenu}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`${styles.sidebarMenuItem} ${item.active ? styles.selected : ''}`}
          >
            <span className={styles.sidebarMenuIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Componente Header
 */
const Header: React.FC = () => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>Receitas Médicas Recentes</h1>
    </div>
  )
}

/**
 * Componente de Filtros
 */
const FiltrosReceitas: React.FC = () => {
  return (
    <div className={styles.filtersContainer}>
      <h2 className={styles.sectionTitle}>Filtrar Receitas</h2>
      <div className={styles.filterRow}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Paciente</label>
          <input 
            type="text" 
            placeholder="Nome do Paciente" 
            className={styles.input}
          />
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Status</label>
          <select className={styles.select}>
            <option value="">Todos</option>
            <option value="ativa">Ativa</option>
            <option value="renovada">Renovada</option>
            <option value="expirada">Expirada</option>
          </select>
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Período</label>
          <input 
            type="date" 
            className={styles.input}
            placeholder="Selecionar data"
          />
        </div>
        <div className={styles.filterField}>
          <button className={styles.primaryButton}>
            Aplicar Filtros
          </button>
        </div>
        <div className={styles.filterField}>
          <button className={styles.secondaryButton}>
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente da Lista de Receitas
 */
const ListaReceitas: React.FC<{ receitas: Receita[] }> = ({ receitas }) => {
  return (
    <div className={styles.receitasListContainer}>
      <h2 className={styles.sectionTitle}>Lista de Prescrições</h2>
      <table className={styles.receitasTable}>
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Título da Receita</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data</th>
            <th>Status</th>
            <th style={{ width: '80px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {receitas.map((receita) => (
            <tr key={receita.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td style={{ fontWeight: '500', color: '#111827' }}>{receita.titulo}</td>
              <td>{receita.paciente}</td>
              <td>{receita.medico}</td>
              <td>{receita.data}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles[receita.status]}`}>
                  {receita.status === 'ativa' ? 'Ativa' : 
                   receita.status === 'renovada' ? 'Renovada' : 'Expirada'}
                </span>
              </td>
              <td>
                <button className={styles.actionButton} title="Visualizar">
                  👁️
                </button>
                <button className={styles.actionButton} title="Editar">
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Componente de Exportação
 */
const ExportacaoReceitas: React.FC = () => {
  return (
    <div className={styles.receitasListContainer}>
      <h2 className={styles.sectionTitle}>Opções de Exportação</h2>
      <div className={styles.exportContainer}>
        <button className={styles.exportPdfButton}>
          <span>📄</span>
          Exportar para PDF
        </button>
        <button className={styles.exportDocxButton}>
          <span>📝</span>
          Exportar para DOCX
        </button>
      </div>
    </div>
  )
}

/**
 * Página de Receitas
 * 
 * @description Página para gerenciar receitas médicas
 * 
 * @returns {React.ReactElement} Página de receitas
 */
export default function Receitas(): React.ReactElement {
  const [receitas] = useState<Receita[]>(receitasMock)

  return (
    <>
      <Sidebar />
      <Header />
      <div className={styles.mainContainer}>
        <FiltrosReceitas />
        <ListaReceitas receitas={receitas} />
        <ExportacaoReceitas />
      </div>
    </>
  )
}