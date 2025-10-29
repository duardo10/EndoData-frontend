import api from '@/lib/api'

export async function getDashboardMetrics() {
  const { data } = await api.get('/dashboard/metrics')
  return data
}

export async function getWeeklyPatientsChart(weeks = 12) {
  const { data } = await api.get('/dashboard/weekly-patients', { params: { weeks } })
  return data
}

export async function getTopMedications(limit = 4, period = 6) {
  const { data } = await api.get('/dashboard/top-medications', { params: { limit, period } })
  return data
}
