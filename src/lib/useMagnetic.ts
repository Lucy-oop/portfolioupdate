import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Leans an element toward the cursor while the pointer is near it, and
 * springs it back on leave. Mouse only, and off for reduced motion. The pull
 * is a transform on the element itself, so layout never moves.
 *
 * `strength` is how far it follows: 0.3 → 30% of the pointer's offset.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transition = 'transform 0.15s ease-out'
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const leave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1.6, 0.36, 1)'
      el.style.transform = ''
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [reduced, strength])

  return ref
}
