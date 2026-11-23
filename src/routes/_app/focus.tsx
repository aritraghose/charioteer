import { createFileRoute } from '@tanstack/react-router'
import { useId } from 'react'
import { NotBuiltYet, Page } from '@/components/page'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_app/focus')({
  head: () => ({
    meta: seo({
      title: `Focus | ${SITE_NAME}`,
      description: NAV_ITEMS[2].description,
    }),
  }),
  component: FocusPage,
})

function FocusPage() {
  const arcId = useId()

  return (
    <Page
      title="Focus"
      lede={NAV_ITEMS[2].description}
      icon={NAV_ITEMS[2].icon}
      badgeClass={NAV_ITEMS[2].badgeClass}
    >
      <section className="grid overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow) sm:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col items-center justify-between gap-6 bg-(image:--grad-sanctuary) p-7 text-center sm:border-r sm:border-border sm:p-8">
          <span className="rounded-full bg-yellow-soft px-3 py-1 text-xs font-medium text-yellow-ink ring-1 ring-border">
            Gentle timer preview
          </span>

          <div className="relative flex size-40 items-center justify-center">
            <svg
              viewBox="0 0 120 120"
              aria-hidden
              className="absolute inset-0 size-full -rotate-90"
            >
              <defs>
                <linearGradient id={arcId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--flame-top)" />
                  <stop offset="100%" stopColor="var(--flame)" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeWidth="7"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={`url(#${arcId})`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="314"
                strokeDashoffset="92"
              />
            </svg>
            <p className="text-4xl font-medium tracking-[-0.04em] text-foreground tabular-nums">
              25:00
            </p>
          </div>

          <p className="max-w-[26ch] text-sm leading-relaxed text-pretty text-muted-foreground">
            One clear intention and quiet visual progress, with no harsh alarms.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">
              Thought parking
            </h2>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
              When an intrusive or urgent thought arrives mid-session, set it
              down in one line so you do not have to hold it in your head or act
              on it right away.
            </p>
          </div>
          <ul className="flex flex-col gap-2.5 border-t border-border/80 pt-5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-pink-ink/65"
              />
              <span>Check the front door lock later</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-yellow-ink/70"
              />
              <span>Reply to email after this session</span>
            </li>
          </ul>
        </div>
      </section>

      <NotBuiltYet>
        Focus sessions are not built yet. Everything you write in your thought
        parking list will stay strictly on this device.
      </NotBuiltYet>
    </Page>
  )
}
