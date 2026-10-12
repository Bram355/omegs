import { ChevronDown } from 'lucide-react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { controlClasses, describedBy, fieldIds } from './fieldUtils'

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string
  label: ReactNode
  options: { value: string; label: string }[]
  placeholder?: string
  hint?: ReactNode
  error?: string
}

export function SelectField({ name, label, options, placeholder, hint, error, required, ...props }: SelectFieldProps) {
  return (
    <Field name={name} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          id={fieldIds(name).id}
          name={name}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, hint, error)}
          className={cn(controlClasses(Boolean(error)), 'appearance-none pr-11')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-4 my-auto size-4 text-slate-500" aria-hidden="true" />
      </div>
    </Field>
  )
}
