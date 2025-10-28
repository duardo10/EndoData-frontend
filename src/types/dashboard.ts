export interface DashboardMetrics {
  totalPatients: number
  patientsRegisteredToday: number
  patientsRegisteredThisWeek: number
  monthlyRevenue: number
  activePrescriptions: number
  monthlyReceipts: number
  averageReceiptValue: number
}

export interface WeeklyPatientsDataPoint {
  weekStart: string
  weekEnd: string
  newPatients: number
  weekLabel: string
}

export interface WeeklyPatientsChart {
  data: WeeklyPatientsDataPoint[]
  totalWeeks: number
  generatedAt: string
}

export interface TopMedication {
  name: string
  totalPrescriptions: number
  percent: number
}

export interface TopMedications {
  medications: TopMedication[]
  total: number
  periodMonths: number
}
