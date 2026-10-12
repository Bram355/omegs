import { Link, router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button, Field, Notice, Screen, styles } from '../components/ui'
import { useAuth } from '../context/auth'
import { isEmail, isPhone } from '../lib/validation'
import { colors } from '../theme'

type Errors = Partial<Record<'fullName' | 'email' | 'phone' | 'password' | 'confirm' | 'terms', string>>

export default function SignupScreen() {
  const { signUp, configured } = useAuth()
  const params = useLocalSearchParams<{ next?: string; service?: string }>()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function submit() {
    const next: Errors = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name.'
    if (!isEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!isPhone(form.phone)) next.phone = 'Enter a valid phone number.'
    if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    if (form.confirm !== form.password) next.confirm = 'Passwords don’t match.'
    if (!terms) next.terms = 'Please accept the terms to continue.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setError(null)
    try {
      const signedIn = await signUp(form)
      if (!signedIn) {
        setNotice('Account created! Check your inbox to confirm your email, then log in.')
        return
      }
      if (params.next === '/book') router.replace({ pathname: '/book', params: params.service ? { service: params.service } : {} })
      else router.back()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Text style={styles.sectionTitle}>Create your account</Text>
      <Text style={[styles.body, { marginTop: 4, marginBottom: 20 }]}>Book in minutes and track every cleaning.</Text>
      {!configured && <Notice>Accounts are not connected yet. Please check back soon.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}
      <Field label="Full name" value={form.fullName} onChangeText={set('fullName')} autoComplete="name" error={errors.fullName} />
      <Field label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={errors.email} />
      <Field label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" autoComplete="tel" placeholder="+254 7XX XXX XXX" error={errors.phone} />
      <Field label="Password" value={form.password} onChangeText={set('password')} secureTextEntry autoComplete="new-password" error={errors.password} />
      <Field label="Confirm password" value={form.confirm} onChangeText={set('confirm')} secureTextEntry autoComplete="new-password" error={errors.confirm} />
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: terms }} onPress={() => setTerms((t) => !t)} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 6 }}>
        <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: terms ? colors.brand900 : colors.border, backgroundColor: terms ? colors.brand900 : colors.white, alignItems: 'center', justifyContent: 'center' }}>
          {terms && <Text style={{ color: colors.white, fontWeight: '900', fontSize: 13 }}>✓</Text>}
        </View>
        <Text style={[styles.body, { flex: 1 }]}>I agree to the Omegs Terms and Privacy Policy.</Text>
      </Pressable>
      {errors.terms ? <Text style={styles.error}>{errors.terms}</Text> : null}
      <Button label="Create account" loading={loading} onPress={submit} style={{ marginTop: 18 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <Text style={styles.body}>Already have an account? </Text>
        <Link href={{ pathname: '/login', params }} replace style={{ color: colors.brand800, fontWeight: '700', fontSize: 15 }}>Log in</Link>
      </View>
    </Screen>
  )
}
