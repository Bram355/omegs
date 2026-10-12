import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export const controlClasses = (invalid?: boolean) =>
  cn(
    'block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-brand-950 shadow-xs transition-colors placeholder:text-slate-400',
    'focus:outline-none focus:ring-4',
    invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-brand-100',
    'disabled:cursor-not-allowed disabled:bg-slate-50',
  )

export function fieldIds(name: string) {
  return { id: `field-${name}`, hintId: `field-${name}-hint`, errorId: `field-${name}-error` }
}

export function describedBy(name: string, hint?: ReactNode, error?: string) {
  const { hintId, errorId } = fieldIds(name)
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
}
