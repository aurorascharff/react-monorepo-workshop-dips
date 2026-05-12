import { type ReactEventHandler, useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Textarea,
} from '@medix/ui'
import {
  createJournal,
  fetchJournals,
  updateJournalStatus,
} from '../../lib/api'
import type { Journal, JournalStatus } from '../../types'

type PatientJournalSectionProps = {
  patientId: string
}

export function PatientJournalSection({ patientId }: PatientJournalSectionProps) {
  const [journals, setJournals] = useState<Journal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJournals(patientId)
      .then((data) => setJournals(data))
      .finally(() => setIsLoading(false))
  }, [patientId])

  function handleStatusChange(journalId: string, status: JournalStatus) {
    updateJournalStatus(journalId, status).then(() =>
      fetchJournals(patientId).then(setJournals),
    )
  }

  function handleCreated(journal: Journal) {
    setJournals((previous) => [journal, ...previous])
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Journal entries</h2>
        {isLoading ? (
          <Spinner />
        ) : journals.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No journal entries yet
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {journals.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <JournalForm patientId={patientId} onCreated={handleCreated} />
      </div>
    </div>
  )
}

const statusOptions: { value: JournalStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
]

function JournalEntryCard({
  entry,
  onStatusChange,
}: {
  entry: Journal
  onStatusChange: (id: string, status: JournalStatus) => void
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-none tracking-tight">
              {entry.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(entry.date)}
            </p>
          </div>
          <div className="shrink-0">
            <Select
              value={entry.status}
              onValueChange={(value) =>
                onStatusChange(entry.id, value as JournalStatus)
              }
            >
              <SelectTrigger
                className="w-36 text-sm font-medium"
                aria-label={`Change status for ${entry.title}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((statusOption) => (
                  <SelectItem key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  )
}

function JournalForm({
  patientId,
  onCreated,
}: {
  patientId: string
  onCreated: (journal: Journal) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit: ReactEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const title = String(formData.get('title') ?? '').trim()
    const date = String(formData.get('date') ?? '')
    const content = String(formData.get('content') ?? '').trim()

    if (!title || !date || !content) {
      setError('All fields are required.')
      return
    }

    setIsSubmitting(true)
    try {
      const journal = await createJournal(patientId, { title, date, content })
      onCreated(journal)
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">New journal entry</h2>

      <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mb-4 space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Short description of the entry"
          />
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" />
        </div>

        <div className="mb-6 space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            rows={5}
            placeholder="Clinical observations, interventions, and assessments..."
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save entry'}
        </Button>
      </form>
    </section>
  )
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
