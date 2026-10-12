import type { ReactNode } from 'react'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import { Container } from '../ui/Container'

interface PageHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: { label: string; to?: string }[]
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, description, breadcrumbs, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-surface">
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-mint-100/70 blur-3xl" aria-hidden="true" />
      <Container className="relative py-14 sm:py-20">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="mt-6 max-w-3xl">
          {eyebrow && <p className="mb-3 text-sm font-semibold tracking-wide text-mint-700 uppercase">{eyebrow}</p>}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          {description && <p className="mt-5 text-lg leading-relaxed text-slate-600">{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
