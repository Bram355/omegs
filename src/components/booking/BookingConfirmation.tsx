import { CheckCircle2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { getServiceById } from '../../data/services'
import { formatDate } from '../../lib/date'
import { propertyTypes, timeSlots } from '../../services/booking'
import type { Booking } from '../../types'
import { Button, ButtonLink } from '../ui/Button'
import { DemoNotice } from '../ui/DemoNotice'
import { PayButton } from './PayButton'
import { formatMoney } from '../../lib/money'

export function BookingConfirmation({ booking, onNew }: { booking: Booking; onNew(): void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])
  const service = getServiceById(booking.serviceId)

  const rows = [
    ['Reference', booking.reference ?? booking.id],
    ['Service', service?.name ?? booking.serviceId],
    ['Date', formatDate(booking.date)],
    ['Time window', timeSlots.find((t) => t.value === booking.timeSlot)?.label ?? booking.timeSlot],
    ['Property', propertyTypes.find((p) => p.value === booking.propertyType)?.label ?? booking.propertyType],
    ['Address', booking.address],
    ['Contact phone', booking.phone],
    ...(booking.amountMinor && booking.currency ? [['Price', formatMoney(booking.amountMinor, booking.currency)]] : []),
  ]

  return (
    <div role="status" className="animate-fade-up">
      <span className="grid size-14 place-items-center rounded-2xl bg-mint-100 text-mint-700">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-2xl font-bold tracking-tight outline-none sm:text-3xl">
        Booking request recorded
      </h2>
      <p className="mt-2 text-slate-600">
        {booking.reference
          ? 'We’ve received your request and will confirm it shortly. You can pay now to secure your slot.'
          : 'Here’s a summary of your request.'}
      </p>
      <DemoNotice className="mt-6">
        This booking was saved only in your browser. It has not been sent to Omegs and no cleaner has been scheduled.
      </DemoNotice>
      <dl className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="text-sm font-medium break-words text-brand-950 sm:col-span-2">{value}</dd>
          </div>
        ))}
        {booking.notes && (
          <div className="grid gap-1 px-5 py-3.5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm text-slate-500">Notes</dt>
            <dd className="text-sm whitespace-pre-line text-brand-950 sm:col-span-2">{booking.notes}</dd>
          </div>
        )}
      </dl>
      <div className="mt-6">
        <PayButton booking={booking} />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onNew}>Book another cleaning</Button>
        <ButtonLink to="/download" variant="secondary">Get the Omegs app</ButtonLink>
      </div>
    </div>
  )
}
