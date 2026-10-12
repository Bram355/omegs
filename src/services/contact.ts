import { wait } from '../lib/date'
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

export const contactService: ContactService = demoContactService
