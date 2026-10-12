import { CalendarDays, Inbox, Loader2, Mail, Phone, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Container } from '../components/ui/Container'
import { useAuth } from '../hooks/useAuth'
import { useSeo } from '../hooks/useSeo'
import { cn } from '../lib/cn'
import { formatDate } from '../lib/date'
import { formatMoney } from '../lib/money'
import { adminService, type AdminBooking, type ContactMessage } from '../services/admin'
import { propertyTypes, timeSlots } from '../services/booking'
import type { BookingStatus } from '../types'

const filters: Array<{ value: BookingStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'requested', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusTone: Record<BookingStatus, string> = {
  requested: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-mint-100 text-mint-700',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-50 text-red-700',
}

const nextActions: Record<BookingStatus, Array<{ status: BookingStatus; label: string }>> = {
  requested: [{ status: 'confirmed', label: 'Confirm' }, { status: 'cancelled', label: 'Decline' }],
  confirmed: [{ status: 'completed', label: 'Mark completed' }, { status: 'cancelled', label: 'Cancel' }],
  completed: [],
  cancelled: [{ status: 'requested', label: 'Reopen' }],
}

export default function AdminPage() {
  useSeo('Admin', 'Manage Omegs bookings and messages.')
  const { user } = useAuth()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'bookings' | 'messages'>('bookings')
  const [filter, setFilter] = useState<BookingStatus | 'all'>('requested')
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null)
  const [messages, setMessages] = useState<ContactMessage[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!adminService) return
    try {
      const [b, m] = await Promise.all([adminService.listBookings(), adminService.listMessages()])
      setBookings(b)
      setMessages(m)
      setError(null)
    } catch {
      setError('Could not load data. Check your connection and refresh.')
    }
  }, [])

  useEffect(() => {
    if (!user || !adminService) return
    let active = true
    adminService.isAdmin(user.id).then((ok) => {
      if (!active) return
      setAllowed(ok)
      if (ok) load()
    })
    return () => {
      active = false
    }
  }, [user, load])

  const visible = useMemo(
    () => (bookings ?? []).filter((b) => filter === 'all' || b.status === filter),
    [bookings, filter],
  )
  const paidTotal = useMemo(
    () => (bookings ?? []).filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.amountMinor ?? 0), 0),
    [bookings],
  )

  async function updateStatus(id: string, status: BookingStatus) {
    if (!adminService) return
    setBusy(id)
    try {
      await adminService.setStatus(id, status)
      await load()
    } catch {
      setError('Could not update that booking.')
    } finally {
      setBusy(null)
    }
  }

  async function toggleHandled(m: ContactMessage) {
    if (!adminService) return
    setBusy(m.id)
    try {
      await adminService.setMessageHandled(m.id, !m.handled)
      await load()
    } finally {
      setBusy(null)
    }
  }

  if (!adminService) {
    return <Centered>The admin dashboard needs the backend to be connected.</Centered>
  }
  if (allowed === null) {
    return (
      <Centered>
        <Loader2 className="mx-auto size-6 animate-spin" aria-label="Loading" />
      </Centered>
    )
  }
  if (!allowed) return <Centered>This page is only available to the Omegs owner account.</Centered>

  const counts = (bookings ?? []).reduce<Record<string, number>>((acc, b) => ({ ...acc, [b.status]: (acc[b.status] ?? 0) + 1 }), {})
  const unhandled = (messages ?? []).filter((m) => !m.handled).length

  return (
    <>
      <PageHeader eyebrow="Owner" title="Bookings dashboard" description="Confirm requests, track payments, and reply to messages." />
      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="New requests" value={counts.requested ?? 0} />
            <Stat label="Confirmed" value={counts.confirmed ?? 0} />
            <Stat label="Unread messages" value={unhandled} />
            <Stat label="Paid (total)" value={formatMoney(paidTotal, bookings?.[0]?.currency ?? 'USD')} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" className="inline-flex rounded-full bg-surface p-1">
              {(['bookings', 'messages'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn('rounded-full px-4 py-2 text-sm font-semibold capitalize', tab === t ? 'bg-white text-brand-950 shadow-soft' : 'text-slate-600')}
                >
                  {t}
                </button>
              ))}
            </div>
            <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-surface">
              <RefreshCw className="size-4" aria-hidden="true" /> Refresh
            </button>
          </div>

          {error && <p role="alert" className="mt-6 text-sm text-red-700">{error}</p>}

          {tab === 'bookings' ? (
            <>
              <div className="mt-6 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    aria-pressed={filter === f.value}
                    onClick={() => setFilter(f.value)}
                    className={cn('rounded-full border px-3.5 py-1.5 text-xs font-semibold', filter === f.value ? 'border-brand-900 bg-brand-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-surface')}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {!bookings ? (
                <p className="mt-8 text-sm text-slate-500" role="status">Loading bookings…</p>
              ) : !visible.length ? (
                <Empty text="No bookings in this view." />
              ) : (
                <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                  {visible.map((b) => (
                    <li key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-brand-950">{b.serviceName}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                            <CalendarDays className="size-4" aria-hidden="true" />
                            {formatDate(b.date)} · {timeSlots.find((t) => t.value === b.timeSlot)?.label ?? b.timeSlot}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize', statusTone[b.status])}>{b.status}</span>
                          <span className={cn('text-[11px] font-semibold capitalize', b.paymentStatus === 'paid' ? 'text-mint-700' : 'text-slate-500')}>
                            {b.paymentStatus === 'paid' ? `Paid ${formatMoney(b.amountMinor ?? 0, b.currency ?? 'USD')}` : b.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <dl className="mt-4 grid gap-1.5 text-sm">
                        <Row label="Customer">{b.customerName || '—'} <span className="text-slate-500">({b.customerEmail})</span></Row>
                        <Row label="Phone"><a className="inline-flex items-center gap-1 text-brand-800 hover:underline" href={`tel:${b.phone}`}><Phone className="size-3.5" aria-hidden="true" />{b.phone}</a></Row>
                        <Row label="Address">{b.address}</Row>
                        <Row label="Property">{propertyTypes.find((p) => p.value === b.propertyType)?.label ?? b.propertyType}</Row>
                        {b.notes && <Row label="Notes">{b.notes}</Row>}
                        <Row label="Ref"><span className="font-mono text-xs">{b.reference}</span></Row>
                      </dl>
                      {nextActions[b.status].length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                          {nextActions[b.status].map((a) => (
                            <button
                              key={a.status}
                              type="button"
                              disabled={busy === b.id}
                              onClick={() => updateStatus(b.id, a.status)}
                              className={cn(
                                'rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-50',
                                a.status === 'cancelled' ? 'border border-red-200 text-red-700 hover:bg-red-50' : 'bg-brand-900 text-white hover:bg-brand-800',
                              )}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : !messages ? (
            <p className="mt-8 text-sm text-slate-500" role="status">Loading messages…</p>
          ) : !messages.length ? (
            <Empty text="No messages yet." />
          ) : (
            <ul className="mt-6 space-y-4">
              {messages.map((m) => (
                <li key={m.id} className={cn('rounded-2xl border border-slate-200 bg-white p-5', m.handled && 'opacity-60')}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-950">{m.subject}</p>
                      <p className="text-sm text-slate-600">{m.name} · <a className="text-brand-800 hover:underline" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}><Mail className="mr-1 inline size-3.5" aria-hidden="true" />{m.email}</a></p>
                    </div>
                    <button type="button" disabled={busy === m.id} onClick={() => toggleHandled(m)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-surface">
                      {m.handled ? 'Mark unread' : 'Mark handled'}
                    </button>
                  </div>
                  <p className="mt-3 text-sm whitespace-pre-line text-slate-700">{m.message}</p>
                  <p className="mt-3 text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()} · {m.reference}</p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-24">
      <Container className="max-w-lg text-center text-slate-600">{children}</Container>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-950">{value}</p>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="break-words text-brand-950">{children}</dd>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center">
      <Inbox className="size-7 text-slate-400" aria-hidden="true" />
      <p className="mt-3 text-sm text-slate-600">{text}</p>
    </div>
  )
}
