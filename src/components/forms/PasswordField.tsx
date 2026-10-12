import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { controlClasses, describedBy, fieldIds } from './fieldUtils'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  labelAside?: ReactNode
  footer?: ReactNode
}

export function PasswordField({ name, label, hint, error, required, labelAside, footer, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  return (
    <Field name={name} label={label} hint={hint} error={error} required={required} labelAside={labelAside}>
      <div className="relative">
        <input
          id={fieldIds(name).id}
          name={name}
          type={visible ? 'text' : 'password'}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, hint, error)}
          className={cn(controlClasses(Boolean(error)), 'pr-12')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={fieldIds(name).id}
          className="absolute inset-y-0 right-1.5 my-auto grid size-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-900"
        >
          {visible ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
        </button>
      </div>
      {footer}
    </Field>
  )
}
