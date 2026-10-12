import { CalendarDays, Inbox, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { getServiceById } from '../../data/services'
import { cn } from '../../lib/cn'
import { formatDate } from '../../lib/date'
import { timeSlots } from '../../services/booking'
import type { Booking } from '../../types'

interface BookingListProps {
  bookings: Booking[] | null
  error: string | null
  onCancel(id: string): Promise<void>
}

export function BookingList({ bookings, error, onCancel }: BookingListProps) {
  const [cancelling, setCancelling] = useState<string | null>(null)

  if (error) return <p className="text-sm text-red-700" role="alert">{error}</p>
  if (!bookings)
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading your bookings…
      </p>
    )
  if (!bookings.length)
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center">
        <Inbox className="size-7 text-slate-400" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-brand-950">No bookings yet</p>
        <p className="mt-1 text-xs text-slate-500">Your booking requests will appear here.</p>
      </div>
    )

  return (
    <ul className="space-y-3">
      {bookings.map((b) => {
        const cancelled = b.status === 'cancelled'
        return (
          <li key={b.id} className={cn('rounded-2xl border border-slate-200 bg-white p-4', cancelled && 'opacity-60')}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-950">{getServiceById(b.serviceId)?.name ?? b.serviceId}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {formatDate(b.date)} · {timeSlots.find((t) => t.value === b.timeSlot)?.label.split(' (')[0]}
                </p>
              </div>
              <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', cancelled ? 'bg-slate-100 text-slate-600' : 'bg-mint-100 text-mint-700')}>
                {cancelled ? 'Cancelled' : 'Requested'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-mono text-[11px] text-slate-400">{b.id}</span>
              {!cancelled && (
                <button
                  type="button"
                  disabled={cancelling === b.id}
                  onClick={async () => {
                    setCancelling(b.id)
                    try {
                      await onCancel(b.id)
                    } finally {
                      setCancelling(null)
                    }
                  }}
                  className="rounded text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
                >
                  {cancelling === b.id ? 'Cancelling…' : 'Cancel'}
                  <span className="sr-only"> booking {b.id}</span>
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
