import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '../../lib/useReducedMotion'

/** The live Lenis instance, if smooth scrolling is on. */
let current: Lenis | null = null

/**
 * Freeze page scrolling (the intro preloader uses this). Stops Lenis when it
 * is running and hides overflow either way, so wheel, touch and keys are all
 * held.
 */
export function setScrollLocked(locked: boolean) {
  if (locked) current?.stop()
  else current?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/**
 * Lenis inertial scrolling. Skipped entirely when the visitor prefers reduced
 * motion — a shortened duration still hijacks the wheel, which is the part
 * that actually causes trouble.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })
    current = lenis
    // A lock taken before Lenis existed (the preloader mounts first) still holds.
    if (document.documentElement.style.overflow === 'hidden') lenis.stop()

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      if (current === lenis) current = null
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
