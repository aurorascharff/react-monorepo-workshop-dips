import { Activity } from 'lucide-react'
import { cn } from './lib/utils'

type BrandMarkProps = {
  product?: string
  compact?: boolean
  className?: string
}

export function BrandMark({ product, compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground',
          compact ? 'h-7 w-7' : 'h-8 w-8',
        )}
      >
        <Activity className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <div className={cn('font-bold', compact ? 'text-base leading-4' : 'text-lg leading-5')}>
          Medix
        </div>

        {product ? (
          <div
            className={cn(
              'mt-0.5 font-medium leading-3 text-muted-foreground',
              compact ? 'text-[0.625rem]' : 'text-[0.6875rem]',
            )}
          >
            {product}
          </div>
        ) : null}
      </div>
    </div>
  )
}