import { FlaskConical } from 'lucide-react'
import type { ReactNode } from 'react'
import { siteConfig } from '../../config/site'
import { cn } from '../../lib/cn'

/** Clearly labels features that run in demo mode without a connected backend. */
export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  if (!siteConfig.demoMode) return null
  return (
    <div className={cn('flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900', className)}>
      <FlaskConical className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">
        <span className="font-semibold">Demo mode. </span>
        {children}
      </p>
    </div>
  )
}
