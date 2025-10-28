
'use client'


import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { CalendarDays, FileDown } from 'lucide-react'
import { getDashboardMetrics, getWeeklyPatientsChart, getTopMedications } from '@/services/dashboardService'
import type { DashboardMetrics, WeeklyPatientsChart, TopMedications } from '@/types/dashboard'

const COLORS = ['#2074E9', '#34D399', '#F59E42', '#F43F5E']

export default function Relatorios(): React.ReactElement {
  const [periodo, setPeriodo] = useState('2025')
  const [busca, setBusca] = useState('')
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [weeklyPatients, setWeeklyPatients] = useState<WeeklyPatientsChart | null>(null)
  const [topMedications, setTopMedications] = useState<TopMedications | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getDashboardMetrics(),
      getWeeklyPatientsChart(12),
      getTopMedications(4, 6),
    ]).then(([metricsData, weeklyData, medsData]) => {
      setMetrics(metricsData)
      setWeeklyPatients(weeklyData)
      setTopMedications(medsData)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Relatórios e Estatísticas</h1>
            <p className="text-gray-600 mt-1">Acompanhe métricas, gráficos e exporte relatórios para tomada de decisão.</p>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="search"
              placeholder="Buscar paciente, prescrição..."
              className="w-56"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            <Input
              type="number"
              min="2020"
              max="2025"
              value={periodo}
              onChange={e => setPeriodo(e.target.value)}
              className="w-24"
              aria-label="Ano do relatório"
            />
            <Button variant="outline" className="gap-2">
              <CalendarDays className="w-4 h-4" /> Filtrar
            </Button>
            <Button variant="secondary" className="gap-2">
              <FileDown className="w-4 h-4" /> Exportar
            </Button>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="shadow-md animate-pulse h-28" />
            ))
          ) : metrics && (
            <>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Total de Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-[#2074E9]">{metrics.totalPatients}</span>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Prescrições Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-[#2074E9]">{metrics.activePrescriptions}</span>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Receitas Emitidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-[#2074E9]">{metrics.monthlyReceipts}</span>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Receita do Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-[#2074E9]">R$ {metrics.monthlyRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gráfico de barras */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Novos pacientes por semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyPatients?.data || []}>
                    <XAxis dataKey="weekLabel" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newPatients" fill="#2074E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de pizza */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Medicamentos mais prescritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topMedications?.medications || []}
                      dataKey="totalPrescriptions"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {(topMedications?.medications || []).map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}