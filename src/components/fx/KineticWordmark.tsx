import { useEffect, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cn } from '../../lib/cn'

/**
 * SCROLL-LINKED FLOATING LETTERS
 * =================================================================
 * An oversized wordmark that fills its container's width exactly. It sits
 * perfectly still — every letter on the baseline, one colour — until the
 * footer actually arrives. Then, scrubbed by scroll:
 *
 *  - per-character drift: each letter floats against the scroll on its own
 *    spring, later letters drifting further, so moving the page sends a
 *    ripple along the word that settles when you stop;
 *  - baseline break: over the last stretch of the page the final letters
 *    lift off the baseline, tilt, and turn lilac — on under-damped springs,
 *    so they overshoot and settle, and drop back if you scroll up.
 *
 * Decorative (aria-hidden): the name is also written out in plain text
 * nearby. Reduced motion: the letters stay at rest.
 */

type KineticWordmarkProps = {
  text: string
  /** How many letters at the end break off the baseline. */
  lifting?: number
  className?: string
}

/** Per breaking letter, from the last one backwards: rise (em) and tilt (deg). */
const POSES = [
  { rise: 0.12, tilt: 7 },
  { rise: 0.06, tilt: -3.5 },
  { rise: 0.03, tilt: 2 },
]

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export default function KineticWordmark({ text, lifting = 2, className }: KineticWordmarkProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const reduced = useReducedMotion()
  const chars = [...text]
  const firstLifting = chars.length - lifting

  // Fit: scale the font so the line spans the container edge to edge.
  useLayoutEffect(() => {
    const box = boxRef.current
    const line = textRef.current
    if (!box || !line) return
    const fit = () => {
      line.style.fontSize = '100px'
      const ratio = box.clientWidth / line.scrollWidth
      line.style.fontSize = `${Math.floor(100 * ratio * 100) / 100}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [text])

  useEffect(() => {
    const box = boxRef.current
    const line = textRef.current
    if (!box || !line || reduced) return
    const footer = box.closest('footer') ?? box

    const n = chars.length
    const springs = chars.map(() => ({ y: 0, vy: 0, r: 0, vr: 0 }))
    let frame = 0
    let last = 0
    let lastScroll = window.scrollY
    let velocity = 0
    let running = false

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 40) / 1000 : 0
      last = now

      // How far into the footer we are: 0 as its top meets the bottom of the
      // screen, 1 at the very end of the page.
      const vh = window.innerHeight
      const remaining = document.documentElement.scrollHeight - (window.scrollY + vh)
      const reach = clamp(1 - remaining / Math.max(1, footer.offsetHeight), 0, 1)

      // Smoothed scroll speed, in px/s.
      const y = window.scrollY
      if (dt) velocity += ((y - lastScroll) / dt - velocity) * 0.18
      lastScroll = y

      const active = reach > 0 ? 1 : 0 // before the footer: perfectly still
      const breakOff = smooth(0.55, 1, reach)
      line.toggleAttribute('data-broken', breakOff > 0.5)

      for (let i = 0; i < n; i++) {
        const s = springs[i]
        // Drift: letters lag against the scroll, more toward the end of the word.
        const drift = -clamp(velocity / 1400, -1, 1) * 0.14 * (0.35 + 0.65 * (i / (n - 1))) * active
        let ty = drift
        let tr = clamp(velocity / 1400, -1, 1) * 2 * (i / (n - 1)) * active

        const k = n - 1 - i // 0 = last letter
        if (k < lifting) {
          const pose = POSES[k] ?? POSES[POSES.length - 1]
          ty += -pose.rise * breakOff
          tr += pose.tilt * breakOff
        }

        // Under-damped on purpose: letters overshoot and wobble a little.
        s.vy += ((ty - s.y) * 140 - s.vy * 9) * dt
        s.vr += ((tr - s.r) * 140 - s.vr * 9) * dt
        s.y += s.vy * dt
        s.r += s.vr * dt
        const el = letterRefs.current[i]
        if (el) el.style.transform = `translateY(${s.y.toFixed(4)}em) rotate(${s.r.toFixed(3)}deg)`
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          last = 0
          lastScroll = window.scrollY
          velocity = 0
          frame = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(frame)
        }
      },
      { rootMargin: '100px 0px' }
    )
    io.observe(box)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reduced, lifting, chars.length])

  return (
    <div ref={boxRef} aria-hidden className={cn('w-full select-none', className)}>
      <p
        ref={textRef}
        // inline-block, so its width is the text's, which is what fit() measures
        className="kinetic-word inline-block whitespace-nowrap font-display text-[14vw] font-bold leading-[0.82] tracking-[-0.045em]"
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el
            }}
            className={cn(
              'inline-block will-change-transform',
              // The breaking letters pivot on their bottom-left corner, as if pried up.
              i >= firstLifting ? 'kinetic-break origin-bottom-left' : 'origin-bottom'
            )}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </p>
    </div>
  )
}
