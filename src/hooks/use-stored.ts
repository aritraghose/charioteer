import { useCallback, useEffect, useState } from 'react'
import { readStored, writeStored } from '@/lib/storage'

/**
 * State that is kept in this browser's storage. It starts as `fallback` on the
 * server and on first paint, then loads the saved value; `loaded` says when
 * that has happened.
 */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setValue(readStored(key, fallback))
    setLoaded(true)
    // The fallback is only the starting value, so it is not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved =
          typeof next === 'function'
            ? (next as (current: T) => T)(current)
            : next
        writeStored(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, update, loaded] as const
}
