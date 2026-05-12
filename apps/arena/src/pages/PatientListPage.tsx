import { PatientList } from '@/features/patients/PatientList'
import { fetchPatients } from '@/lib/api'
import { Patient } from '@/types'
import { Spinner } from '@medix/ui'
import { useEffect, useState } from 'react'

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  useEffect(() => {
    fetchPatients()
      .then((data) => setPatients(data))
      .finally(() => setIsLoadingPatients(false))
  }, [])

  if (isLoadingPatients) return <Spinner />

  return <PatientList patients={patients}></PatientList>
}
