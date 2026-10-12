import { CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { bookingService } from '../../services/booking'
import type { Booking } from '../../types'
import { formatMoney } from '../../lib/money'

/** Card checkout via the backend's hosted payment page. Hidden in demo mode or when nothing is owed. */
export function PayButton({ booking, compact = false }: { booking: Booking; compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')
  if (!bookingService.startPayment || booking.status === 'cancelled' || booking.paymentStatus === 'paid') return null

  const amount = booking.amountMinor && booking.currency ? formatMoney(booking.amountMinor, booking.currency) : ''

  async function pay() {
    setState('loading')
    try {
      const url = await bookingService.startPayment!(booking.id, `${window.location.origin}/book`)
      window.location.assign(url)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Could not start payment.')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={state === 'loading'}
        className={
          compact
            ? 'inline-flex items-center gap-1.5 rounded text-xs font-semibold text-brand-800 hover:underline disabled:opacity-50'
            : 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60'
        }
      >
        {state === 'loading' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CreditCard className="size-4" aria-hidden="true" />}
        {state === 'loading' ? 'Opening secure checkout…' : `Pay ${amount} by card`.replace('  ', ' ')}
      </button>
      {state === 'error' && <p role="alert" className="mt-2 text-xs text-red-700">{message}</p>}
    </div>
  )
}
