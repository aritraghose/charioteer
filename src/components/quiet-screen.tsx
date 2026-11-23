import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

/**
 * A full screen with no app navigation, for moments that need one thing on
 * screen. The only way out is a plain "Leave" link, always visible.
 */
export function QuietScreen({
  leaveTo,
  leaveLabel = 'Leave',
  footer,
  children,
}: Readonly<{
  leaveTo: '/calm' | '/practice' | '/focus' | '/'
  leaveLabel?: string
  footer?: ReactNode
  children: ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center px-5 py-5 sm:px-8">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link to={leaveTo}>
            <X aria-hidden className="size-4" />
            {leaveLabel}
          </Link>
        </Button>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-5 pb-10 text-center sm:px-8">
        {children}
      </main>
      {footer && (
        <footer className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-5 pb-8 sm:px-8">
          {footer}
        </footer>
      )}
    </div>
  )
}
