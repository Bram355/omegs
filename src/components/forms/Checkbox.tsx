import { AlertCircle, Check } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { fieldIds } from './fieldUtils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string
  label: ReactNode
  error?: string
}

export function Checkbox({ name, label, error, className, ...props }: CheckboxProps) {
  const { id, errorId } = fieldIds(name)
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            id={id}
            name={name}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'peer size-5 cursor-pointer appearance-none rounded-md border bg-white transition-colors checked:border-brand-900 checked:bg-brand-900',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-500',
              error ? 'border-red-400' : 'border-slate-300 hover:border-brand-400',
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden="true" />
        </span>
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-slate-600">
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 ml-8 flex items-start gap-1.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
