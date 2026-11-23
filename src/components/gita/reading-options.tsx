import { useStored } from '@/hooks/use-stored'
import {
  DEFAULT_READING,
  type EnglishStyle,
  READING_KEY,
  type ReadingOptions,
  type TextSize,
} from '@/lib/gita-reading'
import { cn } from '@/lib/utils'

const chip =
  'cursor-pointer rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-surface-blush-hover'
const chipOn = 'border-primary bg-pink-soft text-pink-ink'

const LAYERS = [
  { key: 'sanskrit', label: 'Sanskrit' },
  { key: 'transliteration', label: 'Transliteration' },
  { key: 'translation', label: 'English' },
] as const

const ENGLISH: { key: EnglishStyle; label: string }[] = [
  { key: 'plain', label: 'Plain' },
  { key: 'literal', label: 'Literal' },
]

const SIZES: { key: TextSize; label: string; name: string }[] = [
  { key: 's', label: 'A', name: 'Small text' },
  { key: 'm', label: 'A', name: 'Medium text' },
  { key: 'l', label: 'A', name: 'Large text' },
]

export function useReadingOptions() {
  const [stored, setStored, loaded] = useStored<ReadingOptions>(
    READING_KEY,
    DEFAULT_READING,
  )
  // Fill in options added since the reader last saved their choice.
  return [{ ...DEFAULT_READING, ...stored }, setStored, loaded] as const
}

/** Choose which layers of the text to show and how large. Remembered on this device. */
export function ReadingOptionsBar({
  options,
  onChange,
  className,
}: Readonly<{
  options: ReadingOptions
  onChange: (next: ReadingOptions) => void
  className?: string
}>) {
  const toggle = (key: (typeof LAYERS)[number]['key']) => {
    const next = { ...options, [key]: !options[key] }
    // Never let the page go blank: at least one layer stays on.
    if (!next.sanskrit && !next.transliteration && !next.translation) return
    onChange(next)
  }

  return (
    <div
      role="group"
      aria-label="Reading options"
      className={cn('flex flex-wrap items-center gap-x-5 gap-y-3', className)}
    >
      <div className="flex flex-wrap gap-2">
        {LAYERS.map((layer) => (
          <button
            key={layer.key}
            type="button"
            aria-pressed={options[layer.key]}
            onClick={() => toggle(layer.key)}
            className={cn(chip, options[layer.key] && chipOn)}
          >
            {layer.label}
          </button>
        ))}
      </div>
      {options.translation && (
        <div
          role="group"
          aria-label="English version"
          className="flex rounded-full border border-border bg-card p-0.5"
        >
          {ENGLISH.map((style) => (
            <button
              key={style.key}
              type="button"
              aria-pressed={options.english === style.key}
              onClick={() => onChange({ ...options, english: style.key })}
              className={cn(
                'cursor-pointer rounded-full px-3.5 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground',
                options.english === style.key && 'bg-pink-soft text-pink-ink',
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-1.5">
        {SIZES.map((size, index) => (
          <button
            key={size.key}
            type="button"
            aria-label={size.name}
            aria-pressed={options.size === size.key}
            onClick={() => onChange({ ...options, size: size.key })}
            className={cn(
              chip,
              'flex size-9 items-center justify-center px-0',
              ['text-xs', 'text-base', 'text-xl'][index],
              options.size === size.key && chipOn,
            )}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  )
}
