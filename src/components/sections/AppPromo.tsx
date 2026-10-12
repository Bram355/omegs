import { appFeatures } from '../../data/content'
import { PhoneMockup } from '../app/PhoneMockup'
import { StoreButtons } from '../app/StoreButtons'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export function AppPromo() {
  return (
    <section className="py-8 sm:py-12" aria-labelledby="app-title">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-mint-50 ring-1 ring-mint-100">
          <div className="pointer-events-none absolute -right-32 -bottom-32 size-[460px] rounded-full bg-mint-200/60 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-12 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-20">
            <Reveal>
              <p className="text-sm font-semibold tracking-wide text-mint-700 uppercase">The Omegs app · iOS &amp; Android</p>
              <h2 id="app-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Your Cleaning Service, One Tap Away.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
                Book, reschedule, and keep track of every cleaning from your phone. The Omegs app puts your service in your pocket.
              </p>
              <ul className="mt-8 space-y-5">
                {appFeatures.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-800 shadow-xs ring-1 ring-mint-100">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-0.5 text-slate-600">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <StoreButtons className="mt-10" />
            </Reveal>
            <Reveal delay={120} className="flex justify-center lg:justify-end lg:pr-8">
              <PhoneMockup />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
