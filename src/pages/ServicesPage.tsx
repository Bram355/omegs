import { CalendarPlus, Search, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { FinalCta } from '../components/sections/FinalCta'
import { ServiceCard } from '../components/services/ServiceCard'
import { Button, ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { serviceCategories, services } from '../data/services'
import { useSeo } from '../hooks/useSeo'
import { cn } from '../lib/cn'
import type { ServiceCategory } from '../types'

type Filter = ServiceCategory | 'all'

export default function ServicesPage() {
  useSeo('Cleaning Services', 'Explore Omegs residential, commercial, and specialty cleaning services and book the right clean for your space.')
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const categoryParam = params.get('category')
  const active: Filter = serviceCategories.some((c) => c.id === categoryParam) ? (categoryParam as Filter) : 'all'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return services.filter(
      (s) =>
        (active === 'all' || s.category === active) &&
        (!q || [s.name, s.shortDescription, s.tagline, ...s.included].some((t) => t.toLowerCase().includes(q))),
    )
  }, [active, query])

  const setCategory = (id: Filter) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        eyebrow="Our services"
        title="Professional cleaning for every kind of space"
        description="Whether you need regular upkeep at home, a detailed deep clean, or a workspace that impresses, Omegs has a service designed for you."
      >
        <ButtonLink to="/book" size="lg">
          <CalendarPlus className="size-5" aria-hidden="true" /> Book a Cleaning
        </ButtonLink>
      </PageHeader>

      <section className="py-14 sm:py-20" aria-labelledby="directory-title">
        <Container>
          <h2 id="directory-title" className="sr-only">Service directory</h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {serviceCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active === c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    active === c.id ? 'bg-brand-900 text-white' : 'bg-surface text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-900',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <label htmlFor="service-search" className="sr-only">Search services</label>
              <Search className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4 text-slate-400" aria-hidden="true" />
              <input
                id="service-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services"
                className="h-11 w-full rounded-full border border-slate-200 bg-white pr-4 pl-11 text-sm text-brand-950 placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500" role="status" aria-live="polite">
            Showing {filtered.length} of {services.length} services
          </p>

          {filtered.length > 0 ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service) => (
                <li key={service.id}>
                  <ServiceCard service={service} headingLevel="h3" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-surface px-6 py-16 text-center">
              <SearchX className="size-10 text-slate-400" aria-hidden="true" />
              <p className="mt-4 text-lg font-semibold text-brand-950">No services match your search</p>
              <p className="mt-1 text-slate-600">Try a different keyword or category.</p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </Container>
      </section>
      <FinalCta title="Not sure which service you need?" description="Tell us about your space when you book and add notes about your priorities — or get in touch and we’ll help you choose." />
    </>
  )
}
