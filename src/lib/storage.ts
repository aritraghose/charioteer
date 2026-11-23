/**
 * Everything Charioteer remembers lives in this browser's localStorage.
 * Nothing is sent anywhere. Reads and writes never throw: private windows and
 * blocked storage just behave as if nothing was saved.
 */

const PREFIX = 'charioteer-'

export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeStored(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage is full or blocked. The app keeps working without saving.
  }
}
