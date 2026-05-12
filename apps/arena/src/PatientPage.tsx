/* eslint-disable react-hooks/set-state-in-effect */
import { Spinner } from '@medix/ui'
import { fetchJournals, fetchPatients, updateJournalStatus } from './lib/api'
import type { Journal, JournalStatus, Patient } from './types'
import { PatientHeader } from './features/patients/PatientHeader'
import { JournalList } from './features/journal/JournalList'
import { JournalForm } from './features/journal/JournalForm'
import { PatientList } from './features/patients/PatientList'
import { useState, useEffect } from 'react'

type PatientPageProps = {
  selectedId: string | null
  onSelectPatient: (id: string) => void
  onBack: () => void
}

export function PatientPage({
  selectedId,
  onSelectPatient,
  onBack,
}: PatientPageProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  useEffect(() => {
    fetchPatients()
      .then((data) => setPatients(data))
      .finally(() => setIsLoadingPatients(false))
  }, [])

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  useEffect(() => {
    setSelectedPatient(patients.find((p) => p.id === selectedId) ?? null)
  }, [patients, selectedId])

  if (isLoadingPatients) return <Spinner />

  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={onBack} />
  }

  return (
    <PatientList patients={patients} onSelect={onSelectPatient}></PatientList>
  )
}

function PatientDetail({
  patient,
  onBack,
}: {
  patient: Patient
  onBack: () => void
}) {
  const [journals, setJournals] = useState<Journal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetchJournals(patient.id)
      .then((data) => setJournals(data))
      .finally(() => setIsLoading(false))
  }, [patient.id])

  function handleStatusChange(journalId: string, status: JournalStatus) {
    updateJournalStatus(journalId, status).then(() =>
      fetchJournals(patient.id).then(setJournals),
    )
  }

  function handleCreated(journal: Journal) {
    setJournals((prev) => [journal, ...prev])
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to patient list
      </button>
      <PatientHeader patient={patient} />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Journal entries</h2>
          <JournalList
            journals={journals}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        </div>
        <div>
          <JournalForm patientId={patient.id} onCreated={handleCreated} />
        </div>
      </div>
    </div>
  )
}
