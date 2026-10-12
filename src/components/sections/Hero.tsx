import { ArrowRight, BadgeCheck, CalendarClock, CalendarPlus, CheckCircle2, MousePointerClick, Smartphone } from 'lucide-react'
import { images } from '../../assets/images'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { ResponsiveImage } from '../ui/ResponsiveImage'

const trust = [
  { icon: BadgeCheck, label: 'Professional service' },
  { icon: MousePointerClick, label: 'Convenient booking' },
  { icon: CalendarClock, label: 'Flexible scheduling' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute top-0 -left-40 size-[520px] rounded-full bg-mint-100/60 blur-3xl" aria-hidden="true" />
      <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="animate-fade-up lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-brand-800 shadow-xs ring-1 ring-slate-200">
            <span className="size-2 rounded-full bg-mint-400" aria-hidden="true" />
            Residential &amp; commercial cleaning
          </p>
          <h1 id="hero-title" className="mt-6 text-[2.75rem] leading-[1.05] font-extrabold tracking-tight sm:text-6xl lg:text-[4.25rem]">
            A Cleaner Space.
            <span className="block text-brand-600">A Better Day.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Professional cleaning made simple. Discover trusted cleaning services and manage your bookings with the Omegs mobile app.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/book" size="lg">
              <CalendarPlus className="size-5" aria-hidden="true" /> Book a Cleaning
            </ButtonLink>
            <ButtonLink to="/services" variant="secondary" size="lg">
              Explore Our Services <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3" aria-label="What to expect">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-brand-900">
                <Icon className="size-5 text-mint-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-black/5">
            <ResponsiveImage
              image={images.hero}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] w-full object-cover object-[40%_center] sm:aspect-[16/11] lg:aspect-[5/6]"
            />
          </div>
          <div className="absolute -bottom-6 left-4 hidden w-64 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-slate-100 sm:block lg:-left-10" aria-hidden="true">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-mint-100 text-mint-700">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-950">Booking made simple</p>
                <p className="text-xs text-slate-500">Choose a service, date, and time</p>
              </div>
            </div>
          </div>
          <div className="absolute top-6 right-4 hidden items-center gap-2 rounded-full bg-brand-950/85 px-4 py-2 text-sm font-medium text-white backdrop-blur sm:flex lg:-right-4" aria-hidden="true">
            <Smartphone className="size-4 text-mint-300" /> Manage it in the app
          </div>
        </div>
      </Container>
    </section>
  )
}
