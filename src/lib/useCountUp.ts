import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** Counts 0 → `to` over `ms` once `start` is true (eased out). Instant for reduced motion. */
export function useCountUp(to: number, start: boolean, ms = 1200) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? to : 0)

  useEffect(() => {
    if (!start) return
    if (reduced) {
      setValue(to)
      return
    }
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms)
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, start, ms, reduced])

  return value
}
