import { ArrowRight } from 'lucide-react'
import { services } from '../../data/services'
import { ServiceCard } from '../services/ServiceCard'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function ServicesPreview() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="services-preview-title">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="services-preview-title"
            align="left"
            eyebrow="Our services"
            title="Cleaning services for every space"
            description="From weekly home upkeep to post-renovation clean-ups, choose the service that fits your needs."
          />
          <ButtonLink to="/services" variant="secondary" className="shrink-0">
            View all services <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.id}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
