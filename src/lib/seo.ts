export const SITE_NAME = 'Charioteer'

export const SITE_DESCRIPTION = 'Focus and meditation.'

export function seo({
  title,
  description,
  noindex = false,
}: {
  title: string
  description?: string
  noindex?: boolean
}) {
  return [
    { title },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    ...(description
      ? [
          { name: 'description', content: description },
          { property: 'og:description', content: description },
          { name: 'twitter:description', content: description },
        ]
      : []),
    ...(noindex ? [{ name: 'robots', content: 'noindex' }] : []),
  ]
}
