const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/

export const validators = {
  required: (value: string, label: string) => (value.trim() ? undefined : `${label} is required.`),
  email: (value: string) => {
    if (!value.trim()) return 'Email is required.'
    return EMAIL_RE.test(value.trim()) ? undefined : 'Enter a valid email address, like name@example.com.'
  },
  phone: (value: string) => {
    if (!value.trim()) return 'Phone number is required.'
    const digits = value.replace(/\D/g, '')
    return PHONE_RE.test(value.trim()) && digits.length >= 7 ? undefined : 'Enter a valid phone number.'
  },
  password: (value: string) => {
    if (!value) return 'Password is required.'
    if (value.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Use at least one letter and one number.'
    return undefined
  },
  minLength: (value: string, min: number, label: string) =>
    value.trim().length >= min ? undefined : `${label} must be at least ${min} characters.`,
}

export function passwordStrength(value: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] }
}
