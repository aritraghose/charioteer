import { Check, Plus } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useStored } from '@/hooks/use-stored'
import {
  PARKED_KEY,
  type ParkedThought,
  newParkedThought,
} from '@/lib/focus-store'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 140

/**
 * A place to set a thought down in one line so it does not have to be held in
 * the head or acted on right away. Kept on this device only.
 */
export function ThoughtParking({
  since,
  emptyText,
  className,
}: Readonly<{
  /** Only show thoughts parked after this time (for the running session). */
  since?: number
  emptyText: string
  className?: string
}>) {
  const [parked, setParked] = useStored<ParkedThought[]>(PARKED_KEY, [])
  const [draft, setDraft] = useState('')
  const visible = since ? parked.filter((item) => item.at >= since) : parked

  const add = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setParked((current) => [...current, newParkedThought(text)])
    setDraft('')
  }

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)}>
      <form onSubmit={add} className="flex items-center gap-2">
        <label htmlFor="park-thought" className="sr-only">
          Park a thought
        </label>
        <input
          id="park-thought"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          placeholder="Park a thought in one line"
          className="h-11 min-w-0 flex-1 rounded-full border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Park this thought"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:cursor-default disabled:opacity-40"
        >
          <Plus aria-hidden className="size-5" />
        </button>
      </form>

      {visible.length === 0 ? (
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {visible.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-2xl bg-card py-1.5 pr-1.5 pl-4 text-sm ring-1 ring-border"
            >
              <span className="min-w-0 flex-1 break-words">{item.text}</span>
              <button
                type="button"
                aria-label={`Clear "${item.text}"`}
                onClick={() =>
                  setParked((current) =>
                    current.filter((other) => other.id !== item.id),
                  )
                }
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
              >
                <Check aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
