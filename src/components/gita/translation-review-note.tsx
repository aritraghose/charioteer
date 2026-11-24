import { CheckCheck } from 'lucide-react'
import { ClaudeIcon, GeminiIcon } from '@/components/brand-icons'
import { cn } from '@/lib/utils'

/**
 * Quiet double-checkmark note indicating that the Gita translation was
 * done and reviewed by Claude Fable 5.2 and Gemini 4 Neon.
 * Always one line: in a narrow column the label shortens (the double check
 * still says it was reviewed) and the type scales down with the column.
 */
export function TranslationReviewNote({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn('@container', className)}>
      <p className="flex items-center gap-x-[0.4em] text-[clamp(0.5rem,3.5cqi,0.75rem)] leading-relaxed whitespace-nowrap text-muted-foreground/85">
        <CheckCheck
          aria-hidden
          className="size-[1.15em] shrink-0 text-yellow-ink"
          strokeWidth={2}
        />
        <span className="sr-only">Translated and Reviewed by</span>
        <span aria-hidden className="@[26.5rem]:hidden">
          Translated by
        </span>
        <span aria-hidden className="hidden @[26.5rem]:inline">
          Translated and Reviewed by
        </span>
        <span className="inline-flex items-center gap-[0.3em] font-medium text-foreground/85">
          <ClaudeIcon className="size-[1em]" />
          Claude Fable 5.2
        </span>
        <span>and</span>
        <span className="inline-flex items-center gap-[0.3em] font-medium text-foreground/85">
          <GeminiIcon className="size-[1em]" />
          Gemini 4 Neon
        </span>
      </p>
    </div>
  )
}
