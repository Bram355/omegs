import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  id?: string
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'center', tone = 'dark', id, as: Tag = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cn('mb-3 text-sm font-semibold tracking-wide uppercase', tone === 'dark' ? 'text-mint-700' : 'text-mint-300')}>
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl',
          Tag === 'h1' && 'sm:text-5xl',
          tone === 'light' && 'text-white',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn('mt-4 text-lg leading-relaxed', tone === 'dark' ? 'text-slate-600' : 'text-brand-100')}>{description}</p>
      )}
    </div>
  )
}
