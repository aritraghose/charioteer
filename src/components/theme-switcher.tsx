import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type Theme, useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

const themes = [
  { key: 'system', icon: Monitor, label: 'System theme' },
  { key: 'light', icon: Sun, label: 'Light theme' },
  { key: 'dark', icon: Moon, label: 'Dark theme' },
] satisfies { key: Theme; icon: typeof Monitor; label: string }[]

export function ThemeSwitcher({ className }: Readonly<{ className?: string }>) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // The stored theme is only known in the browser, so render nothing on the server.
  if (!mounted) return null

  const activeIndex = themes.findIndex(({ key }) => key === theme)

  return (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-1 left-1 size-6 rounded-full bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key
        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            className="relative z-10 size-6 cursor-pointer rounded-full"
            onClick={() => setTheme(key)}
          >
            <Icon
              className={cn(
                'm-auto size-4',
                isActive ? 'text-accent-foreground' : 'text-muted-foreground',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
