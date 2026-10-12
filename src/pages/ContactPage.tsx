import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useCallback, useState } from 'react'
import { TextAreaField } from '../components/forms/TextAreaField'
import { TextField } from '../components/forms/TextField'
import { PageHeader } from '../components/layout/PageHeader'
import { SocialLinks } from '../components/brand/SocialLinks'
import { Accordion } from '../components/ui/Accordion'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { DemoNotice } from '../components/ui/DemoNotice'
import { siteConfig } from '../config/site'
import { generalFaqs } from '../data/content'
import { useForm, type FormErrors } from '../hooks/useForm'
import { useSeo } from '../hooks/useSeo'
import { validators } from '../lib/validation'
import { contactService } from '../services/contact'

const initial = { name: '', email: '', subject: '', message: '' }
type Values = typeof initial

export default function ContactPage() {
  useSeo('Contact Us', 'Get in touch with the Omegs team for questions about services, bookings, or support.')
  const { contact } = siteConfig
  const [result, setResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  const validate = useCallback((v: Values): FormErrors<Values> => ({
    name: validators.required(v.name, 'Name'),
    email: validators.email(v.email),
    subject: validators.required(v.subject, 'Subject') ?? validators.minLength(v.subject, 3, 'Subject'),
    message: validators.required(v.message, 'Message') ?? validators.minLength(v.message, 10, 'Message'),
  }), [])
  const form = useForm(initial, validate)
  const field = { onChange: form.handleChange, onBlur: form.handleBlur }

  const onSubmit = form.handleSubmit(async (values) => {
    setResult(null)
    try {
      const { reference } = await contactService.sendMessage(values)
      setResult({
        tone: 'success',
        text: `Thanks, ${values.name.split(' ')[0]}! Your message was validated (ref. ${reference}). In demo mode it is not delivered to the Omegs team — please use the email or phone details for urgent requests.`,
      })
      form.reset()
    } catch {
      setResult({ tone: 'error', text: 'Your message could not be sent. Please try again.' })
    }
  })

  const details = [
    { icon: Phone, label: 'Phone', value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: 'Address', value: contact.address },
    { icon: Clock, label: 'Hours', value: contact.hours },
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Contact"
        title="We’re here to help"
        description="Questions about our services, a booking, or the Omegs app? Send us a message and our team will get back to you."
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
              <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
              <p className="mt-1 text-sm text-slate-500">Fields marked <span className="text-red-600">*</span> are required.</p>
              <DemoNotice className="mt-6">Messages are validated but not delivered until an email service or backend is connected.</DemoNotice>
              <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
                {result && <Alert tone={result.tone} live title={result.tone === 'success' ? 'Message received (demo)' : 'Something went wrong'}>{result.text}</Alert>}
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField name="name" label="Name" autoComplete="name" required value={form.values.name} error={form.errors.name} {...field} />
                  <TextField name="email" type="email" label="Email" autoComplete="email" inputMode="email" required value={form.values.email} error={form.errors.email} {...field} />
                </div>
                <TextField name="subject" label="Subject" required value={form.values.subject} error={form.errors.subject} {...field} />
                <TextAreaField name="message" label="Message" rows={6} required value={form.values.message} error={form.errors.message} {...field} />
                <Button type="submit" size="lg" loading={form.isSubmitting} loadingText="Sending…">
                  <Send className="size-4" aria-hidden="true" /> Send message
                </Button>
              </form>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5" aria-label="Contact details">
            <div className="rounded-3xl bg-brand-950 p-8 text-brand-100">
              <h2 className="text-xl font-bold text-white">Contact details</h2>
              <ul className="mt-6 space-y-5">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-mint-300">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-brand-300 uppercase">{label}</p>
                      {href ? (
                        <a href={href} className="mt-0.5 block rounded font-medium break-all text-white hover:text-mint-300">{value}</a>
                      ) : (
                        <p className="mt-0.5 font-medium text-white">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="mb-3 text-sm text-brand-200">Follow Omegs</p>
                <SocialLinks />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-xl font-bold">Support FAQ</h2>
              <Accordion items={generalFaqs.slice(1)} defaultOpen={null} />
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
