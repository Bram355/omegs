import { ArrowRight, CalendarPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../../data/services'
import type { Service } from '../../types'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function ServiceCard({ service, headingLevel: Heading = 'h3' }: { service: Service; headingLevel?: 'h2' | 'h3' }) {
  const Icon = service.icon
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ResponsiveImage
          image={service.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-800 backdrop-blur">
          {getCategoryLabel(service.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint-100 text-mint-700">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <Heading className="text-lg font-bold tracking-tight">{service.name}</Heading>
        </div>
        <p className="mt-3 flex-1 leading-relaxed text-slate-600">{service.shortDescription}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <Link
            to={`/services/${service.id}`}
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-800 transition-colors hover:text-mint-700"
          >
            Learn More
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            <span className="sr-only">about {service.name}</span>
          </Link>
          <Link
            to={`/book?service=${service.id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            Book Now
            <span className="sr-only">: {service.name}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
