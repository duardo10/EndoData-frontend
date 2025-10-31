
'use client'



import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { CalendarDays, FileDown } from 'lucide-react'
import { getDashboardMetrics, getWeeklyPatientsChart, getTopMedications } from '@/services/dashboardService'
import type { DashboardMetrics, WeeklyPatientsChart, TopMedications } from '@/types/dashboard'
import { useUserProfile } from '@/hooks/useUserProfile'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import { Badge } from '@/components/ui/badge'

const COLORS = ['#2074E9', '#34D399', '#F59E42', '#F43F5E']

export default function Relatorios(): React.ReactElement {
  const handleExport = () => {
    let content = `<div style='font-family:sans-serif;padding:24px;'>`;
    content += `<h2>Relatório</h2>`;
    if (user) {
      content += `<p><b>Médico:</b> ${user.name} (${user.especialidade})<br/><b>CRM:</b> ${user.crm}</p>`;
    }
    if (metrics) {
      content += `<h3>Resumo de Receitas</h3>`;
      content += `<p><b>Receitas Emitidas no Mês:</b> ${metrics.monthlyReceipts}</p>`;
      content += `<p><b>Receita Total do Mês:</b> R$ ${metrics.monthlyRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>`;
      content += `<p><b>Valor Médio das Receitas:</b> R$ ${metrics.averageReceiptValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>`;
    }
    if (topMedications && topMedications.medications.length > 0) {
      content += `<h3>Medicamentos mais prescritos</h3><ul>`;
      topMedications.medications.forEach((med: { name: string; totalPrescriptions: number; percent: number }) => {
        content += `<li>${med.name} - ${med.totalPrescriptions} prescrições (${med.percent}%)</li>`;
      });
      content += `</ul>`;
    }
    content += `</div>`;
    const printWindow = window.open('', '', 'width=700,height=600');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  const [periodo, setPeriodo] = useState('2025')
  const [busca, setBusca] = useState('')
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [weeklyPatients, setWeeklyPatients] = useState<WeeklyPatientsChart | null>(null)
  const [topMedications, setTopMedications] = useState<TopMedications | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: loadingUser } = useUserProfile()

  // Mapeia os dados do backend para o formato esperado pelo PieChart
  const pieData = (topMedications?.medications || []).map(med => ({
    name: med.name,
    value: med.totalPrescriptions,
    percentage: med.percent
  }))

  // Função para buscar dados do dashboard do banco JPA
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [metricsData, weeklyData, medsData] = await Promise.all([
        getDashboardMetrics(),
        getWeeklyPatientsChart(12),
        getTopMedications(4, 6),
      ])
      setMetrics(metricsData)
      setWeeklyPatients(weeklyData)
      setTopMedications(medsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Boas-vindas */}
        {!loadingUser && user && (
          <WelcomeSection
            userName={user.name}
            userSpecialty={user.especialidade}
            userCrm={user.crm}
          />
        )}

        {/* Filtros e ações */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2074E9]">Relatórios e Estatísticas</h2>
              <CardDescription className="text-gray-700 mt-1">Acompanhe métricas, gráficos e exporte relatórios para tomada de decisão.</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Button variant="secondary" className="gap-2" onClick={handleExport}>
                <FileDown className="w-4 h-4" /> Exportar
              </Button>
              <Button variant="ghost" className="gap-2" onClick={fetchDashboardData} disabled={loading}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" /></svg>
                Atualizar Dados
              </Button>
            </div>
          </div>
        </Card>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="shadow-md animate-pulse h-28 bg-white/60" />
            ))
          ) : metrics && (
            <>
              <Card className="shadow-md border-0 bg-gradient-to-br from-[#2074E9]/10 to-white">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Pacientes</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-700">Total de Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-[#2074E9]">{metrics.totalPatients}</span>
                </CardContent>
              </Card>
              <Card className="shadow-md border-0 bg-gradient-to-br from-[#34D399]/10 to-white">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Prescrições</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-700">Prescrições Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-[#34D399]">{metrics.activePrescriptions}</span>
                </CardContent>
              </Card>
              <Card className="shadow-md border-0 bg-gradient-to-br from-[#F59E42]/10 to-white">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Receitas</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-700">Receitas Emitidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-[#F59E42]">{metrics.monthlyReceipts}</span>
                </CardContent>
              </Card>
              <Card className="shadow-md border-0 bg-gradient-to-br from-[#2074E9]/10 to-[#34D399]/10 to-white">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Financeiro</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-700">Receita do Mês (apenas receitas pagas)</CardTitle>
                  <CardDescription className="text-xs text-gray-500 mt-1">Exibe apenas o valor das receitas com status <b>"pago"</b> no mês atual.</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-[#2074E9]">R$ {metrics.monthlyRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gráfico de barras */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-blue-100/60 to-white">
            <CardHeader>
              <CardTitle className="text-lg text-[#2074E9]">Novos pacientes por semana</CardTitle>
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
          <Card className="shadow-md border-0 bg-gradient-to-br from-green-100/60 to-white">
            <CardHeader>
              <CardTitle className="text-lg text-[#34D399]">Medicamentos mais prescritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                {(pieData.length === 0 || pieData.every(item => item.value === 0)) ? (
                  <span className="text-gray-500 text-lg">Sem dados para exibir</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}