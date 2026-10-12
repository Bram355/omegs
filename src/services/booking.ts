import { wait } from '../lib/date'
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

export const bookingService: BookingService = demoBookingService

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
