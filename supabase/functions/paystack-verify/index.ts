// Verifies a Paystack transaction after redirect and marks the booking as paid.
import { corsHeaders, json, markBookingPaid, requireUser } from '../_shared/util.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (!(await requireUser(req))) return json({ error: 'Please log in again.' }, 401)
  const { reference } = await req.json().catch(() => ({}))
  if (!reference) return json({ error: 'Missing reference.' }, 400)
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}` },
  })
  const body = await res.json()
  if (!res.ok || body.data?.status !== 'success') return json({ paid: false, status: body.data?.status ?? 'unknown' })
  const result = await markBookingPaid(reference, body.data.amount, body.data.currency)
  return json({ paid: result.ok, booking: result.booking ?? null })
})
