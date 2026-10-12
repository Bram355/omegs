import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react'

export type FormErrors<T> = Partial<Record<keyof T, string>>
type Validator<T> = (values: T) => FormErrors<T>

/**
 * Minimal form state helper: controlled values, per-field validation on blur,
 * full validation on submit, focus on the first invalid field, and submitting state.
 */
export function useForm<T extends Record<string, string | boolean>>(initialValues: T, validate: Validator<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        setErrors((prevErrors) => {
          if (!touched[name] && !prevErrors[name]) return prevErrors
          return { ...prevErrors, [name]: validate(next)[name] }
        })
        return next
      })
    },
    [touched, validate],
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = event.target
      const name = target.name as keyof T
      const value = (target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value) as T[keyof T]
      setValue(name, value)
    },
    [setValue],
  )

  const handleBlur = useCallback(
    (event: { target: { name: string } }) => {
      const name = event.target.name as keyof T
      setTouched((prev) => ({ ...prev, [name]: true }))
      setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }))
    },
    [validate, values],
  )

  const setFieldError = useCallback((name: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }))
  }, [])

  const handleSubmit = useCallback(
    (onValid: (values: T) => Promise<void> | void) => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const form = event.currentTarget
      const nextErrors = validate(values)
      setErrors(nextErrors)
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Partial<Record<keyof T, boolean>>)
      const firstInvalid = Object.keys(nextErrors).find((k) => nextErrors[k as keyof T])
      if (firstInvalid) {
        form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
        return
      }
      setIsSubmitting(true)
      try {
        await onValid(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [validate, values],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setValue, setFieldError, reset }
}
