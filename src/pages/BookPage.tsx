import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookingConfirmation } from '../components/booking/BookingConfirmation'
import { BookingForm } from '../components/booking/BookingForm'
import { BookingList } from '../components/booking/BookingList'
import { PageHeader } from '../components/layout/PageHeader'
import { Container } from '../components/ui/Container'
import { DemoNotice } from '../components/ui/DemoNotice'
import { ResponsiveImage } from '../components/ui/ResponsiveImage'
import { getServiceById } from '../data/services'
import { useAuth } from '../hooks/useAuth'
import { useSeo } from '../hooks/useSeo'
import { bookingService } from '../services/booking'
import type { Booking } from '../types'

export default function BookPage() {
  useSeo('Book a Cleaning', 'Request an Omegs cleaning: choose your service, preferred date, and time.')
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const serviceId = params.get('service') ?? undefined
  const selected = getServiceById(serviceId)
  const [confirmed, setConfirmed] = useState<Booking | null>(null)
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)

  const loadBookings = useCallback(async () => {
    if (!user) return
    try {
      setBookings(await bookingService.listBookings(user.id))
      setListError(null)
    } catch {
      setListError('We couldn’t load your bookings.')
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    let active = true
    bookingService.listBookings(user.id).then(
      (list) => active && setBookings(list),
      () => active && setListError('We couldn’t load your bookings.'),
    )
    return () => {
      active = false
    }
  }, [user])

  const handleServiceChange = (id: string) => {
    const next = new URLSearchParams(params)
    next.set('service', id)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Book a Cleaning' }]}
        eyebrow="Booking"
        title="Book a cleaning"
        description={`Hi ${user?.fullName.split(' ')[0] ?? 'there'} — tell us what you need and when. It only takes a minute.`}
      />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
              {confirmed ? (
                <BookingConfirmation
                  booking={confirmed}
                  onNew={() => {
                    setConfirmed(null)
                    setFormKey((k) => k + 1)
                  }}
                />
              ) : (
                <>
                  <h2 id="booking-form-title" className="text-2xl font-bold tracking-tight">Booking details</h2>
                  <p className="mt-1 text-sm text-slate-500">Fields marked <span className="text-red-600">*</span> are required.</p>
                  <DemoNotice className="mt-6">
                    Booking requests are stored only in this browser and are not sent to Omegs or saved to a production database.
                  </DemoNotice>
                  <div className="mt-8">
                    <BookingForm
                      key={formKey}
                      initialServiceId={serviceId}
                      onServiceChange={handleServiceChange}
                      onBooked={(b) => {
                        setConfirmed(b)
                        void loadBookings()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4" aria-label="Booking summary">
            {selected && (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
                <ResponsiveImage image={selected.image} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[16/9] w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs font-semibold tracking-wide text-mint-700 uppercase">Selected service</p>
                  <h2 className="mt-1 text-lg font-bold">{selected.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected.shortDescription}</p>
                  <p className="mt-4 text-sm text-slate-600">
                    <span className="font-semibold text-brand-950">Pricing: </span>
                    {selected.pricing.startingAt ?? 'Quote on request'}
                  </p>
                  <Link to={`/services/${selected.id}`} className="mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-brand-800 hover:text-mint-700">
                    What’s included <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
            <div className="rounded-3xl bg-surface p-6">
              <h2 className="text-lg font-bold">My bookings</h2>
              <p className="mt-1 mb-4 text-xs text-slate-500">Demo requests saved on this device.</p>
              <BookingList
                bookings={bookings}
                error={listError}
                onCancel={async (id) => {
                  if (!user) return
                  await bookingService.cancelBooking(user.id, id)
                  await loadBookings()
                }}
              />
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
