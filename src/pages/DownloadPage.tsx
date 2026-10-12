import { Bell, CheckCircle2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { PhoneMockup } from '../components/app/PhoneMockup'
import { StoreButtons } from '../components/app/StoreButtons'
import { TextField } from '../components/forms/TextField'
import { FaqSection } from '../components/sections/FaqSection'
import { Alert } from '../components/ui/Alert'
import { Badge } from '../components/ui/Badge'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { DemoNotice } from '../components/ui/DemoNotice'
import { SectionHeading } from '../components/ui/SectionHeading'
import { siteConfig } from '../config/site'
import { appFeatures, generalFaqs } from '../data/content'
import { useForm, type FormErrors } from '../hooks/useForm'
import { useSeo } from '../hooks/useSeo'
import { validators } from '../lib/validation'
import { contactService } from '../services/contact'

const initial = { email: '' }
type Values = typeof initial

const appFaqs = [
  generalFaqs[3],
  { question: 'Which devices will the app support?', answer: 'The Omegs app is being built for both iOS (iPhone) and Android smartphones. Minimum OS versions will be listed on each store page at launch.' },
  { question: 'Can I use my website account in the app?', answer: 'That is the plan — once real authentication is connected, the same Omegs account will work on the website and in the mobile app.' },
  generalFaqs[2],
]

export default function DownloadPage() {
  useSeo('Download the App', 'Get the Omegs mobile app for iOS and Android to book and manage your cleaning services.')
  const [joined, setJoined] = useState<string | null>(null)
  const isLive = !siteConfig.appStores.ios.isPlaceholder || !siteConfig.appStores.android.isPlaceholder
  const validate = useCallback((v: Values): FormErrors<Values> => ({ email: validators.email(v.email) }), [])
  const form = useForm(initial, validate)

  const onSubmit = form.handleSubmit(async ({ email }) => {
    await contactService.joinAppWaitlist(email)
    setJoined(email)
    form.reset()
  })

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950">
        <div className="pointer-events-none absolute -top-40 -left-40 size-[560px] rounded-full bg-brand-700/40 blur-3xl" aria-hidden="true" />
        <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="[&_a]:text-brand-200 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_ol]:text-brand-300">
              <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Download' }]} />
            </div>
            <Badge tone="glass" className="mt-8">{isLive ? 'Available on iOS & Android' : 'Coming soon to iOS & Android'}</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">Your Cleaning Service, One Tap Away.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100">
              The Omegs app makes it easy to book cleanings, manage appointments, and see exactly what every service includes — all from your phone.
            </p>
            <StoreButtons tone="light" staticPlaceholder className="mt-10" />
          </div>
          <div className="flex justify-center">
            <PhoneMockup />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="app-features-title">
        <Container>
          <SectionHeading id="app-features-title" eyebrow="App features" title="Everything you need to manage your clean" />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {appFeatures.map(({ icon: Icon, title, description }) => (
              <li key={title} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
                <span className="grid size-12 place-items-center rounded-2xl bg-mint-100 text-mint-700">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {!isLive && (
        <section className="pb-8" aria-labelledby="notify-title">
          <Container>
            <div className="grid items-center gap-10 rounded-[2.5rem] bg-mint-50 p-8 ring-1 ring-mint-100 sm:p-12 lg:grid-cols-2">
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-800 shadow-xs">
                  <Bell className="size-6" aria-hidden="true" />
                </span>
                <h2 id="notify-title" className="mt-5 text-3xl font-bold tracking-tight">Be the first to know</h2>
                <p className="mt-3 text-lg text-slate-600">Leave your email and we’ll let you know when the Omegs app is available to download.</p>
              </div>
              <div>
                {joined ? (
                  <Alert tone="success" live title="You’re on the list (demo)">
                    <span className="flex items-start gap-1">
                      <CheckCircle2 className="sr-only" aria-hidden="true" />
                      {joined} was validated, but in demo mode it is not stored or emailed.
                    </span>
                  </Alert>
                ) : (
                  <form noValidate onSubmit={onSubmit} className="space-y-4">
                    <TextField name="email" type="email" label="Email address" autoComplete="email" placeholder="you@example.com" required value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
                    <Button type="submit" size="lg" className="w-full" loading={form.isSubmitting} loadingText="Saving…">Notify me at launch</Button>
                  </form>
                )}
                <DemoNotice className="mt-4">Launch notifications are not sent until an email service is connected.</DemoNotice>
              </div>
            </div>
          </Container>
        </section>
      )}

      <FaqSection items={appFaqs} title="App questions" description="What to know about the Omegs mobile app." />
    </>
  )
}
