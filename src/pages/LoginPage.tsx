import { LogIn } from 'lucide-react'
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
import { redirectMessage } from '../lib/redirect'
import { validators } from '../lib/validation'
import { AuthError } from '../services/auth'

const initial = { email: '', password: '', remember: true }
type Values = typeof initial

export default function LoginPage() {
  useSeo('Log in', 'Log in to your Omegs account to book and manage cleanings.')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as RedirectState | null)?.from
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const validate = useCallback((v: Values): FormErrors<Values> => ({
    email: validators.email(v.email),
    password: v.password ? undefined : 'Password is required.',
  }), [])
  const form = useForm(initial, validate)

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      const user = await signIn(values)
      setSuccess(`Welcome back, ${user.fullName.split(' ')[0]}! Redirecting…`)
      setTimeout(() => navigate(from ?? '/', { replace: true }), 900)
    } catch (err) {
      if (err instanceof AuthError && err.field) form.setFieldError(err.field, err.message)
      else setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  })

  const context = redirectMessage(from)

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-slate-600">Log in to book and manage your cleanings.</p>

      {context && <Alert tone="info" className="mt-6">{context}</Alert>}
      <DemoNotice className="mt-6">
        Accounts are stored only in this browser for preview purposes. No real authentication provider is connected yet.
      </DemoNotice>

      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
        {formError && <Alert tone="error" live>{formError}</Alert>}
        {success && <Alert tone="success" live>{success}</Alert>}
        <TextField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.email}
        />
        <PasswordField
          name="password"
          label="Password"
          autoComplete="current-password"
          required
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.password}
          labelAside={<Link to="/forgot-password" className="rounded text-sm font-medium text-brand-700 hover:text-mint-700">Forgot password?</Link>}
        />
        <Checkbox name="remember" label="Remember me on this device" checked={form.values.remember} onChange={form.handleChange} />
        <Button type="submit" size="lg" className="w-full" loading={form.isSubmitting} loadingText="Logging in…" disabled={Boolean(success)}>
          <LogIn className="size-5" aria-hidden="true" /> Log in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        New to Omegs?{' '}
        <Link to="/signup" state={from ? { from } : undefined} className="rounded font-semibold text-brand-800 hover:text-mint-700">
          Create an account
        </Link>
      </p>
    </div>
  )
}
