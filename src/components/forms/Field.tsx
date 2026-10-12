import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { fieldIds } from './fieldUtils'

interface FieldProps {
  name: string
  label: ReactNode
  required?: boolean
  hint?: ReactNode
  error?: string
  labelAside?: ReactNode
  className?: string
  children: ReactNode
}

export function Field({ name, label, required, hint, error, labelAside, className, children }: FieldProps) {
  const { id, hintId, errorId } = fieldIds(name)
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-brand-950">
          {label}
          {required && (
            <span className="text-red-600" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
        {labelAside}
      </div>
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
