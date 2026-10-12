import { UserPlus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Checkbox } from '../components/forms/Checkbox'
import { PasswordField } from '../components/forms/PasswordField'
import { TextField } from '../components/forms/TextField'
import type { RedirectState } from '../components/layout/RequireAuth'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/DemoNotice'
import { useAuth } from '../hooks/useAuth'
import { useForm, type FormErrors } from '../hooks/useForm'
import { useSeo } from '../hooks/useSeo'
import { cn } from '../lib/cn'
import { redirectMessage } from '../lib/redirect'
import { passwordStrength, validators } from '../lib/validation'
import { AuthError } from '../services/auth'

const initial = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false }
type Values = typeof initial

const strengthColors = ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-mint-400', 'bg-mint-600']

export default function SignupPage() {
  useSeo('Create an account', 'Create your Omegs account to book and manage cleaning services.')
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as RedirectState | null)?.from
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const validate = useCallback((v: Values): FormErrors<Values> => ({
    fullName: validators.required(v.fullName, 'Full name') ?? validators.minLength(v.fullName, 2, 'Full name'),
    email: validators.email(v.email),
    phone: validators.phone(v.phone),
    password: validators.password(v.password),
    confirmPassword: !v.confirmPassword ? 'Please confirm your password.' : v.confirmPassword !== v.password ? 'Passwords do not match.' : undefined,
    terms: v.terms ? undefined : 'You must accept the Terms and Privacy Policy to continue.',
  }), [])
  const form = useForm(initial, validate)
  const strength = passwordStrength(form.values.password)

  const onSubmit = form.handleSubmit(async ({ fullName, email, phone, password }) => {
    setFormError(null)
    try {
      const user = await signUp({ fullName, email, phone, password })
      setSuccess(`Demo account created for ${user.email}. Redirecting…`)
      setTimeout(() => navigate(from ?? '/book', { replace: true }), 1100)
    } catch (err) {
      if (err instanceof AuthError && err.field) form.setFieldError(err.field, err.message)
      else setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  })

  const context = redirectMessage(from)
  const field = { onChange: form.handleChange, onBlur: form.handleBlur }

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-slate-600">Book cleanings and keep track of every appointment.</p>

      {context && <Alert tone="info" className="mt-6">{context}</Alert>}
      <DemoNotice className="mt-6">
        This creates a preview account stored only in this browser. It is not a secure, registered Omegs account.
      </DemoNotice>

      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
        {formError && <Alert tone="error" live>{formError}</Alert>}
        {success && <Alert tone="success" live>{success}</Alert>}
        <TextField name="fullName" label="Full name" autoComplete="name" required value={form.values.fullName} error={form.errors.fullName} {...field} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="email" type="email" label="Email" autoComplete="email" inputMode="email" placeholder="you@example.com" required value={form.values.email} error={form.errors.email} {...field} />
          <TextField name="phone" type="tel" label="Phone number" autoComplete="tel" inputMode="tel" placeholder="+1 555 010 0000" required value={form.values.phone} error={form.errors.phone} {...field} />
        </div>
        <PasswordField
          name="password"
          label="Password"
          autoComplete="new-password"
          required
          hint="At least 8 characters, including a letter and a number."
          value={form.values.password}
          error={form.errors.password}
          {...field}
          footer={
            form.values.password && (
              <div className="mt-2 flex items-center gap-3" aria-live="polite">
                <div className="flex flex-1 gap-1" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < strength.score ? strengthColors[strength.score] : 'bg-slate-200')} />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500">Strength: {strength.label}</span>
              </div>
            )
          }
        />
        <PasswordField name="confirmPassword" label="Confirm password" autoComplete="new-password" required value={form.values.confirmPassword} error={form.errors.confirmPassword} {...field} />
        <Checkbox
          name="terms"
          checked={form.values.terms}
          onChange={form.handleChange}
          error={form.errors.terms}
          label={
            <>
              I agree to the{' '}
              <Link to="/terms" target="_blank" className="font-medium text-brand-800 underline underline-offset-2">Terms and Conditions</Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" className="font-medium text-brand-800 underline underline-offset-2">Privacy Policy</Link>.
            </>
          }
        />
        <Button type="submit" size="lg" className="w-full" loading={form.isSubmitting} loadingText="Creating account…" disabled={Boolean(success)}>
          <UserPlus className="size-5" aria-hidden="true" /> Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" state={from ? { from } : undefined} className="rounded font-semibold text-brand-800 hover:text-mint-700">Log in</Link>
      </p>
    </div>
  )
}
