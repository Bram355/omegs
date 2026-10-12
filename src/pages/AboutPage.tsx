import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { images } from '../assets/images'
import { PageHeader } from '../components/layout/PageHeader'
import { FinalCta } from '../components/sections/FinalCta'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'
import { ResponsiveImage } from '../components/ui/ResponsiveImage'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useSeo } from '../hooks/useSeo'

const values = [
  { icon: Sparkles, title: 'Care in the details', description: 'We believe a great clean is defined by the small things — the corners, edges, and finishing touches.' },
  { icon: ShieldCheck, title: 'Trust and respect', description: 'Inviting someone into your space is a big deal. We aim to earn that trust through reliability and respect.' },
  { icon: HeartHandshake, title: 'Customer first', description: 'Clear communication, honest pricing, and support that genuinely listens to what you need.' },
  { icon: Leaf, title: 'Responsible practices', description: 'We are committed to thoughtful product choices and responsible ways of working.' },
]

export default function AboutPage() {
  useSeo('About Us', 'Learn about Omegs, our mission, and the values behind our residential and commercial cleaning services.')
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        eyebrow="About Omegs"
        title="Making clean spaces simple for everyone"
        description="Omegs is a modern cleaning services company built around a simple idea: booking a professional clean should be as effortless as the result feels."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <ResponsiveImage image={images.aboutCleaner} className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]" />
            </div>
            <div className="absolute -right-4 -bottom-8 hidden w-56 overflow-hidden rounded-3xl border-8 border-white shadow-lift sm:block">
              <ResponsiveImage image={images.kitchen} sizes="240px" className="aspect-square w-full object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow="Our mission" title="A cleaner space. A better day." />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                We know that a clean home or workplace does more than look good — it clears your mind, frees up your time, and makes every day feel a little lighter.
              </p>
              <p>
                Omegs brings together professional cleaning services and simple digital tools. Through our website and mobile app, customers can explore services, request bookings, and manage appointments without the back-and-forth.
              </p>
              <p>
                Whether it’s a weekly home clean, a move-out, or an office that needs to shine, our goal is the same: dependable service and an experience that puts you first.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-28" aria-labelledby="values-title">
        <Container>
          <SectionHeading id="values-title" eyebrow="Our values" title="What guides the way we work" />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }, i) => (
              <li key={title}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="h-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft">
                    <span className="grid size-12 place-items-center rounded-2xl bg-mint-100 text-mint-700">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <HowItWorks />
      <FinalCta />
    </>
  )
}
