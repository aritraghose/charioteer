import { createFileRoute } from '@tanstack/react-router'
import { ExposurePractice } from '@/components/exposure-practice'
import { SITE_NAME, seo } from '@/lib/seo'

/** Practising one ladder step, on its own screen without the app navigation. */
export const Route = createFileRoute('/ladder_/$stepId')({
  head: () => ({
    meta: seo({ title: `Practising a step | ${SITE_NAME}`, noindex: true }),
  }),
  component: StepRoute,
})

function StepRoute() {
  const { stepId } = Route.useParams()
  return <ExposurePractice key={stepId} stepId={stepId} />
}
