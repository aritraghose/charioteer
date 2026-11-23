/**
 * A soft bell made in the browser, so the app ships no audio files.
 * Browsers only allow sound after a tap, so `unlockBell` is called from the
 * Begin button.
 */

let context: AudioContext | null = null

export function unlockBell() {
  if (typeof window === 'undefined') return
  try {
    context ??= new AudioContext()
    if (context.state === 'suspended') void context.resume()
  } catch {
    // No audio on this device. Sessions still work without the bell.
    context = null
  }
}

/** One struck-bowl tone: a fundamental with two quieter overtones, fading out. */
export function ringBell() {
  if (!context || context.state !== 'running') return
  const now = context.currentTime
  const partials = [
    { frequency: 396, gain: 0.22, decay: 4.5 },
    { frequency: 792, gain: 0.08, decay: 3 },
    { frequency: 1188, gain: 0.03, decay: 1.8 },
  ]
  for (const partial of partials) {
    const oscillator = context.createOscillator()
    const volume = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = partial.frequency
    volume.gain.setValueAtTime(0.0001, now)
    volume.gain.exponentialRampToValueAtTime(partial.gain, now + 0.02)
    volume.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay)
    oscillator.connect(volume).connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + partial.decay + 0.1)
  }
}
