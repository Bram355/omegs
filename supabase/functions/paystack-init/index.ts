// Starts a Paystack card checkout for one of the caller's unpaid bookings.
import { adminClient, corsHeaders, json, requireUser } from '../_shared/util.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const user = await requireUser(req)
  if (!user) return json({ error: 'Please log in again.' }, 401)
  const { bookingId, callbackUrl } = await req.json().catch(() => ({}))
  if (!bookingId) return json({ error: 'Missing booking.' }, 400)

  const db = adminClient()
  const { data: booking } = await db.from('bookings').select('*').eq('id', bookingId).eq('user_id', user.id).maybeSingle()
  if (!booking) return json({ error: 'Booking not found.' }, 404)
  if (booking.status === 'cancelled') return json({ error: 'This booking was cancelled.' }, 400)
  if (booking.payment_status === 'paid') return json({ error: 'This booking is already paid.' }, 400)

  const reference = `${booking.reference}-${Date.now().toString(36).toUpperCase()}`
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user.email,
      amount: booking.amount_minor,
      currency: booking.currency,
      reference,
      channels: ['card'],
      callback_url: callbackUrl,
      metadata: { booking_id: booking.id, booking_reference: booking.reference },
    }),
  })
  const body = await res.json()
  if (!res.ok || !body.status) {
    console.error('Paystack init failed', body)
    return json({ error: body.message ?? 'Could not start payment.' }, 502)
  }
  await db.from('bookings').update({ payment_status: 'pending', payment_reference: reference }).eq('id', booking.id)
  return json({ authorizationUrl: body.data.authorization_url, reference })
})
