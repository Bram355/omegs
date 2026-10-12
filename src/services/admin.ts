import { supabase } from '../lib/supabase'
import type { Booking, BookingStatus } from '../types'
import { fromBookingRow } from './booking'

export interface AdminBooking extends Booking {
  serviceName: string
  customerName: string
  customerEmail: string
  paidAt: string | null
}

export interface ContactMessage {
  id: string
  reference: string
  name: string
  email: string
  subject: string
  message: string
  handled: boolean
  createdAt: string
}

/** Owner-only operations. Every call is also enforced server-side by row level security. */
export const adminService = supabase
  ? {
      async isAdmin(userId: string): Promise<boolean> {
        const { data } = await supabase!.from('profiles').select('role').eq('id', userId).maybeSingle()
        return data?.role === 'admin'
      },
      async listBookings(): Promise<AdminBooking[]> {
        const { data, error } = await supabase!
          .from('bookings')
          .select('*, profiles(full_name, email)')
          .order('date', { ascending: true })
        if (error) throw error
        return data.map((r) => ({
          ...fromBookingRow(r),
          serviceName: r.service_name,
          customerName: r.profiles?.full_name ?? '',
          customerEmail: r.profiles?.email ?? '',
          paidAt: r.paid_at,
        }))
      },
      async setStatus(id: string, status: BookingStatus): Promise<void> {
        const { error } = await supabase!.from('bookings').update({ status }).eq('id', id)
        if (error) throw error
      },
      async listMessages(): Promise<ContactMessage[]> {
        const { data, error } = await supabase!.from('contact_messages').select('*').order('created_at', { ascending: false })
        if (error) throw error
        return data.map((m) => ({ ...m, createdAt: m.created_at }))
      },
      async setMessageHandled(id: string, handled: boolean): Promise<void> {
        const { error } = await supabase!.from('contact_messages').update({ handled }).eq('id', id)
        if (error) throw error
      },
    }
  : null
