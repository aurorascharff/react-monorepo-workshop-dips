import { Journal, JournalStatus } from '@/types'
import { Card, CardContent } from '@medix/ui'

const statusOptions: { value: JournalStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
]

export function JournalEntry({
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
          <h3 className="font-semibold leading-none tracking-tight">
            {entry.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-sm text-muted-foreground">
              {formatDate(entry.date)}
            </p>
            <select
              className="h-9 w-36 rounded-md border bg-background px-3 text-sm font-medium"
              aria-label={`Change status for ${entry.title}`}
              value={entry.status}
              onChange={(event) =>
                onStatusChange(entry.id, event.target.value as JournalStatus)
              }
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  )
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
