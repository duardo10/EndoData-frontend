
import api from '@/lib/api'


/**
 * Busca métricas gerais do dashboard, como quantidade de pacientes, prescrições, receitas e outros indicadores.
 *
 * @async
 * @function getDashboardMetrics
 * @returns {Promise<object>} Objeto com dados agregados do dashboard
 * @throws {Error} Se houver falha na requisição à API
 *
 * @example
 * const metrics = await getDashboardMetrics();
 * console.log(metrics.totalPatients);
 *
 * @see https://docs.endodata.com/dashboard-api
 * @remarks
 * Use este serviço para alimentar gráficos e cards de resumo na tela principal do dashboard.
 */
export async function getDashboardMetrics() {
  const { data } = await api.get('/dashboard/metrics')
  return data
}


/**
 * Busca dados para o gráfico de pacientes semanais, retornando a evolução do número de pacientes ao longo do tempo.
 *
 * @async
 * @function getWeeklyPatientsChart
 * @param {number} [weeks=12] - Número de semanas para o histórico (padrão: 12)
 * @returns {Promise<Array<{week: string, count: number}>>} Array de objetos com semana e quantidade de pacientes
 * @throws {Error} Se houver falha na requisição à API
 *
 * @example
 * const chartData = await getWeeklyPatientsChart(8);
 * chartData.forEach(({week, count}) => console.log(week, count));
 *
 * @see https://docs.endodata.com/dashboard-api#weekly-patients
 * @remarks
 * Ideal para alimentar gráficos de linha ou barra na tela de dashboard.
 */
export async function getWeeklyPatientsChart(weeks = 12) {
  const { data } = await api.get('/dashboard/weekly-patients', { params: { weeks } })
  return data
}


/**
 * Busca os medicamentos mais prescritos em determinado período, útil para relatórios e gráficos de tendências.
 *
 * @async
 * @function getTopMedications
 * @param {number} [limit=4] - Quantidade máxima de medicamentos a retornar (padrão: 4)
 * @param {number} [period=6] - Período em meses para análise (padrão: 6)
 * @returns {Promise<Array<{medication: string, count: number}>>} Array de medicamentos e suas quantidades
 * @throws {Error} Se houver falha na requisição à API
 *
 * @example
 * const meds = await getTopMedications(5, 12);
 * meds.forEach(({medication, count}) => console.log(medication, count));
 *
 * @see https://docs.endodata.com/dashboard-api#top-medications
 * @remarks
 * Útil para dashboards, relatórios e recomendações clínicas.
 */
export async function getTopMedications(limit = 4, period = 6) {
  const { data } = await api.get('/dashboard/top-medications', { params: { limit, period } })
  return data
}
