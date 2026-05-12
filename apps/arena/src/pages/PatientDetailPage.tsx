/* eslint-disable react-hooks/set-state-in-effect */
import { JournalForm } from '@/features/journal/JournalForm'
import { JournalList } from '@/features/journal/JournalList'
import { PatientHeader } from '@/features/patients/PatientHeader'
import { fetchJournals, fetchPatient, updateJournalStatus } from '@/lib/api'
import { Patient, Journal, JournalStatus } from '@/types'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [journals, setJournals] = useState<Journal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetchJournals(id)
      .then((data) => setJournals(data))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return

    setIsLoading(true)
    fetchPatient(id)
      .then((data) => setPatient(data))
      .finally(() => setIsLoading(false))
  }, [id])

  if (!id) return null

  function handleStatusChange(journalId: string, status: JournalStatus) {
    updateJournalStatus(journalId, status).then(() =>
      fetchJournals(id).then(setJournals),
    )
  }

  function handleCreated(journal: Journal) {
    setJournals((prev) => [journal, ...prev])
  }

  return (
    <div>
      <Link
        to="/patients"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to patient list
      </Link>
      {patient && <PatientHeader patient={patient} />}
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
          {patient && (
            <JournalForm patientId={patient.id} onCreated={handleCreated} />
          )}
        </div>
      </div>
    </div>
  )
}
