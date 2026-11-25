import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Calls `onFrame(el)` once per animation frame while `ref`'s element is near
 * the viewport — for scroll-scrubbed effects that write styles directly
 * rather than re-rendering. Off for reduced motion (the callback is never
 * called, so the effect's resting state must be the readable one).
 */
export function useScrollFrame<T extends HTMLElement>(ref: RefObject<T | null>, onFrame: (el: T) => void) {
  const reduced = useReducedMotion()
  const cb = useRef(onFrame)
  cb.current = onFrame

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let frame = 0
    let running = false
    const tick = () => {
      frame = requestAnimationFrame(tick)
      cb.current(el)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          frame = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(frame)
        }
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [ref, reduced])
}
