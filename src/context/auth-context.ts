import { createContext } from 'react'
import type { AuthUser, SignInInput, SignUpInput } from '../types'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  signIn(input: SignInInput): Promise<AuthUser>
  signUp(input: SignUpInput): Promise<AuthUser>
  signOut(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
