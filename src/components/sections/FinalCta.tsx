import { ArrowRight, CalendarPlus } from 'lucide-react'
import { images } from '../../assets/images'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { ResponsiveImage } from '../ui/ResponsiveImage'

interface FinalCtaProps {
  title?: string
  description?: string
}

export function FinalCta({
  title = 'Ready for a cleaner space?',
  description = 'Book your first Omegs cleaning in minutes, or explore our services to find the right fit for your home or workspace.',
}: FinalCtaProps) {
  return (
    <section className="pb-20 sm:pb-28" aria-labelledby="final-cta-title">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900">
          <ResponsiveImage image={images.livingRoom} alt="" sizes="100vw" className="absolute inset-0 size-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-900/40" aria-hidden="true" />
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
            <h2 id="final-cta-title" className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">{description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/book" variant="accent" size="lg">
                <CalendarPlus className="size-5" aria-hidden="true" /> Book a Cleaning
              </ButtonLink>
              <ButtonLink to="/services" variant="outline-light" size="lg">
                Explore Our Services <ArrowRight className="size-5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
