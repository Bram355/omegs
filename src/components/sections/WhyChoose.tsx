import { brandPromises } from '../../data/content'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-20 sm:py-28" aria-labelledby="why-title">
      <div className="pointer-events-none absolute -top-40 right-0 size-[480px] rounded-full bg-brand-700/40 blur-3xl" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading
          id="why-title"
          tone="light"
          eyebrow="Why choose Omegs?"
          title="The standards we hold ourselves to"
          description="Every Omegs booking is built around a simple set of promises — the experience we are committed to delivering to every customer."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brandPromises.map(({ icon: Icon, title, description }, i) => (
            <li key={title}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-mint-300/30 hover:bg-white/[0.07]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-mint-300 text-brand-950">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 leading-relaxed text-brand-200">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
