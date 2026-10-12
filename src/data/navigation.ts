import { services } from './services'

export const primaryNav = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const serviceNav = services.map((service) => ({
  label: service.name,
  to: `/services/${service.id}`,
  description: service.tagline,
  icon: service.icon,
}))

export const footerNav = {
  services: services.map((s) => ({ label: s.name, to: `/services/${s.id}` })),
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'All Services', to: '/services' },
    { label: 'Download the App', to: '/download' },
    { label: 'Contact', to: '/contact' },
    { label: 'FAQ', to: '/#faq' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms and Conditions', to: '/terms' },
  ],
}
