import { useDebounce } from '@/hooks/useDebounce'
import { Patient } from '@/types'
import { useState } from 'react'

export function usePatientFilter(patients: Patient[]) {
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>(
    'all',
  )

  const debouncedSearch = useDebounce(search, 1000)

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter
    return matchesSearch && matchesGender
  })

  return {
    search,
    setSearch,
    genderFilter,
    setGenderFilter,
    filteredPatients,
  }
}
