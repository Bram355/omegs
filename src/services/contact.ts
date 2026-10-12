import { wait } from '../lib/date'
import { supabase } from '../lib/supabase'
import type { ContactInput } from '../types'
import { createId } from './storage'

/**
 * Contact / lead capture contract. Connect to an email service (e.g. Resend, SendGrid,
 * Formspree) or your own API by replacing the demo implementation.
 */
export interface ContactService {
  sendMessage(input: ContactInput): Promise<{ reference: string }>
  joinAppWaitlist(email: string): Promise<void>
}

/* DEMO IMPLEMENTATION — nothing is transmitted or stored. */
export const demoContactService: ContactService = {
  async sendMessage() {
    await wait(900)
    return { reference: createId('MSG') }
  },
  async joinAppWaitlist() {
    await wait(700)
  },
}

function createSupabaseContactService(client: NonNullable<typeof supabase>): ContactService {
  return {
    async sendMessage(input) {
      const id = crypto.randomUUID()
      const reference = `MSG-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
      const { error } = await client.from('contact_messages').insert({ id, reference, ...input })
      if (error) throw new Error('We couldn’t send your message. Please try again.')
      await client.functions.invoke('notify', { body: { type: 'contact', id } }).catch(() => undefined)
      return { reference }
    },
    async joinAppWaitlist(email) {
      const { error } = await client.from('app_waitlist').insert({ email: email.trim().toLowerCase() })
      if (error && error.code !== '23505') throw new Error('We couldn’t add you to the list. Please try again.')
    },
  }
}

export const contactService: ContactService = supabase ? createSupabaseContactService(supabase) : demoContactService
