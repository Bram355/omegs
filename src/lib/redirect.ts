import { getServiceById } from '../data/services'

/** Builds a friendly message explaining why the visitor was asked to sign in. */
export function redirectMessage(from: string | undefined): string | null {
  if (!from?.startsWith('/book')) return null
  const serviceId = new URLSearchParams(from.split('?')[1] ?? '').get('service')
  const service = getServiceById(serviceId ?? undefined)
  return service
    ? `Log in or create an account to book ${service.name}. We'll take you straight back to your booking.`
    : "Log in or create an account to book a cleaning. We'll take you straight back to your booking."
}
