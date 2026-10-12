/** Small JSON wrapper around Web Storage used by the demo service implementations. */
export function readJSON<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(storage: Storage, key: string, value: unknown): void {
  storage.setItem(key, JSON.stringify(value))
}

export function createId(prefix: string): string {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '')
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
  return `${prefix}-${random.slice(0, 8).toUpperCase()}`
}
