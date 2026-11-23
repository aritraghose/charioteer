/**
 * In development only, adding `?speed=20` to the address makes timers run
 * faster so a long session can be tested in seconds. Always 1 in production.
 */
export function devSpeed() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return 1
  const value = Number(new URLSearchParams(window.location.search).get('speed'))
  return value > 0 ? value : 1
}
