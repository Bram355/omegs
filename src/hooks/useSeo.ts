import { useEffect } from 'react'
import { siteConfig } from '../config/site'

const DEFAULT_TITLE = 'Omegs — Professional Cleaning Services'

/** Sets the document title and meta description for the current route. */
export function useSeo(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Omegs` : DEFAULT_TITLE
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description ?? siteConfig.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
  }, [title, description])
}
