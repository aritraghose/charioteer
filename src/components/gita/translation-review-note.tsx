import { CheckCheck } from 'lucide-react'
import { ClaudeIcon, GeminiIcon } from '@/components/brand-icons'
import { cn } from '@/lib/utils'

/**
 * Quiet double-checkmark note indicating that the Gita translation was
 * done and reviewed by Claude Fable 5.2 and Gemini 4 Neon.
 */
export function TranslationReviewNote({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <p
      className={cn(
        'flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs leading-relaxed text-muted-foreground/85',
        className,
      )}
    >
      <CheckCheck
        aria-hidden
        className="size-3.5 shrink-0 text-yellow-ink"
        strokeWidth={2}
      />
      <span>Translated and Reviewed by</span>
      <span className="inline-flex items-center gap-1 font-medium text-foreground/85">
        <ClaudeIcon className="size-3" />
        Claude Fable 5.2
      </span>
      <span>and</span>
      <span className="inline-flex items-center gap-1 font-medium text-foreground/85">
        <GeminiIcon className="size-3" />
        Gemini 4 Neon
      </span>
    </p>
  )
}
