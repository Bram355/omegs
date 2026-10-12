import { Link } from 'react-router-dom'
import { siteConfig, type StoreLink } from '../../config/site'
import { cn } from '../../lib/cn'

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.27-.87-2.3-3.46ZM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22Z" />
    </svg>
  )
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M4.1 2.6c-.2.2-.3.6-.3 1v16.8c0 .4.1.8.3 1l9.4-9.4-9.4-9.4Z" fill="#7fe0b4" />
      <path d="m16.6 15.1-3.1-3.1 3.1-3.1 3.6 2c1 .6 1 1.6 0 2.2l-3.6 2Z" fill="#ffd166" />
      <path d="m16.6 15.1-3.1-3.1-9.4 9.4c.4.4.9.4 1.6.1l10.9-6.4Z" fill="#ff6b6b" />
      <path d="M16.6 8.9 5.7 2.5c-.7-.4-1.2-.3-1.6.1l9.4 9.4 3.1-3.1Z" fill="#4fc3f7" />
    </svg>
  )
}

interface StoreButtonProps {
  platform: 'ios' | 'android'
  tone?: 'dark' | 'light'
  /** When true, placeholder buttons render as static badges instead of linking to /download. */
  staticPlaceholder?: boolean
}

export function StoreButton({ platform, tone = 'dark', staticPlaceholder }: StoreButtonProps) {
  const store: StoreLink = siteConfig.appStores[platform]
  const prefix = store.isPlaceholder ? 'Coming soon to' : platform === 'ios' ? 'Download on the' : 'Get it on'
  const classes = cn(
    'group inline-flex h-14 min-w-[172px] items-center gap-3 rounded-2xl px-4 transition-all duration-200',
    tone === 'dark' ? 'bg-brand-950 text-white ring-1 ring-brand-950' : 'bg-white text-brand-950 ring-1 ring-slate-200',
    !(store.isPlaceholder && staticPlaceholder) && 'hover:-translate-y-0.5 hover:shadow-lift',
  )
  const content = (
    <>
      {platform === 'ios' ? <AppleGlyph className="size-7" /> : <PlayGlyph className="size-6" />}
      <span className="flex flex-col text-left leading-tight">
        <span className={cn('text-[11px] font-medium', tone === 'dark' ? 'text-brand-200' : 'text-slate-500')}>{prefix}</span>
        <span className="text-[17px] font-semibold tracking-tight">{store.label}</span>
      </span>
    </>
  )

  if (!store.isPlaceholder && store.url) {
    return (
      <a href={store.url} target="_blank" rel="noopener noreferrer" className={classes} aria-label={`${prefix} ${store.label}`}>
        {content}
      </a>
    )
  }
  if (staticPlaceholder) {
    return (
      <span className={cn(classes, 'cursor-default opacity-90')} aria-label={`${store.label} listing coming soon`}>
        {content}
      </span>
    )
  }
  return (
    <Link to="/download" className={classes} aria-label={`${store.label} — coming soon. See download page for availability`}>
      {content}
    </Link>
  )
}

export function StoreButtons({ tone = 'dark', staticPlaceholder, className, showNote = true }: { tone?: 'dark' | 'light'; staticPlaceholder?: boolean; className?: string; showNote?: boolean }) {
  const anyPlaceholder = siteConfig.appStores.ios.isPlaceholder || siteConfig.appStores.android.isPlaceholder
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        <StoreButton platform="ios" tone={tone} staticPlaceholder={staticPlaceholder} />
        <StoreButton platform="android" tone={tone} staticPlaceholder={staticPlaceholder} />
      </div>
      {showNote && anyPlaceholder && (
        <p className={cn('mt-3 text-xs', tone === 'dark' ? 'text-slate-500' : 'text-brand-200')}>
          The Omegs app is not yet published. Store links will be added once the listings are live.
        </p>
      )}
    </div>
  )
}
