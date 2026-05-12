import { Spinner } from '@medix/ui'
import type { Journal, JournalStatus } from '@/types'
import { JournalEntry } from './JournalEntry'

type JournalListProps = {
  journals: Journal[]
  isLoading: boolean
  onStatusChange: (id: string, status: JournalStatus) => void
}

export function JournalList({
  journals,
  isLoading,
  onStatusChange,
}: JournalListProps) {
  if (isLoading) return <Spinner />

  if (journals.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No journal entries yet
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {journals.map((entry) => (
        <JournalEntry
          key={entry.id}
          entry={entry}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
