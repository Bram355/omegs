import { Link, router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { Logo } from '../components/Logo'
import { Button, Field, Notice, Screen, styles } from '../components/ui'
import { useAuth } from '../context/auth'
import { isEmail } from '../lib/validation'
import { colors } from '../theme'

export default function LoginScreen() {
  const { signIn, resetPassword, configured } = useAuth()
  const params = useLocalSearchParams<{ next?: string; service?: string }>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    const next = { email: isEmail(email) ? undefined : 'Enter a valid email address.', password: password ? undefined : 'Enter your password.' }
    setErrors(next)
    if (next.email || next.password) return
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      if (params.next === '/book') router.replace({ pathname: '/book', params: params.service ? { service: params.service } : {} })
      else router.back()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function forgot() {
    if (!isEmail(email)) return setErrors({ email: 'Enter your email above first.' })
    try {
      await resetPassword(email)
      Alert.alert('Check your inbox', 'If an account exists for that email, we sent a reset link.')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <Screen>
      <Logo />
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Welcome back</Text>
      <Text style={[styles.body, { marginTop: 4, marginBottom: 20 }]}>Log in to book and manage your cleanings.</Text>
      {!configured && <Notice>Accounts are not connected yet. Please check back soon.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={errors.email} />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" error={errors.password} />
      <Text onPress={forgot} accessibilityRole="link" style={{ color: colors.brand800, fontWeight: '600', marginBottom: 20 }}>Forgot password?</Text>
      <Button label="Log in" loading={loading} onPress={submit} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <Text style={styles.body}>New to Omegs? </Text>
        <Link href={{ pathname: '/signup', params }} replace style={{ color: colors.brand800, fontWeight: '700', fontSize: 15 }}>Create an account</Link>
      </View>
    </Screen>
  )
}
