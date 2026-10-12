import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { controlClasses, describedBy, fieldIds } from './fieldUtils'

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string
  label: ReactNode
  hint?: ReactNode
  error?: string
}

export function TextAreaField({ name, label, hint, error, required, rows = 5, ...props }: TextAreaFieldProps) {
  return (
    <Field name={name} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={fieldIds(name).id}
        name={name}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={cn(controlClasses(Boolean(error)), 'resize-y')}
        {...props}
      />
    </Field>
  )
}
