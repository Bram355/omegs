import * as WebBrowser from 'expo-web-browser'
import { config } from '../config'
import { getService } from '../data/services'
import { supabase } from '../lib/supabase'

export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded' | 'failed'

export interface Booking {
  id: string
  reference: string
  serviceId: string
  serviceName: string
  date: string
  timeSlot: string
  propertyType: string
  address: string
  phone: string
  notes: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  amountMinor: number
  currency: string
  createdAt: string
}

export interface BookingInput {
  serviceId: string
  date: string
  timeSlot: string
  propertyType: string
  address: string
  phone: string
  notes: string
}

export const timeSlots = [
  { value: 'morning', label: 'Morning', hint: '8:00 – 11:00' },
  { value: 'midday', label: 'Midday', hint: '11:00 – 14:00' },
  { value: 'afternoon', label: 'Afternoon', hint: '14:00 – 17:00' },
  { value: 'evening', label: 'Evening', hint: '17:00 – 20:00' },
]

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromRow = (r: any): Booking => ({
  id: r.id,
  reference: r.reference,
  serviceId: r.service_id,
  serviceName: r.service_name,
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

function client() {
  if (!supabase) throw new Error('The Omegs service is not connected yet.')
  return supabase
}

async function invoke<T>(name: string, body: object): Promise<T> {
  const { data, error } = await client().functions.invoke(name, { body })
  if (error) {
    const detail = await (error as { context?: Response }).context?.json?.().catch(() => null)
    throw new Error(detail?.error ?? 'Something went wrong. Please try again.')
  }
  return data as T
}

export const bookingApi = {
  async list(): Promise<Booking[]> {
    const { data, error } = await client().from('bookings').select('*').order('created_at', { ascending: false })
    if (error) throw new Error('Could not load your bookings.')
    return data.map(fromRow)
  },

  async create(userId: string, input: BookingInput): Promise<Booking> {
    const { data, error } = await client()
      .from('bookings')
      .insert({
        user_id: userId,
        service_id: input.serviceId,
        service_name: getService(input.serviceId)?.name ?? input.serviceId,
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
    client().functions.invoke('notify', { body: { type: 'booking', id: data.id } }).catch(() => undefined)
    return fromRow(data)
  },

  async cancel(id: string): Promise<void> {
    const { error } = await client().from('bookings').update({ status: 'cancelled' }).eq('id', id)
    if (error) throw new Error('We couldn’t cancel this booking.')
  },

  /** Opens Paystack's hosted card checkout, then verifies the payment once the browser closes. */
  async pay(id: string): Promise<boolean> {
    const { authorizationUrl, reference } = await invoke<{ authorizationUrl: string; reference: string }>('paystack-init', {
      bookingId: id,
      callbackUrl: `${config.webUrl}/book`,
    })
    await WebBrowser.openBrowserAsync(authorizationUrl)
    const { paid } = await invoke<{ paid: boolean }>('paystack-verify', { reference })
    return paid
  },
}
