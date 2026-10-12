import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** Null until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured; services fall back to demo mode. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

/** Storage key supabase-js uses for the persisted session (lets us read it synchronously on boot). */
export const supabaseSessionKey = url ? `sb-${new URL(url).hostname.split('.')[0]}-auth-token` : ''
