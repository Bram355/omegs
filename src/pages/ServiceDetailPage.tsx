import { ArrowRight, CalendarPlus, Check, CircleDollarSign, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ServiceCard } from '../components/services/ServiceCard'
import { FaqSection } from '../components/sections/FaqSection'
import { FinalCta } from '../components/sections/FinalCta'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { ResponsiveImage } from '../components/ui/ResponsiveImage'
import { getCategoryLabel, getServiceById, services } from '../data/services'
import { useSeo } from '../hooks/useSeo'
import NotFoundPage from './NotFoundPage'

export default function ServiceDetailPage() {
  const { serviceId } = useParams()
  const service = getServiceById(serviceId)
  useSeo(service?.name ?? 'Service not found', service?.shortDescription)

  if (!service) return <NotFoundPage />

  const Icon = service.icon
  const related = services.filter((s) => s.id !== service.id).slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <Container className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.name }]} />
            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-mint-100 text-mint-700">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <Badge tone="brand">{getCategoryLabel(service.category)}</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">{service.name}</h1>
            <p className="mt-4 text-xl leading-relaxed text-slate-600">{service.tagline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to={`/book?service=${service.id}`} size="lg">
                <CalendarPlus className="size-5" aria-hidden="true" /> Book {service.name}
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary" size="lg">Ask a question</ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-black/5">
            <ResponsiveImage image={service.image} priority className="aspect-[4/3] w-full object-cover" />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">About this service</h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-600">
                {service.description.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Benefits</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {service.benefits.map((b) => (
                  <li key={b.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What’s included</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {service.included.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-500">Exact scope may vary by property and will be confirmed when your booking is reviewed.</p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
                <div className="flex items-center gap-2 text-sm font-semibold text-mint-700">
                  <CircleDollarSign className="size-5" aria-hidden="true" /> Pricing
                </div>
                <p className="mt-3 text-2xl font-bold text-brand-950">{service.pricing.startingAt ?? 'Quote on request'}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.pricing.note}</p>
                <ButtonLink to={`/book?service=${service.id}`} className="mt-6 w-full">
                  <CalendarPlus className="size-4" aria-hidden="true" /> Book now
                </ButtonLink>
              </div>
              <div className="rounded-3xl bg-surface p-7">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-800">
                  <Users className="size-5" aria-hidden="true" /> Ideal for
                </div>
                <ul className="mt-4 space-y-2.5">
                  {service.idealFor.map((i) => (
                    <li key={i} className="flex items-center gap-2.5 text-slate-700">
                      <span className="size-1.5 rounded-full bg-mint-500" aria-hidden="true" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <FaqSection
        items={service.faqs}
        title={`${service.name} questions`}
        description="Common questions about this service."
        className="border-t border-slate-200/70 py-16 sm:py-24"
      />

      <section className="bg-surface py-16 sm:py-24" aria-labelledby="related-title">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-2xl font-bold tracking-tight sm:text-3xl">Other services</h2>
            <Link to="/services" className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-800 hover:text-mint-700">
              All services <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <li key={s.id}>
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <div className="pt-20 sm:pt-28">
        <FinalCta title={`Ready to book ${service.name.toLowerCase()}?`} />
      </div>
    </>
  )
}
