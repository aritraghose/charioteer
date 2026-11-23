import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Flame } from '@/components/flame'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { CALM_ITEM, NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME } from '@/lib/seo'
import { cn } from '@/lib/utils'

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center gap-6 px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-xl text-base font-medium tracking-tight text-foreground"
        >
          <Flame className="h-6 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
          <span>{SITE_NAME}</span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 sm:ml-4 sm:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-yellow-soft/70 hover:text-foreground data-[status=active]:bg-pink-soft data-[status=active]:text-pink-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to={CALM_ITEM.to}
            className="hidden h-9 items-center gap-2 rounded-full bg-(image:--grad-lifeline) px-4 text-sm font-medium text-lifeline-ink shadow-(--lifeline-shadow) ring-1 ring-white/55 transition-[transform,filter] duration-200 hover:brightness-103 active:scale-[0.98] ring-inset motion-reduce:transition-none sm:inline-flex"
          >
            <CALM_ITEM.icon className="size-4" strokeWidth={2} />
            <span>{CALM_ITEM.label}</span>
          </Link>
          {/* Fixed size so the header does not shift when the switcher mounts. */}
          <div className="h-8 w-20">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col pb-24 sm:pb-0">{children}</div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/94 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {[
            NAV_ITEMS[0],
            NAV_ITEMS[1],
            { ...CALM_ITEM, label: CALM_ITEM.shortLabel },
            NAV_ITEMS[2],
            NAV_ITEMS[3],
          ].map((item) => {
            const isCalm = item.to === CALM_ITEM.to
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className={cn(
                    'group flex flex-col items-center gap-1 px-1 pt-2.5 pb-2 text-xs font-medium text-muted-foreground transition-colors',
                    isCalm
                      ? 'text-pink-ink'
                      : 'data-[status=active]:text-pink-ink',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                      isCalm
                        ? 'bg-(image:--grad-lifeline) text-lifeline-ink shadow-sm ring-1 ring-white/50 ring-inset'
                        : 'group-data-[status=active]:bg-pink-soft group-data-[status=active]:text-pink-ink',
                    )}
                  >
                    <item.icon className="size-[1.125rem]" strokeWidth={1.9} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
