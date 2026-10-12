import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** Moves focus to the main landmark after client-side navigation so screen readers announce the new page. */
export function RouteFocus({ targetId = 'main-content' }: { targetId?: string }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    document.getElementById(targetId)?.focus({ preventScroll: true })
  }, [pathname, targetId])
  return null
}
