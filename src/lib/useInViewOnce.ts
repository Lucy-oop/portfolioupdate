import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Fires once when the element first enters the viewport.
 *
 * Deliberately fails *visible*: if IntersectionObserver is missing, motion is
 * reduced, or the callback simply never arrives, the element is shown anyway.
 * Reveal animations that start at opacity 0 will otherwise hide content
 * permanently when anything goes wrong, which is a much worse failure than a
 * missed animation.
 */
export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
    )
    observer.observe(el)

    // Safety net — never leave content stuck invisible.
    const timer = window.setTimeout(() => setInView(true), 1500)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [reduced])

  return { ref, inView, reduced }
}
