import { ArrowLeft, MailCheck } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { TextField } from '../components/forms/TextField'
import { Button, ButtonLink } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/DemoNotice'
import { useForm, type FormErrors } from '../hooks/useForm'
import { useSeo } from '../hooks/useSeo'
import { validators } from '../lib/validation'
import { authService } from '../services/auth'

const initial = { email: '' }
type Values = typeof initial

export default function ForgotPasswordPage() {
  useSeo('Reset password')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const validate = useCallback((v: Values): FormErrors<Values> => ({ email: validators.email(v.email) }), [])
  const form = useForm(initial, validate)

  const onSubmit = form.handleSubmit(async ({ email }) => {
    await authService.requestPasswordReset(email)
    setSentTo(email)
  })

  if (sentTo) {
    return (
      <div className="animate-fade-up text-center" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-mint-100 text-mint-700">
          <MailCheck className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Request received</h1>
        <p className="mt-3 text-slate-600">
          In demo mode, no email is sent to <span className="font-medium text-brand-950">{sentTo}</span>. Once a real authentication provider is connected, a password reset link will be emailed here.
        </p>
        <ButtonLink to="/login" size="lg" className="mt-8 w-full">Back to log in</ButtonLink>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      <Link to="/login" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-600 hover:text-brand-900">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to log in
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Forgot your password?</h1>
      <p className="mt-2 text-slate-600">Enter the email linked to your account and we’ll send you a reset link.</p>
      <DemoNotice className="mt-6">Password reset emails are not sent until an authentication provider is connected.</DemoNotice>
      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
        <TextField name="email" type="email" label="Email" autoComplete="email" required value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
        <Button type="submit" size="lg" className="w-full" loading={form.isSubmitting} loadingText="Sending…">Send reset link</Button>
      </form>
    </div>
  )
}
