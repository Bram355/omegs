import { PageHeader } from '../components/layout/PageHeader'
import { Alert } from '../components/ui/Alert'
import { Container } from '../components/ui/Container'
import { siteConfig } from '../config/site'
import { useSeo } from '../hooks/useSeo'

const documents = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This page describes how Omegs will collect, use, and protect personal information.',
    sections: [
      { heading: 'Information we collect', body: 'Describe the personal information collected through the website and mobile app — for example account details, booking information, and contact form submissions.' },
      { heading: 'How we use information', body: 'Explain the purposes for processing, such as providing cleaning services, managing bookings, customer support, and service communications.' },
      { heading: 'Sharing and third parties', body: 'List any service providers (hosting, authentication, payments, analytics, email) that process data on Omegs’ behalf.' },
      { heading: 'Data retention and security', body: 'State how long information is kept and the safeguards in place to protect it.' },
      { heading: 'Your rights', body: 'Explain how customers can access, correct, or delete their information, and how to make a request.' },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    intro: 'These terms will govern the use of the Omegs website, mobile app, and cleaning services.',
    sections: [
      { heading: 'Services', body: 'Describe the cleaning services offered and how service scope is agreed for each booking.' },
      { heading: 'Bookings, rescheduling, and cancellations', body: 'Set out how bookings are confirmed, rescheduled, or cancelled, including any notice periods or fees.' },
      { heading: 'Pricing and payment', body: 'Explain how quotes are provided, when payment is due, and accepted payment methods.' },
      { heading: 'Customer responsibilities', body: 'Outline access, safety, and preparation expectations for the property being cleaned.' },
      { heading: 'Liability and complaints', body: 'Describe liability limits and the process for raising concerns or complaints.' },
    ],
  },
} as const

export default function LegalPage({ doc }: { doc: keyof typeof documents }) {
  const { title, intro, sections } = documents[doc]
  useSeo(title)
  return (
    <>
      <PageHeader breadcrumbs={[{ label: 'Home', to: '/' }, { label: title }]} eyebrow="Legal" title={title} description={intro} />
      <section className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Alert tone="warning" title="Draft placeholder">
            This document is a structural outline only and is not legally binding. It must be replaced with a policy reviewed by a qualified legal professional before launch.
          </Alert>
          <div className="mt-10 space-y-10">
            {sections.map((s, i) => (
              <section key={s.heading}>
                <h2 className="text-xl font-bold tracking-tight">{i + 1}. {s.heading}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{s.body}</p>
              </section>
            ))}
            <section>
              <h2 className="text-xl font-bold tracking-tight">Contact</h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Questions about this document can be sent to{' '}
                <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-brand-800 underline underline-offset-2">{siteConfig.contact.email}</a>.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  )
}
