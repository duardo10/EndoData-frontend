import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PatientSearch } from '@/components/patients/PatientSearch'

export default function Page() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <PatientSearch />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
