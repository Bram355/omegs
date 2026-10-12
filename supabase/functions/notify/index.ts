// Emails the Omegs admin (and the customer, when a sending domain is configured) about new activity.
import { adminClient, corsHeaders, escapeHtml, formatMoney, json, sendEmail } from '../_shared/util.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const { type, id } = await req.json().catch(() => ({}))
  const db = adminClient()
  const { data: settings } = await db.from('app_settings').select('admin_email').single()
  if (!settings) return json({ error: 'Not configured' }, 500)

  if (type === 'booking') {
    const { data: b } = await db.from('bookings').select('*, profiles(full_name, email)').eq('id', id).maybeSingle()
    if (!b) return json({ error: 'Not found' }, 404)
    const rows = [
      ['Reference', b.reference], ['Service', b.service_name], ['Date', b.date], ['Time', b.time_slot],
      ['Property', b.property_type], ['Address', b.address], ['Phone', b.phone], ['Customer', `${b.profiles?.full_name} (${b.profiles?.email})`],
      ['Price', formatMoney(b.amount_minor, b.currency)], ['Notes', b.notes || '—'],
    ].map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${k}</td><td>${escapeHtml(String(v))}</td></tr>`).join('')
    await sendEmail(settings.admin_email, `New booking ${b.reference} — ${b.service_name}`, `<h2>New booking request</h2><table>${rows}</table>`)
    if (Deno.env.get('EMAIL_FROM') && b.profiles?.email) {
      await sendEmail(b.profiles.email, `We received your booking ${b.reference}`, `<p>Hi ${escapeHtml(b.profiles.full_name || 'there')},</p><p>Thanks for booking ${escapeHtml(b.service_name)} with Omegs on ${b.date} (${escapeHtml(b.time_slot)}). We'll confirm shortly.</p><table>${rows}</table>`)
    }
    return json({ ok: true })
  }

  if (type === 'contact') {
    const { data: m } = await db.from('contact_messages').select('*').eq('id', id).maybeSingle()
    if (!m) return json({ error: 'Not found' }, 404)
    await sendEmail(settings.admin_email, `Contact form: ${m.subject}`, `<p><b>${escapeHtml(m.name)}</b> (${escapeHtml(m.email)}) wrote:</p><p style="white-space:pre-wrap">${escapeHtml(m.message)}</p><p>Ref ${m.reference}</p>`)
    return json({ ok: true })
  }
  return json({ error: 'Unknown type' }, 400)
})
