import { MessageCircle } from 'lucide-react'
import { generalFaqs } from '../../data/content'
import type { FaqItem } from '../../types'
import { Accordion } from '../ui/Accordion'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

interface FaqSectionProps {
  items?: FaqItem[]
  title?: string
  description?: string
  className?: string
}

export function FaqSection({
  items = generalFaqs,
  title = 'Frequently asked questions',
  description = 'Everything you need to know about booking and managing your Omegs cleaning.',
  className = 'py-20 sm:py-28',
}: FaqSectionProps) {
  return (
    <section id="faq" className={className} aria-labelledby="faq-title">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" align="left" eyebrow="FAQ" title={title} description={description} />
          <div className="mt-8 rounded-3xl bg-surface p-6">
            <MessageCircle className="size-6 text-mint-600" aria-hidden="true" />
            <p className="mt-3 font-semibold text-brand-950">Still have questions?</p>
            <p className="mt-1 text-sm text-slate-600">Our support team is happy to help.</p>
            <ButtonLink to="/contact" variant="secondary" size="sm" className="mt-4">Contact support</ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Accordion items={items} />
        </div>
      </Container>
    </section>
  )
}
