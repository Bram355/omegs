import { getServiceById } from '../data/services'
import { wait } from '../lib/date'
import { supabase } from '../lib/supabase'
import type { Booking, BookingInput } from '../types'
import { createId, readJSON, writeJSON } from './storage'

/**
 * Booking contract used by the UI. Replace `demoBookingService` with an API-backed
 * implementation (REST, Firebase, Supabase, …) when a backend is available.
 */
export interface BookingService {
  createBooking(userId: string, input: BookingInput): Promise<Booking>
  listBookings(userId: string): Promise<Booking[]>
  cancelBooking(userId: string, bookingId: string): Promise<Booking>
  /** Starts card checkout and returns the hosted payment page URL (backend only). */
  startPayment?(bookingId: string, returnUrl: string): Promise<string>
  /** Confirms a payment after the provider redirects back (backend only). */
  verifyPayment?(reference: string): Promise<boolean>
}

/* DEMO IMPLEMENTATION — bookings are stored only in this browser and are NOT sent to Omegs. */
const BOOKINGS_KEY = 'omegs.demo.bookings'

const readAll = () => readJSON<Booking[]>(localStorage, BOOKINGS_KEY, [])

export const demoBookingService: BookingService = {
  async createBooking(userId, input) {
    await wait(900)
    const booking: Booking = {
      ...input,
      id: createId('DEMO'),
      userId,
      status: 'requested',
      createdAt: new Date().toISOString(),
    }
    writeJSON(localStorage, BOOKINGS_KEY, [booking, ...readAll()])
    return booking
  },

  async listBookings(userId) {
    await wait(300)
    return readAll().filter((b) => b.userId === userId)
  },

  async cancelBooking(userId, bookingId) {
    await wait(500)
    const all = readAll()
    const booking = all.find((b) => b.id === bookingId && b.userId === userId)
    if (!booking) throw new Error('Booking not found.')
    const updated: Booking = { ...booking, status: 'cancelled' }
    writeJSON(localStorage, BOOKINGS_KEY, all.map((b) => (b.id === bookingId ? updated : b)))
    return updated
  },
}

/* SUPABASE IMPLEMENTATION — used automatically when Supabase env vars are configured. */

interface BookingRow {
  id: string
  reference: string
  user_id: string
  service_id: string
  date: string
  time_slot: string
  property_type: Booking['propertyType']
  address: string
  phone: string
  notes: string
  status: Booking['status']
  payment_status: NonNullable<Booking['paymentStatus']>
  amount_minor: number
  currency: string
  created_at: string
}

export const fromBookingRow = (r: BookingRow): Booking => ({
  id: r.id,
  reference: r.reference,
  userId: r.user_id,
  serviceId: r.service_id,
  date: r.date,
  timeSlot: r.time_slot,
  propertyType: r.property_type,
  address: r.address,
  phone: r.phone,
  notes: r.notes,
  status: r.status,
  paymentStatus: r.payment_status,
  amountMinor: r.amount_minor,
  currency: r.currency,
  createdAt: r.created_at,
})

async function invokeOrThrow<T>(client: NonNullable<typeof supabase>, name: string, body: object): Promise<T> {
  const { data, error } = await client.functions.invoke(name, { body })
  if (error) {
    const detail = await (error as { context?: Response }).context?.json?.().catch(() => null)
    throw new Error(detail?.error ?? 'Something went wrong. Please try again.')
  }
  return data as T
}

function createSupabaseBookingService(client: NonNullable<typeof supabase>): BookingService {
  return {
    async createBooking(userId, input) {
      const { data, error } = await client
        .from('bookings')
        .insert({
          user_id: userId,
          service_id: input.serviceId,
          service_name: getServiceById(input.serviceId)?.name ?? input.serviceId,
          date: input.date,
          time_slot: input.timeSlot,
          property_type: input.propertyType,
          address: input.address,
          phone: input.phone,
          notes: input.notes,
          amount_minor: 0,
          currency: 'USD',
        })
        .select('*')
        .single()
      if (error || !data) throw new Error('We couldn’t save your booking. Please try again.')
      client.functions.invoke('notify', { body: { type: 'booking', id: data.id } }).catch(() => undefined)
      return fromBookingRow(data as BookingRow)
    },
    async listBookings() {
      const { data, error } = await client.from('bookings').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return (data as BookingRow[]).map(fromBookingRow)
    },
    async cancelBooking(_userId, bookingId) {
      const { data, error } = await client.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId).select('*').single()
      if (error || !data) throw new Error('We couldn’t cancel this booking.')
      return fromBookingRow(data as BookingRow)
    },
    async startPayment(bookingId, returnUrl) {
      const data = await invokeOrThrow<{ authorizationUrl: string }>(client, 'paystack-init', { bookingId, callbackUrl: returnUrl })
      return data.authorizationUrl
    },
    async verifyPayment(reference) {
      const data = await invokeOrThrow<{ paid: boolean }>(client, 'paystack-verify', { reference })
      return data.paid
    },
  }
}

export const bookingService: BookingService = supabase ? createSupabaseBookingService(supabase) : demoBookingService

export const timeSlots = [
  { value: 'morning', label: 'Morning (8:00 – 11:00)' },
  { value: 'midday', label: 'Midday (11:00 – 14:00)' },
  { value: 'afternoon', label: 'Afternoon (14:00 – 17:00)' },
  { value: 'evening', label: 'Evening (17:00 – 20:00)' },
]

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'office', label: 'Office / commercial' },
  { value: 'other', label: 'Other' },
]
