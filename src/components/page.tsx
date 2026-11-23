import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** The reading column every section page sits in. */
export function Page({
  title,
  lede,
  icon: Icon,
  gradient,
  children,
  className,
}: Readonly<{
  title: string
  lede?: string
  icon?: LucideIcon
  /** The section's gradient class, shown behind its icon. */
  gradient?: string
  children?: ReactNode
  className?: string
}>) {
  return (
    <main
      className={cn(
        'mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-5 pt-10 pb-16 sm:pt-16',
        className,
      )}
    >
      <header className="flex flex-col gap-4">
        {Icon && (
          <span
            className={cn(
              'flex size-14 items-center justify-center rounded-2xl text-white shadow-(--tile-shadow)',
              gradient,
            )}
          >
            <Icon className="size-7" strokeWidth={1.75} />
          </span>
        )}
        <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {lede && (
          <p className="max-w-[52ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            {lede}
          </p>
        )}
      </header>
      {children}
    </main>
  )
}

/** Says plainly that a section is not built yet. */
export function NotBuiltYet({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="max-w-[56ch] rounded-3xl border bg-card p-5 leading-relaxed text-pretty text-muted-foreground shadow-(--tile-shadow) backdrop-blur-md">
      {children}
    </p>
  )
}
