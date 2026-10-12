import type { InputHTMLAttributes, ReactNode } from 'react'
import { Field } from './Field'
import { controlClasses, describedBy, fieldIds } from './fieldUtils'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  labelAside?: ReactNode
  wrapperClassName?: string
}

export function TextField({ name, label, hint, error, required, labelAside, wrapperClassName, ...props }: TextFieldProps) {
  return (
    <Field name={name} label={label} hint={hint} error={error} required={required} labelAside={labelAside} className={wrapperClassName}>
      <input
        id={fieldIds(name).id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={controlClasses(Boolean(error))}
        {...props}
      />
    </Field>
  )
}
