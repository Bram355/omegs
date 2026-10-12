import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'mint' | 'brand' | 'amber' | 'slate' | 'glass'

const tones: Record<Tone, string> = {
  mint: 'bg-mint-100 text-mint-700',
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  slate: 'bg-slate-100 text-slate-700',
  glass: 'bg-white/15 text-white ring-1 ring-white/25 backdrop-blur',
}

export function Badge({ tone = 'mint', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}
