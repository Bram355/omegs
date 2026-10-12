import { router, useFocusEffect } from 'expo-router'
import { CalendarDays, Inbox } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, View } from 'react-native'
import { Button, Card, Notice, styles } from '../../components/ui'
import { useAuth } from '../../context/auth'
import { formatDate, formatMoney } from '../../lib/validation'
import { bookingApi, timeSlots, type Booking, type BookingStatus } from '../../services/bookings'
import { colors, radius } from '../../theme'

const statusStyle: Record<BookingStatus, { label: string; bg: string; fg: string }> = {
  requested: { label: 'Requested', bg: colors.amberBg, fg: colors.amberText },
  confirmed: { label: 'Confirmed', bg: colors.mint100, fg: colors.mint700 },
  completed: { label: 'Completed', bg: colors.surface, fg: colors.muted },
  cancelled: { label: 'Cancelled', bg: colors.dangerBg, fg: colors.danger },
}

export default function BookingsScreen() {
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    try {
      setBookings(await bookingApi.list())
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }, [user])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  if (authLoading) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.brand900} />
  if (!user) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.white }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.brand950, textAlign: 'center' }}>Log in to see your bookings</Text>
        <Text style={[styles.body, { textAlign: 'center', marginTop: 8 }]}>Track requests, payments, and confirmations in one place.</Text>
        <Button label="Log in" onPress={() => router.push('/login')} style={{ marginTop: 20 }} />
        <Button label="Create an account" variant="ghost" onPress={() => router.push('/signup')} style={{ marginTop: 10 }} />
      </View>
    )
  }

  async function pay(b: Booking) {
    setBusy(b.id)
    try {
      const paid = await bookingApi.pay(b.id)
      Alert.alert(paid ? 'Payment received' : 'Payment not completed', paid ? 'Thank you! Your booking is paid.' : 'If you were charged, contact us with your booking reference.')
      await load()
    } catch (e) {
      Alert.alert('Payment', (e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  function cancel(b: Booking) {
    Alert.alert('Cancel booking?', `${b.serviceName} on ${formatDate(b.date)}`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: async () => {
          setBusy(b.id)
          try {
            await bookingApi.cancel(b.id)
            await load()
          } catch (e) {
            Alert.alert('Error', (e as Error).message)
          } finally {
            setBusy(null)
          }
        },
      },
    ])
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 14 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }} />}
    >
      <Button label="Book a new cleaning" onPress={() => router.push('/book')} />
      {error && <Notice tone="error">{error}</Notice>}
      {!bookings ? (
        <ActivityIndicator style={{ marginTop: 24 }} color={colors.brand900} />
      ) : !bookings.length ? (
        <View style={{ alignItems: 'center', padding: 32, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radius.lg }}>
          <Inbox size={28} color={colors.muted} />
          <Text style={{ marginTop: 10, fontWeight: '600', color: colors.brand950 }}>No bookings yet</Text>
        </View>
      ) : (
        bookings.map((b) => {
          const s = statusStyle[b.status]
          const canPay = b.status !== 'cancelled' && b.paymentStatus !== 'paid'
          return (
            <Card key={b.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand950 }}>{b.serviceName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <CalendarDays size={14} color={colors.muted} />
                    <Text style={{ color: colors.muted, fontSize: 13 }}>
                      {formatDate(b.date)} · {timeSlots.find((t) => t.value === b.timeSlot)?.label ?? b.timeSlot}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ backgroundColor: s.bg, color: s.fg, fontSize: 12, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, overflow: 'hidden' }}>{s.label}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: b.paymentStatus === 'paid' ? colors.mint700 : colors.muted }}>
                    {b.paymentStatus === 'paid' ? 'Paid' : formatMoney(b.amountMinor, b.currency)}
                  </Text>
                </View>
              </View>
              <Text style={{ marginTop: 10, fontSize: 12, color: colors.muted, fontFamily: 'monospace' }}>{b.reference}</Text>
              {(canPay || (b.status !== 'cancelled' && b.status !== 'completed')) && (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  {canPay && <Button label={`Pay ${formatMoney(b.amountMinor, b.currency)}`} loading={busy === b.id} onPress={() => pay(b)} style={{ flex: 1, paddingVertical: 11 }} />}
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <Button label="Cancel" variant="danger" disabled={busy === b.id} onPress={() => cancel(b)} style={{ flex: canPay ? 0 : 1, paddingVertical: 11 }} />
                  )}
                </View>
              )}
            </Card>
          )
        })
      )}
    </ScrollView>
  )
}
