import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** The calm reading column every section page sits in. */
export function Page({
  title,
  lede,
  icon: Icon,
  badgeClass = 'bg-pink-soft text-pink-ink',
  accent = 'default',
  children,
  className,
}: Readonly<{
  title: string
  lede?: string
  icon?: LucideIcon
  /** Background and text color classes for the section icon badge. */
  badgeClass?: string
  /** 'lifeline' gives the Calm page its bright pink-to-yellow sunbeam mark. */
  accent?: 'default' | 'lifeline'
  children?: ReactNode
  className?: string
}>) {
  return (
    <main
      className={cn(
        'mx-auto flex w-full max-w-2xl flex-1 flex-col gap-11 px-5 pt-10 pb-20 sm:px-8 sm:pt-16',
        className,
      )}
    >
      <header className="flex flex-col gap-5">
        {Icon && (
          <span
            className={cn(
              'flex size-12 items-center justify-center rounded-2xl',
              accent === 'lifeline'
                ? 'border border-lifeline-border bg-(image:--lifeline-surface) text-lifeline-badge-ink shadow-(--lifeline-shadow)'
                : badgeClass,
            )}
          >
            <Icon className="size-5" strokeWidth={1.9} />
          </span>
        )}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl leading-[1.06] font-medium tracking-[-0.036em] text-balance text-foreground sm:text-5xl">
            {title}
          </h1>
          {lede && (
            <p className="max-w-[52ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              {lede}
            </p>
          )}
        </div>
      </header>
      {children}
    </main>
  )
}

/** Plain, unboxed status note while a section is still being built. */
export function NotBuiltYet({
  title = 'In progress',
  children,
}: Readonly<{
  title?: string
  children: ReactNode
}>) {
  return (
    <section className="flex flex-col gap-1.5 border-l-2 border-primary/50 pl-4">
      <h2 className="text-sm font-medium text-pink-ink">{title}</h2>
      <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
        {children}
      </p>
    </section>
  )
}
