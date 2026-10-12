import { Quote } from 'lucide-react'
import { sampleTestimonials } from '../../data/content'
import { Badge } from '../ui/Badge'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Testimonials() {
  return (
    <section className="bg-surface py-20 sm:py-28" aria-labelledby="testimonials-title">
      <Container>
        <div className="flex flex-col items-center">
          <Badge tone="amber" className="mb-5">Sample testimonials — for preview only</Badge>
          <SectionHeading
            id="testimonials-title"
            title="What a great Omegs experience feels like"
            description="These are illustrative examples, not real customer reviews. They will be replaced with genuine, verified feedback from Omegs customers."
          />
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {sampleTestimonials.map((t, i) => (
            <li key={t.context}>
              <Reveal delay={i * 80} className="h-full">
                <figure className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
                  <Quote className="size-8 text-mint-400" aria-hidden="true" />
                  <blockquote className="mt-5 flex-1 text-[17px] leading-relaxed text-brand-950">“{t.quote}”</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
                    <span className="grid size-10 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700" aria-hidden="true">
                      S
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-brand-950">{t.name}</span>
                      <span className="block text-xs text-slate-500">{t.context} · Placeholder</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
