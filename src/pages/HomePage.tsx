import { AppPromo } from '../components/sections/AppPromo'
import { FaqSection } from '../components/sections/FaqSection'
import { FinalCta } from '../components/sections/FinalCta'
import { Hero } from '../components/sections/Hero'
import { HowItWorks } from '../components/sections/HowItWorks'
import { ServicesPreview } from '../components/sections/ServicesPreview'
import { Testimonials } from '../components/sections/Testimonials'
import { WhyChoose } from '../components/sections/WhyChoose'
import { useSeo } from '../hooks/useSeo'

export default function HomePage() {
  useSeo()
  return (
    <>
      <Hero />
      <ServicesPreview />
      <WhyChoose />
      <HowItWorks />
      <AppPromo />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  )
}
