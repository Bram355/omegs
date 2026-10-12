import type { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

export interface AppUser {
  id: string
  email: string
  fullName: string
  phone: string
}

interface AuthValue {
  configured: boolean
  loading: boolean
  user: AppUser | null
  signIn(email: string, password: string): Promise<void>
  /** Resolves to true when the user is signed in immediately, false when email confirmation is required. */
  signUp(input: { fullName: string; email: string; phone: string; password: string }): Promise<boolean>
  signOut(): Promise<void>
  resetPassword(email: string): Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

const toUser = (session: Session | null): AppUser | null =>
  session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? '',
        fullName: session.user.user_metadata?.full_name ?? '',
        phone: session.user.user_metadata?.phone ?? '',
      }
    : null

function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.'
  if (/email not confirmed/i.test(message)) return 'Please confirm your email first — check your inbox.'
  if (/already registered|already exists/i.test(message)) return 'An account with this email already exists. Try logging in.'
  return message
}

function requireClient() {
  if (!supabase) throw new Error('The Omegs service is not connected yet. Please try again later.')
  return supabase
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session))
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(toUser(session)))
    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      configured: Boolean(supabase),
      loading,
      user,
      async signIn(email, password) {
        const { error } = await requireClient().auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
        if (error) throw new Error(friendly(error.message))
      },
      async signUp({ fullName, email, phone, password }) {
        const { data, error } = await requireClient().auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { full_name: fullName.trim(), phone: phone.trim() } },
        })
        if (error) throw new Error(friendly(error.message))
        return Boolean(data.session)
      },
      async signOut() {
        await requireClient().auth.signOut()
      },
      async resetPassword(email) {
        const { error } = await requireClient().auth.resetPasswordForEmail(email.trim().toLowerCase())
        if (error) throw new Error(friendly(error.message))
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
