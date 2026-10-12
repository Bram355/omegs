import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

interface LogoMarkProps {
  className?: string
  tone?: 'dark' | 'light'
}

/** The Omegs symbol: a clean "O" ring with a mint sparkle. */
export function LogoMark({ className, tone = 'dark' }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn('size-9', className)} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="11" className={tone === 'dark' ? 'fill-brand-900' : 'fill-white'} />
      <circle cx="18.5" cy="21.5" r="9" strokeWidth="4" className={tone === 'dark' ? 'stroke-white' : 'stroke-brand-900'} />
      <path
        d="M30 6.5c.6 2.9 1.6 3.9 4.5 4.5-2.9.6-3.9 1.6-4.5 4.5-.6-2.9-1.6-3.9-4.5-4.5 2.9-.6 3.9-1.6 4.5-4.5Z"
        className={tone === 'dark' ? 'fill-mint-300' : 'fill-mint-500'}
      />
    </svg>
  )
}

interface LogoProps {
  tone?: 'dark' | 'light'
  className?: string
  /** Render as a link to the home page (default true). */
  asLink?: boolean
}

export function Logo({ tone = 'dark', className, asLink = true }: LogoProps) {
  const content = (
    <>
      <LogoMark tone={tone} />
      <span className={cn('text-[22px] font-extrabold tracking-tight', tone === 'dark' ? 'text-brand-950' : 'text-white')}>
        omegs
      </span>
    </>
  )
  const classes = cn('inline-flex items-center gap-2.5 rounded-lg', className)
  return asLink ? (
    <Link to="/" className={classes} aria-label="Omegs — home">
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  )
}
