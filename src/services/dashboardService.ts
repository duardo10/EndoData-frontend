
import api from '@/lib/api'

/**
 * Busca métricas gerais do dashboard (quantidade de pacientes, prescrições, etc).
 * @returns {Promise<any>} Dados agregados do dashboard
 */
export async function getDashboardMetrics() {
  const { data } = await api.get('/dashboard/metrics')
  return data
}

/**
 * Busca dados para o gráfico de pacientes semanais.
 * @param {number} weeks - Número de semanas para o histórico (default: 12)
 * @returns {Promise<any>} Dados para o gráfico de pacientes
 */
export async function getWeeklyPatientsChart(weeks = 12) {
  const { data } = await api.get('/dashboard/weekly-patients', { params: { weeks } })
  return data
}

/**
 * Busca os medicamentos mais prescritos em determinado período.
 * @param {number} limit - Quantidade máxima de medicamentos (default: 4)
 * @param {number} period - Período em meses (default: 6)
 * @returns {Promise<any>} Lista dos medicamentos mais prescritos
 */
export async function getTopMedications(limit = 4, period = 6) {
  const { data } = await api.get('/dashboard/top-medications', { params: { limit, period } })
  return data
}
