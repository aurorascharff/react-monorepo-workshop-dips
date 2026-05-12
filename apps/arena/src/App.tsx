import { useState } from 'react'
import { Dashboard } from './Dashboard'
import { Layout } from './layouts/Layout'
import { PatientPage } from './PatientPage'

type Page = 'dashboard' | 'patients'

export function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  )

  function showPatients(patientId: string | null = null) {
    setSelectedPatientId(patientId)
    setPage('patients')
  }

  function showDashboard() {
    setSelectedPatientId(null)
    setPage('dashboard')
  }

  function handleNavigate(id: Page) {
    setPage(id)
    if (id === 'patients') setSelectedPatientId(null)
  }

  return (
    <Layout page={page} onNavigate={handleNavigate} onHome={showDashboard}>
      {page === 'dashboard' ? (
        <Dashboard onNavigate={showPatients} />
      ) : (
        <PatientPage
          selectedId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
          onBack={() => setSelectedPatientId(null)}
        />
      )}
    </Layout>
  )
}
