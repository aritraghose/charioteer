/// <reference types="vite/client" />
import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { DefaultCatchBoundary } from '@/components/default-catch-boundary'
import { NotFound } from '@/components/not-found'
import { ThemeProvider, themeScript } from '@/components/theme-provider'
import { SITE_DESCRIPTION, SITE_NAME, seo } from '@/lib/seo'
import appCss from '@/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({ title: SITE_NAME, description: SITE_DESCRIPTION }),
      { name: 'application-name', content: SITE_NAME },
      { name: 'apple-mobile-web-app-title', content: SITE_NAME },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico?v=2', sizes: '32x32' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png?v=2',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png?v=2',
      },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png?v=2',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  shellComponent: Document,
  component: Outlet,
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
})

function Document({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f4f8f8"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#131312"
        />
        <ScriptOnce>{themeScript}</ScriptOnce>
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
