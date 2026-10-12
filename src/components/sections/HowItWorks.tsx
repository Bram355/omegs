import { CalendarPlus } from 'lucide-react'
import { howItWorksSteps } from '../../data/content'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28" aria-labelledby="how-title">
      <Container>
        <SectionHeading id="how-title" eyebrow="How it works" title="Book your clean in three simple steps" description="A straightforward process from choosing a service to managing your appointment." />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="absolute top-8 right-[16%] left-[16%] hidden h-px border-t-2 border-dashed border-brand-100 md:block" aria-hidden="true" />
          {howItWorksSteps.map(({ icon: Icon, title, description }, i) => (
            <li key={title} className="relative">
              <Reveal delay={i * 120} className="flex flex-col items-center text-center">
                <span className="relative grid size-16 place-items-center rounded-2xl bg-brand-900 text-white shadow-lift">
                  <Icon className="size-7" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-mint-300 text-xs font-bold text-brand-950 ring-4 ring-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-xl font-semibold">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-3 max-w-xs leading-relaxed text-slate-600">{description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-14 flex justify-center">
          <ButtonLink to="/book" size="lg">
            <CalendarPlus className="size-5" aria-hidden="true" /> Get started
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
