import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <ThemeSwitcher className="ml-auto" />
      </header>
      <Outlet />
    </div>
  )
}
