import { Link, createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Page } from '@/components/page'
import { RatingScale } from '@/components/rating-scale'
import { Button } from '@/components/ui/button'
import { useStored } from '@/hooks/use-stored'
import {
  EXPOSURE_LOG_KEY,
  type ExposureEntry,
  LADDER_KEY,
  type LadderStep,
  START_RATING,
  entriesFor,
  newLadderStep,
  sortLadder,
} from '@/lib/ladder-store'
import { SITE_NAME, seo } from '@/lib/seo'

const DESCRIPTION =
  'Build a ladder of triggers, from easiest to hardest, and practise facing them one step at a time.'

export const Route = createFileRoute('/_app/ladder')({
  head: () => ({
    meta: seo({
      title: `Facing intrusive thoughts | ${SITE_NAME}`,
      description: DESCRIPTION,
    }),
  }),
  component: LadderPage,
})

const MAX_STEP_LENGTH = 120

function LadderPage() {
  const [steps, setSteps, loaded] = useStored<LadderStep[]>(LADDER_KEY, [])
  const [log] = useStored<ExposureEntry[]>(EXPOSURE_LOG_KEY, [])
  const [text, setText] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const ladder = sortLadder(steps)

  const add = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || rating === null) return
    setSteps((current) => [...current, newLadderStep(trimmed, rating)])
    setText('')
    setRating(null)
  }

  return (
    <Page
      title="Facing intrusive thoughts"
      lede={DESCRIPTION}
      icon={ShieldCheck}
      badgeClass="bg-peach-soft text-peach-ink"
    >
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium tracking-[-0.025em]">
          How this works
        </h2>
        <div className="flex max-w-[60ch] flex-col gap-3 leading-relaxed text-pretty text-muted-foreground">
          <p>
            An intrusive thought sets off anxiety. A compulsion, such as
            checking, washing, asking for reassurance or going over it in your
            head, brings quick relief. That relief teaches the brain the
            thought was dangerous, so it comes back stronger.
          </p>
          <p>
            Here you face a trigger on purpose, in small steps, and do not do
            the compulsion. The anxiety rises and then falls by itself, and the
            brain learns the alarm was false.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[28px] border border-border bg-card p-6 shadow-(--surface-shadow) sm:p-8">
        <h2 className="text-lg font-medium tracking-[-0.02em]">
          Before you start
        </h2>
        <ul className="flex max-w-[60ch] list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
          <li>
            Go gradually. Begin with a step you rate around {START_RATING.min}{' '}
            or {START_RATING.max}, not the hardest one.
          </li>
          <li>
            This follows exposure and response prevention, the standard therapy
            for OCD. If you have a therapist, follow their plan over this one.
          </li>
          <li>
            Never choose a step that would put you or anyone else in real
            danger.
          </li>
          <li>
            If you are thinking about ending your life, or are in crisis,
            contact a crisis line or your local emergency number now.
          </li>
        </ul>
      </section>

      <section aria-labelledby="ladder-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2
            id="ladder-heading"
            className="text-2xl font-medium tracking-[-0.025em]"
          >
            Your ladder
          </h2>
          <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            Easiest at the top. What you write stays on this device.
          </p>
        </div>

        {loaded && ladder.length === 0 && (
          <p className="max-w-[56ch] border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            Your ladder is empty. Add a situation that sets off the anxiety and
            that you normally answer with a compulsion, then rate how hard it
            would be to face it without that.
          </p>
        )}

        {ladder.length > 0 && (
          <ol className="divide-y divide-border rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
            {ladder.map((step) => {
              const entries = entriesFor(log, step.id)
              const last = entries[entries.length - 1]
              return (
                <li
                  key={step.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6"
                >
                  <span
                    aria-label={`Rated ${step.rating} out of 10`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-peach-soft text-sm font-medium text-peach-ink tabular-nums ring-1 ring-border"
                  >
                    {step.rating}
                  </span>
                  <span className="flex min-w-40 flex-1 flex-col">
                    <span className="font-medium break-words">{step.text}</span>
                    <span className="text-sm text-muted-foreground">
                      {entries.length === 0
                        ? 'Not practised yet'
                        : `Practised ${entries.length === 1 ? 'once' : `${entries.length} times`}. Last time ${last.before} then ${last.after}.`}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Button asChild className="h-10 rounded-full px-5">
                      <Link to="/ladder/$stepId" params={{ stepId: step.id }}>
                        Practise
                      </Link>
                    </Button>
                    <button
                      type="button"
                      aria-label={`Remove "${step.text}"`}
                      onClick={() =>
                        setSteps((current) =>
                          current.filter((other) => other.id !== step.id),
                        )
                      }
                      className="flex size-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </span>
                </li>
              )
            })}
          </ol>
        )}

        <form
          onSubmit={add}
          className="flex flex-col gap-5 rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) sm:p-8"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="ladder-step" className="text-lg font-medium">
              Add a step
            </label>
            <input
              id="ladder-step"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={MAX_STEP_LENGTH}
              autoComplete="off"
              placeholder="For example: leave the house after locking the door once"
              className="h-11 w-full rounded-full border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              How hard would it be to face this without the compulsion?
            </p>
            <RatingScale
              label="How hard this step would be"
              value={rating}
              onChange={setRating}
              lowLabel="Easy"
              highLabel="The hardest"
              className="sm:max-w-md"
            />
          </div>
          <Button
            type="submit"
            disabled={!text.trim() || rating === null}
            className="h-11 w-fit rounded-full px-7 text-base"
          >
            Add to ladder
          </Button>
        </form>
      </section>
    </Page>
  )
}
