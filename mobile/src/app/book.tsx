import { router, useLocalSearchParams } from 'expo-router'
import { CheckCircle2 } from 'lucide-react-native'
import { useMemo, useState, type ReactNode } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { Button, Card, Chip, Field, Notice, Screen, styles } from '../components/ui'
import { useAuth } from '../context/auth'
import { services } from '../data/services'
import { formatDate, formatMoney, isPhone, toISODate } from '../lib/validation'
import { bookingApi, propertyTypes, timeSlots, type Booking } from '../services/bookings'
import { colors } from '../theme'

function Group({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

export default function BookScreen() {
  const params = useLocalSearchParams<{ service?: string }>()
  const { user, configured } = useAuth()
  const dates = useMemo(() => Array.from({ length: 21 }, (_, i) => toISODate(new Date(Date.now() + (i + 1) * 86400000))), [])
  const [form, setForm] = useState({
    serviceId: services.some((s) => s.id === params.service) ? params.service! : '',
    date: '',
    timeSlot: '',
    propertyType: '',
    address: '',
    phone: user?.phone ?? '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [paying, setPaying] = useState(false)
  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  if (!user) {
    return (
      <Screen>
        <Text style={styles.sectionTitle}>Log in to book</Text>
        <Text style={[styles.body, { marginTop: 8 }]}>Create a free account or log in so we can confirm your booking.</Text>
        {!configured && <View style={{ marginTop: 16 }}><Notice>The booking service is not connected yet. Please check back soon or call us.</Notice></View>}
        <Button label="Log in" onPress={() => router.push({ pathname: '/login', params: { next: '/book', service: form.serviceId } })} style={{ marginTop: 20 }} />
        <Button label="Create account" variant="ghost" onPress={() => router.push({ pathname: '/signup', params: { next: '/book', service: form.serviceId } })} style={{ marginTop: 10 }} />
      </Screen>
    )
  }

  if (booking) {
    return (
      <Screen>
        <CheckCircle2 size={44} color={colors.mint500} />
        <Text accessibilityRole="header" style={[styles.sectionTitle, { marginTop: 12 }]}>Booking request received</Text>
        <Text style={[styles.body, { marginTop: 6 }]}>We’ll confirm shortly. Pay now to secure your slot.</Text>
        <Card style={{ marginTop: 18, gap: 6 }}>
          {[
            ['Reference', booking.reference],
            ['Service', booking.serviceName],
            ['Date', formatDate(booking.date)],
            ['Time', timeSlots.find((t) => t.value === booking.timeSlot)?.label ?? booking.timeSlot],
            ['Address', booking.address],
            ['Price', formatMoney(booking.amountMinor, booking.currency)],
          ].map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Text style={{ color: colors.muted }}>{k}</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontWeight: '600', color: colors.brand950 }}>{v}</Text>
            </View>
          ))}
        </Card>
        <Button
          label={`Pay ${formatMoney(booking.amountMinor, booking.currency)} by card`}
          loading={paying}
          onPress={async () => {
            setPaying(true)
            try {
              const paid = await bookingApi.pay(booking.id)
              Alert.alert(paid ? 'Payment received' : 'Payment not completed', paid ? 'Thank you! Your booking is paid.' : 'You can try again from My bookings.')
              if (paid) router.replace('/bookings')
            } catch (e) {
              Alert.alert('Payment', (e as Error).message)
            } finally {
              setPaying(false)
            }
          }}
          style={{ marginTop: 20 }}
        />
        <Button label="Pay later" variant="ghost" onPress={() => router.replace('/bookings')} style={{ marginTop: 10 }} />
      </Screen>
    )
  }

  async function submit() {
    const next: Record<string, string> = {}
    if (!form.serviceId) next.serviceId = 'Choose a service.'
    if (!form.date) next.date = 'Choose a date.'
    if (!form.timeSlot) next.timeSlot = 'Choose a time window.'
    if (!form.propertyType) next.propertyType = 'Choose a property type.'
    if (form.address.trim().length < 5) next.address = 'Enter the full address.'
    if (!isPhone(form.phone)) next.phone = 'Enter a valid phone number.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      setBooking(await bookingApi.create(user!.id, form))
    } catch (e) {
      setSubmitError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Screen>
      {submitError && <Notice tone="error">{submitError}</Notice>}
      <Group label="Service" error={errors.serviceId}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {services.map((s) => (
            <Chip key={s.id} label={s.name} selected={form.serviceId === s.id} onPress={() => set('serviceId')(s.id)} />
          ))}
        </View>
      </Group>
      <Group label="Date" error={errors.date}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {dates.map((d) => {
            const [weekday, ...rest] = formatDate(d).split(', ')
            return <Chip key={d} label={weekday} hint={rest.join(' ')} selected={form.date === d} onPress={() => set('date')(d)} />
          })}
        </ScrollView>
      </Group>
      <Group label="Time window" error={errors.timeSlot}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {timeSlots.map((t) => (
            <Chip key={t.value} label={t.label} hint={t.hint} selected={form.timeSlot === t.value} onPress={() => set('timeSlot')(t.value)} />
          ))}
        </View>
      </Group>
      <Group label="Property type" error={errors.propertyType}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {propertyTypes.map((p) => (
            <Chip key={p.value} label={p.label} selected={form.propertyType === p.value} onPress={() => set('propertyType')(p.value)} />
          ))}
        </View>
      </Group>
      <Field label="Address" value={form.address} onChangeText={set('address')} placeholder="Street, building, apartment, area" error={errors.address} autoComplete="street-address" />
      <Field label="Phone" value={form.phone} onChangeText={set('phone')} placeholder="+254 7XX XXX XXX" keyboardType="phone-pad" error={errors.phone} autoComplete="tel" />
      <Field label="Notes (optional)" value={form.notes} onChangeText={set('notes')} placeholder="Access instructions, pets, priorities…" multiline />
      <Text style={[styles.body, { marginBottom: 14 }]}>Price: <Text style={{ fontWeight: '800' }}>$200</Text> flat rate.</Text>
      <Button label="Request booking" loading={submitting} onPress={submit} />
    </Screen>
  )
}
