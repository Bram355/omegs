import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'info' | 'success' | 'error' | 'warning'

const styles: Record<Tone, { box: string; icon: typeof Info }> = {
  info: { box: 'border-brand-100 bg-brand-50 text-brand-800', icon: Info },
  success: { box: 'border-mint-200 bg-mint-50 text-mint-700', icon: CheckCircle2 },
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: AlertCircle },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', icon: TriangleAlert },
}

interface AlertProps {
  tone?: Tone
  title?: string
  children?: ReactNode
  className?: string
  live?: boolean
}

export function Alert({ tone = 'info', title, children, className, live }: AlertProps) {
  const { box, icon: Icon } = styles[tone]
  return (
    <div
      className={cn('flex gap-3 rounded-2xl border p-4 text-sm', box, className)}
      role={live ? (tone === 'error' ? 'alert' : 'status') : undefined}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  )
}
