import { createClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

export const adminClient = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })

/** Resolves the calling user from the request's bearer token. */
export async function requireUser(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data } = await adminClient().auth.getUser(token)
  return data.user ?? null
}

export async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) return
  const from = Deno.env.get('EMAIL_FROM') ?? 'Omegs <onboarding@resend.dev>'
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  })
  if (!res.ok) console.error('Resend error', res.status, await res.text())
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function formatMoney(minor: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100)
}

export async function markBookingPaid(reference: string, paidAmount: number, currency: string) {
  const db = adminClient()
  const { data: booking } = await db.from('bookings').select('*').eq('payment_reference', reference).maybeSingle()
  if (!booking) return { ok: false, reason: 'unknown reference' }
  if (booking.payment_status === 'paid') return { ok: true, booking }
  if (paidAmount < booking.amount_minor || currency.toUpperCase() !== booking.currency.toUpperCase()) {
    await db.from('bookings').update({ payment_status: 'failed' }).eq('id', booking.id)
    return { ok: false, reason: 'amount mismatch' }
  }
  const { data: updated } = await db
    .from('bookings')
    .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', booking.id)
    .select('*')
    .single()
  const { data: settings } = await db.from('app_settings').select('admin_email').single()
  if (settings) {
    await sendEmail(
      settings.admin_email,
      `Payment received — ${booking.reference}`,
      `<p>Payment of <b>${formatMoney(booking.amount_minor, booking.currency)}</b> received for booking <b>${booking.reference}</b> (${escapeHtml(booking.service_name)} on ${booking.date}, ${escapeHtml(booking.time_slot)}).</p>`,
    )
  }
  return { ok: true, booking: updated }
}
