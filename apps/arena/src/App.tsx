import { useState } from 'react'
import { Button } from '@medix/ui'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { ArenaLayout } from './ArenaLayout'
import { Dashboard } from './Dashboard'
import { PatientPage } from './PatientPage'
import { logError } from './lib/logger'

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

  function changePage(nextPage: Page) {
    setPage(nextPage)

    if (nextPage === 'patients') {
      setSelectedPatientId(null)
    }
  }

  return (
    <ArenaLayout
      page={page}
      onPageChange={changePage}
      onShowDashboard={showDashboard}
    >
      <ErrorBoundary
        FallbackComponent={PageContentFallback}
        onError={(error) => {
          logError(error, 'Page content render failed')
        }}
        resetKeys={[page, selectedPatientId]}
      >
        {page === 'dashboard' ? (
          <Dashboard onNavigate={showPatients} />
        ) : (
          <PatientPage
            selectedId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            onBack={() => setSelectedPatientId(null)}
          />
        )}
      </ErrorBoundary>
    </ArenaLayout>
  )
}

function PageContentFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We could not load this page section. The app shell is still available, so
        you can go back or try again.
      </p>
      <Button type="button" className="mt-4" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </section>
  )
}
