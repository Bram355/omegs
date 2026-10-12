// Paystack webhook: verifies the HMAC signature and records successful charges.
import { markBookingPaid } from '../_shared/util.ts'

async function hmacSha512(secret: string, payload: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  const raw = await req.text()
  const expected = await hmacSha512(Deno.env.get('PAYSTACK_SECRET_KEY')!, raw)
  if (req.headers.get('x-paystack-signature') !== expected) return new Response('invalid signature', { status: 401 })
  const event = JSON.parse(raw)
  if (event.event === 'charge.success') {
    await markBookingPaid(event.data.reference, event.data.amount, event.data.currency)
  }
  return new Response('ok')
})
