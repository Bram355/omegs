import { siteConfig } from '../../config/site'
import { cn } from '../../lib/cn'
import { SocialIcon } from './SocialIcon'

/** Social icons; entries without a configured URL render as non-interactive placeholders. */
export function SocialLinks({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const itemClass = cn(
    'grid size-10 place-items-center rounded-full border transition-colors',
    tone === 'light' ? 'border-white/15 text-brand-100' : 'border-slate-200 text-brand-800',
  )
  return (
    <ul className={cn('flex gap-2', className)} aria-label="Social media">
      {siteConfig.social.map((s) => (
        <li key={s.platform}>
          {s.url ? (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Omegs on ${s.label}`}
              className={cn(itemClass, tone === 'light' ? 'hover:border-white/40 hover:bg-white/10 hover:text-white' : 'hover:bg-brand-50')}
            >
              <SocialIcon platform={s.platform} />
            </a>
          ) : (
            <span className={cn(itemClass, 'cursor-default opacity-60')} title={`${s.label} — profile coming soon`}>
              <SocialIcon platform={s.platform} />
              <span className="sr-only">{s.label} profile coming soon</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
