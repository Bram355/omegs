import { useCallback, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from './useOnClickOutside'

/**
 * Disclosure/menu helper: toggling, click-outside, Escape to close (returning focus to the trigger),
 * and arrow-key navigation between focusable items inside the panel.
 */
export function useDisclosure<TTrigger extends HTMLElement = HTMLButtonElement>() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<TTrigger>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  useOnClickOutside(containerRef, close, isOpen)

  const focusItem = useCallback((index: number | 'first' | 'last') => {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    if (!items.length) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    let next = 0
    if (index === 'first') next = 0
    else if (index === 'last') next = items.length - 1
    else next = (current + index + items.length) % items.length
    items[next]?.focus()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setIsOpen(true)
        requestAnimationFrame(() => focusItem('first'))
      }
    },
    [focusItem],
  )

  const onPanelKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        focusItem(1)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        focusItem(-1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        focusItem('first')
      } else if (event.key === 'End') {
        event.preventDefault()
        focusItem('last')
      }
    },
    [focusItem],
  )

  const onContainerBlur = useCallback((event: React.FocusEvent) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) setIsOpen(false)
  }, [])

  return { isOpen, setIsOpen, close, toggle, containerRef, triggerRef, panelRef, onTriggerKeyDown, onPanelKeyDown, onContainerBlur }
}
