import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { GITHUB_REPO_URL, GitHubIcon } from '@/components/brand-icons'
import { Logo } from '@/components/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { CALM_ITEM, NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME } from '@/lib/seo'
import { cn } from '@/lib/utils'

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <header className="mx-auto flex w-full max-w-5xl items-center gap-6 px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-xl text-base font-medium tracking-tight text-foreground"
        >
          <Logo className="size-6 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
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

        <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
          <Link
            to={CALM_ITEM.to}
            className="hidden h-9 items-center gap-2 rounded-full border border-lifeline-border bg-(image:--lifeline-surface) px-4 text-sm font-medium text-lifeline-ink shadow-(--lifeline-shadow) transition-[background-image,border-color,transform] duration-200 hover:bg-(image:--lifeline-surface-hover) active:scale-[0.98] motion-reduce:transition-none sm:inline-flex"
          >
            <CALM_ITEM.icon
              className="size-4 text-lifeline-badge-ink"
              strokeWidth={1.9}
            />
            <span>{CALM_ITEM.label}</span>
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground sm:h-9 sm:px-3.5 sm:text-sm"
          >
            <GitHubIcon className="size-3.5 sm:size-4" />
            <span>GitHub</span>
          </a>
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
                        ? 'border border-lifeline-border bg-(image:--lifeline-surface) text-lifeline-badge-ink'
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
