import { useEffect, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cn } from '../../lib/cn'

/**
 * An oversized wordmark that fills its container's width exactly, whose last
 * couple of letters lift off the baseline and tilt as it scrolls into view —
 * scrubbed by scroll, and carried by springs, so they overshoot a little,
 * wobble and settle, and drop back down if you scroll away again.
 *
 * Decorative (aria-hidden): the name is also written out in plain text
 * nearby. Reduced motion shows the letters at rest, no lift.
 */

type KineticWordmarkProps = {
  text: string
  /** How many letters at the end take off. */
  lifting?: number
  className?: string
}

/** Per lifting letter, from the last one backwards: rise (em) and tilt (deg). */
const POSES = [
  { rise: 0.12, tilt: 7 },
  { rise: 0.06, tilt: -3.5 },
  { rise: 0.03, tilt: 2 },
]

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
    if (!box || reduced) return

    const springs = Array.from({ length: lifting }, () => ({ y: 0, vy: 0, r: 0, vr: 0 }))
    let frame = 0
    let last = 0
    let running = false

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 40) / 1000 : 0
      last = now

      // Scrubbed by how close the page is to its very end — the wordmark is
      // the last thing on the page, so it can never scroll far up the screen.
      // 0 while more than ~half a screen remains below, 1 at the bottom.
      const vh = window.innerHeight
      const remaining = document.documentElement.scrollHeight - (window.scrollY + vh)
      const p = Math.min(1, Math.max(0, 1 - remaining / (vh * 0.45)))
      const eased = p * p * (3 - 2 * p)

      springs.forEach((s, k) => {
        // k = 0 is the last letter
        const pose = POSES[k] ?? POSES[POSES.length - 1]
        const ty = -pose.rise * eased
        const tr = pose.tilt * eased
        // Under-damped on purpose: the letters overshoot and wobble a little.
        s.vy += ((ty - s.y) * 140 - s.vy * 9) * dt
        s.vr += ((tr - s.r) * 140 - s.vr * 9) * dt
        s.y += s.vy * dt
        s.r += s.vr * dt
        const el = letterRefs.current[chars.length - 1 - k]
        if (el) el.style.transform = `translateY(${s.y}em) rotate(${s.r}deg)`
      })
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          last = 0
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
        className="inline-block whitespace-nowrap font-display text-[14vw] font-bold leading-[0.82] tracking-[-0.045em]"
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el
            }}
            className={cn(
              'inline-block',
              // Rotate around the bottom-left corner, as if pried up off the baseline.
              i >= firstLifting && 'origin-bottom-left text-lilac will-change-transform'
            )}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </p>
    </div>
  )
}
