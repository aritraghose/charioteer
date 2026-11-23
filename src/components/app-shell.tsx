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
      <header className="mx-auto flex w-full max-w-5xl items-center gap-6 px-5 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight"
        >
          <Flame className="h-7" />
          {SITE_NAME}
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border bg-card p-1 backdrop-blur-md sm:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-(image:--grad-active) data-[status=active]:text-white data-[status=active]:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to={CALM_ITEM.to}
            className={cn(
              'hidden h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white shadow-(--tile-shadow) transition-[filter] hover:brightness-110 sm:inline-flex',
              CALM_ITEM.gradient,
            )}
          >
            <CALM_ITEM.icon className="size-4" strokeWidth={2} />
            {CALM_ITEM.label}
          </Link>
          {/* Fixed size so the header does not shift when the switcher mounts. */}
          <div className="h-8 w-20">
            <ThemeSwitcher className="bg-card backdrop-blur-md" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col pb-24 sm:pb-0">{children}</div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
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
                  className="group flex flex-col items-center gap-1 px-1 pt-2.5 pb-2 text-xs font-medium text-muted-foreground data-[status=active]:text-foreground"
                >
                  {/* The gradient sits on its own layer so it can fade in for the active tab. */}
                  <span className="relative flex h-8 w-12 items-center justify-center overflow-hidden rounded-full">
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-0 transition-opacity',
                        item.gradient,
                        isCalm
                          ? 'opacity-100'
                          : 'opacity-0 group-data-[status=active]:opacity-100',
                      )}
                    />
                    <item.icon
                      className={cn(
                        'relative size-[1.125rem]',
                        isCalm
                          ? 'text-white'
                          : 'group-data-[status=active]:text-white',
                      )}
                      strokeWidth={1.75}
                    />
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
