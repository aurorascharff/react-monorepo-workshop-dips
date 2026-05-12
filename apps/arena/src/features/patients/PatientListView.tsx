import {
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@medix/ui'
import type { Patient } from '../../types'

type GenderFilter = 'all' | 'male' | 'female'

type PatientListViewProps = {
  patients: Patient[]
  filteredPatients: Patient[]
  search: string
  genderFilter: GenderFilter
  onSearchChange: (value: string) => void
  onGenderFilterChange: (value: GenderFilter) => void
  onSelectPatient: (id: string) => void
}

export function PatientListView({
  patients,
  filteredPatients,
  search,
  genderFilter,
  onSearchChange,
  onGenderFilterChange,
  onSelectPatient,
}: PatientListViewProps) {
  return (
    <div>
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <p className="text-sm text-muted-foreground">
          {filteredPatients.length} of {patients.length} patients
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="patient-search">Search patients</Label>
          <Input
            id="patient-search"
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or diagnosis..."
          />
        </div>
        <div className="flex flex-col gap-2 sm:w-40">
          <Label htmlFor="gender-filter">Gender</Label>
          <Select
            value={genderFilter}
            onValueChange={(value) => onGenderFilterChange(value as GenderFilter)}
          >
            <SelectTrigger id="gender-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No patients found</p>
      ) : (
        <div className="grid gap-3">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelectPatient(patient.id)}
              className="block w-full text-left text-inherit no-underline"
            >
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {calculateAge(patient.dateOfBirth)} years ·{' '}
                        {patient.gender === 'male' ? 'Male' : 'Female'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ID: {patient.id}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {patient.diagnosis}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function calculateAge(dateOfBirth: string): number {
  const born = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - born.getFullYear()
  const month = today.getMonth() - born.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < born.getDate())) {
    age--
  }

  return age
}
