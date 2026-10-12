import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { footerNav } from '../../data/navigation'
import { CURRENT_YEAR } from '../../lib/date'
import { StoreButtons } from '../app/StoreButtons'
import { Logo } from '../brand/Logo'
import { SocialLinks } from '../brand/SocialLinks'
import { Container } from '../ui/Container'

const linkClass = 'rounded text-sm text-brand-200 transition-colors hover:text-white'

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={linkClass}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  const { contact } = siteConfig
  return (
    <footer className="bg-brand-950 text-brand-200">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Professional residential and commercial cleaning, made simple to book and easy to manage — on the web and in the Omegs mobile app.
            </p>
            <SocialLinks className="mt-6" />
            <h2 className="mt-10 text-sm font-semibold text-white">Get the Omegs app</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">Book and manage cleanings from your phone on iOS and Android.</p>
            <StoreButtons tone="light" className="mt-5" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            <FooterColumn title="Services" links={footerNav.services} />
            <FooterColumn title="Company" links={footerNav.company} />
            <div>
              <h2 className="text-sm font-semibold text-white">Contact</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={contact.phoneHref} className="flex items-start gap-2 rounded hover:text-white">
                    <Phone className="mt-0.5 size-4 shrink-0 text-mint-300" aria-hidden="true" />{contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-start gap-2 rounded break-words hover:text-white">
                    <Mail className="mt-0.5 size-4 shrink-0 text-mint-300" aria-hidden="true" />{contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-mint-300" aria-hidden="true" />{contact.address}
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} Omegs. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
