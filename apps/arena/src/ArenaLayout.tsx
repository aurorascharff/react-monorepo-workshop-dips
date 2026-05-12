import { LayoutDashboard, Users } from 'lucide-react'
import { BrandMark, cn } from '@medix/ui'

type Page = 'dashboard' | 'patients'

const navLinks: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
]

export function ArenaLayout({
  page,
  onPageChange,
  onShowDashboard,
  children,
}: {
  page: Page
  onPageChange: (page: Page) => void
  onShowDashboard: () => void
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 border-r bg-sidebar flex-col shrink-0">
        <div className="border-b p-4">
          <button
            type="button"
            onClick={onShowDashboard}
            className="flex items-center gap-2.5 text-left text-foreground transition-colors hover:text-foreground/80"
            aria-label="Go to dashboard"
          >
            <BrandMark product="Arena" />
          </button>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {navLinks.map(({ id, label, icon: Icon }) => (
            <NavButton
              key={id}
              active={page === id}
              onClick={() => onPageChange(id)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavButton>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              type="button"
              onClick={onShowDashboard}
              className="flex items-center gap-2.5 text-left text-foreground transition-colors hover:text-foreground/80"
              aria-label="Go to dashboard"
            >
              <BrandMark product="Arena" compact />
            </button>
            <nav className="flex items-center gap-1">
              {navLinks.map(({ id, label, icon: Icon }) => (
                <NavButton
                  key={id}
                  compact
                  active={page === id}
                  onClick={() => onPageChange(id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </NavButton>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavButton({
  active,
  compact,
  onClick,
  children,
}: {
  active: boolean
  compact?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center rounded-md font-medium transition-colors',
        compact ? 'gap-1.5 px-2.5 py-1.5 text-sm' : 'gap-2 px-3 py-2 text-sm',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {children}
    </button>
  )
}
