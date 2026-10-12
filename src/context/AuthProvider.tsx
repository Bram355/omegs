import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services/auth'
import type { SignInInput, SignUpInput } from '../types'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())

  const signIn = useCallback(async (input: SignInInput) => {
    const next = await authService.signIn(input)
    setUser(next)
    return next
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const next = await authService.signUp(input)
    setUser(next)
    return next
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: Boolean(user), signIn, signUp, signOut }),
    [user, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
