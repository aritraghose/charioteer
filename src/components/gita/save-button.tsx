import { Bookmark } from 'lucide-react'
import { useStored } from '@/hooks/use-stored'
import { SAVED_KEY } from '@/lib/gita-reading'
import { cn } from '@/lib/utils'

export function useSavedVerses() {
  return useStored<string[]>(SAVED_KEY, [])
}

/** Saves a verse to the list on the Gita page. Kept on this device only. */
export function SaveButton({
  reference,
  saved,
  onToggle,
  withLabel = false,
  className,
}: Readonly<{
  /** "chapter.verse" */
  reference: string
  saved: boolean
  onToggle: (reference: string) => void
  withLabel?: boolean
  className?: string
}>) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${reference} from saved` : `Save ${reference}`}
      onClick={() => onToggle(reference)}
      className={cn(
        'inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground',
        withLabel ? 'px-3.5' : 'w-9',
        saved && 'text-pink-ink',
        className,
      )}
    >
      <Bookmark
        aria-hidden
        className="size-4"
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={1.9}
      />
      {withLabel && (saved ? 'Saved' : 'Save')}
    </button>
  )
}

export function toggleSaved(list: string[], reference: string) {
  return list.includes(reference)
    ? list.filter((item) => item !== reference)
    : [...list, reference]
}
