import { wait } from '../lib/date'
import { supabase, supabaseSessionKey } from '../lib/supabase'
import type { AuthUser, SignInInput, SignUpInput } from '../types'
import { createId, readJSON, writeJSON } from './storage'

/**
 * Authentication contract used by the UI. Swap `demoAuthService` for an implementation
 * backed by Firebase Auth, Supabase Auth, or a custom API without changing any components.
 */
export interface AuthService {
  getCurrentUser(): AuthUser | null
  signIn(input: SignInInput): Promise<AuthUser>
  signUp(input: SignUpInput): Promise<AuthUser>
  signOut(): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  /** Re-validates the stored session with the provider (optional). */
  refresh?(): Promise<AuthUser | null>
}

export class AuthError extends Error {
  field?: 'email' | 'password'
  constructor(message: string, field?: 'email' | 'password') {
    super(message)
    this.name = 'AuthError'
    this.field = field
  }
}

/* ------------------------------------------------------------------------------------------
 * DEMO IMPLEMENTATION — NOT SECURE.
 * Accounts live only in this browser's localStorage. Passwords are hashed client-side purely
 * to avoid storing them in plain text; this is not a substitute for a real auth provider.
 * ---------------------------------------------------------------------------------------- */

const USERS_KEY = 'omegs.demo.users'
const SESSION_KEY = 'omegs.demo.session'

interface StoredUser extends AuthUser {
  passwordHash: string
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`omegs-demo:${password}`)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for non-secure contexts (e.g. http on a LAN IP). Demo only.
  let h = 0
  for (const byte of data) h = (Math.imul(31, h) + byte) | 0
  return `fallback-${h >>> 0}`
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()
const toPublicUser = ({ passwordHash: _passwordHash, ...user }: StoredUser): AuthUser => user

function getUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(localStorage, USERS_KEY, [])
}

function persistSession(user: AuthUser, remember: boolean) {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  writeJSON(remember ? localStorage : sessionStorage, SESSION_KEY, user)
}

export const demoAuthService: AuthService = {
  getCurrentUser() {
    return (
      readJSON<AuthUser | null>(sessionStorage, SESSION_KEY, null) ??
      readJSON<AuthUser | null>(localStorage, SESSION_KEY, null)
    )
  },

  async signIn({ email, password, remember }) {
    await wait(700)
    const user = getUsers().find((u) => u.email === normalizeEmail(email))
    if (!user) {
      throw new AuthError('No demo account exists for this email on this device. Create one to continue.', 'email')
    }
    if (user.passwordHash !== (await hashPassword(password))) {
      throw new AuthError('That password is incorrect. Please try again.', 'password')
    }
    const publicUser = toPublicUser(user)
    persistSession(publicUser, remember)
    return publicUser
  },

  async signUp({ fullName, email, phone, password }) {
    await wait(900)
    const users = getUsers()
    const normalized = normalizeEmail(email)
    if (users.some((u) => u.email === normalized)) {
      throw new AuthError('A demo account with this email already exists. Try logging in instead.', 'email')
    }
    const user: StoredUser = {
      id: createId('USR'),
      fullName: fullName.trim(),
      email: normalized,
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(password),
    }
    writeJSON(localStorage, USERS_KEY, [...users, user])
    const publicUser = toPublicUser(user)
    persistSession(publicUser, true)
    return publicUser
  },

  async signOut() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  },

  async requestPasswordReset() {
    // A real provider would send a reset email here.
    await wait(800)
  },
}

/* ------------------------------------------------------------------------------------------
 * SUPABASE IMPLEMENTATION — used automatically when Supabase env vars are configured.
 * ---------------------------------------------------------------------------------------- */

interface SupabaseUserLike {
  id: string
  email?: string
  created_at: string
  user_metadata?: { full_name?: string; phone?: string }
}

const fromSupabaseUser = (u: SupabaseUserLike): AuthUser => ({
  id: u.id,
  email: u.email ?? '',
  fullName: u.user_metadata?.full_name ?? '',
  phone: u.user_metadata?.phone ?? '',
  createdAt: u.created_at,
})

function mapAuthError(message: string): AuthError {
  if (/invalid login credentials/i.test(message)) return new AuthError('Incorrect email or password. Please try again.', 'password')
  if (/email not confirmed/i.test(message)) return new AuthError('Please confirm your email first — check your inbox for the link.', 'email')
  if (/already registered|already exists/i.test(message)) return new AuthError('An account with this email already exists. Try logging in instead.', 'email')
  return new AuthError(message)
}

function createSupabaseAuthService(client: NonNullable<typeof supabase>): AuthService {
  return {
    getCurrentUser() {
      const stored = readJSON<{ user?: SupabaseUserLike } | null>(localStorage, supabaseSessionKey, null)
      return stored?.user ? fromSupabaseUser(stored.user) : null
    },
    async refresh() {
      const { data } = await client.auth.getUser()
      return data.user ? fromSupabaseUser(data.user) : null
    },
    async signIn({ email, password }) {
      const { data, error } = await client.auth.signInWithPassword({ email: normalizeEmail(email), password })
      if (error || !data.user) throw mapAuthError(error?.message ?? 'Could not log in.')
      return fromSupabaseUser(data.user)
    },
    async signUp({ fullName, email, phone, password }) {
      const { data, error } = await client.auth.signUp({
        email: normalizeEmail(email),
        password,
        options: { data: { full_name: fullName.trim(), phone: phone.trim() }, emailRedirectTo: `${window.location.origin}/login` },
      })
      if (error || !data.user) throw mapAuthError(error?.message ?? 'Could not create your account.')
      if (!data.session) {
        throw new AuthError('Account created. Check your inbox to confirm your email, then log in.')
      }
      return fromSupabaseUser(data.user)
    },
    async signOut() {
      await client.auth.signOut()
    },
    async requestPasswordReset(email) {
      const { error } = await client.auth.resetPasswordForEmail(normalizeEmail(email), {
        redirectTo: `${window.location.origin}/login`,
      })
      if (error) throw new AuthError(error.message, 'email')
    },
  }
}

export const authService: AuthService = supabase ? createSupabaseAuthService(supabase) : demoAuthService
