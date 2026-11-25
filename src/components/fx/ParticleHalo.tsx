import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cn } from '../../lib/cn'

/**
 * PARTICLE HALO
 * =================================================================
 * A field of tiny dashes in lilac, peach and mint. Around one moving centre
 * they wake up into a ring: each dash turns to point away from the centre,
 * lengthens, brightens and drifts outward, while the middle stays open, so
 * whatever sits under the pointer is never covered.
 *
 *  - The centre follows the pointer on a spring, so it trails with a soft lag.
 *  - The ring breathes: its radius swells and settles on a slow sine.
 *  - Without a mouse (touch, or the pointer outside the section), the centre
 *    rests on `anchorRef` — the portrait in the hero — and just breathes.
 *  - `interactive={false}` never follows the pointer (ambient use).
 *
 * Canvas 2D, only the dashes inside the ring are drawn; the loop runs only
 * while the canvas is on screen. Reduced motion
 * draws one still frame around the anchor.
 */

type Dash = { x: number; y: number; color: number; phase: number }

type ParticleHaloProps = {
  className?: string
  anchorRef?: RefObject<HTMLElement | null>
  interactive?: boolean
  /** Ring radius as a fraction of the canvas's shorter side. */
  size?: number
}

const COLOR_VARS = ['--color-lilac', '--color-peach', '--color-mint']
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function ParticleHalo({ className, anchorRef, interactive = true, size = 0.21 }: ParticleHaloProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const followPointer = interactive && window.matchMedia('(pointer: fine)').matches
    let w = 0
    let h = 0
    let dashes: Dash[] = []
    let colors = ['#a78bfa', '#fdba8c', '#7fd1b9']

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement)
      colors = COLOR_VARS.map((v, i) => cs.getPropertyValue(v).trim() || colors[i])
    }

    // A jittered grid of dashes over the whole canvas; weighted toward lilac.
    const layout = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const gap = w < 640 ? 22 : 24
      dashes = []
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const r = Math.random()
          dashes.push({
            x: x + (Math.random() - 0.5) * gap * 0.7,
            y: y + (Math.random() - 0.5) * gap * 0.7,
            color: r < 0.5 ? 0 : r < 0.78 ? 1 : 2,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const anchorPoint = () => {
      const a = anchorRef?.current
      if (!a) return { x: w * 0.72, y: h * 0.45 }
      const ar = a.getBoundingClientRect()
      const cr = canvas.getBoundingClientRect()
      return { x: ar.left + ar.width / 2 - cr.left, y: ar.top + ar.height / 2 - cr.top }
    }

    // Spring-driven centre.
    const c = { x: 0, y: 0, vx: 0, vy: 0 }
    let pointer: { x: number; y: number } | null = null

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      const base = Math.min(w, h) * size
      const breathe = 1 + 0.08 * Math.sin(time * 1.1) + 0.03 * Math.sin(time * 2.3)
      const R = base * breathe // brightest radius
      const hole = R * 0.55 // the open centre
      const outer = R * 1.85 // fades out by here

      ctx.lineCap = 'round'
      for (const d of dashes) {
        const dx = d.x - c.x
        const dy = d.y - c.y
        const dist = Math.hypot(dx, dy)
        if (dist < hole * 0.7 || dist > outer) continue
        const f = smooth(hole, R, dist) * (1 - smooth(R, outer, dist))
        if (f < 0.03) continue

        const ux = dx / dist
        const uy = dy / dist
        // Pushed outward in the ring, with a slight swirl that wobbles.
        const push = f * 10 + Math.sin(time * 1.6 + d.phase) * 1.5
        const swirl = Math.sin(time * 0.9 + d.phase) * 2 * f
        const px = d.x + ux * push - uy * swirl
        const py = d.y + uy * push + ux * swirl
        const len = 2.5 + f * 9

        ctx.globalAlpha = f * 0.7
        ctx.strokeStyle = colors[d.color]
        ctx.lineWidth = 1.1 + f * 0.6
        ctx.beginPath()
        ctx.moveTo(px - (ux * len) / 2, py - (uy * len) / 2)
        ctx.lineTo(px + (ux * len) / 2, py + (uy * len) / 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    readColors()
    layout()
    const start = anchorPoint()
    c.x = start.x
    c.y = start.y

    const ro = new ResizeObserver(() => {
      layout()
      if (reduced) draw(0)
    })
    ro.observe(canvas)
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reduced) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributeFilter: ['class'] })

    if (reduced) {
      draw(0)
      return () => {
        ro.disconnect()
        themeObserver.disconnect()
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!followPointer || e.pointerType !== 'mouse') return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      pointer = x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null
    }
    const onLeave = () => (pointer = null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    let frame = 0
    let last = 0
    let running = false
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 50) / 1000 : 0
      last = now
      const target = pointer ?? anchorPoint()
      // Spring: stiff enough to follow, damped enough to never overshoot far.
      c.vx += ((target.x - c.x) * 70 - c.vx * 13) * dt
      c.vy += ((target.y - c.y) * 70 - c.vy * 13) * dt
      c.x += c.vx * dt
      c.y += c.vy * dt
      draw(now / 1000)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    io.observe(canvas)

    return () => {
      io.disconnect()
      ro.disconnect()
      themeObserver.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, interactive, size, anchorRef])

  return <canvas ref={canvasRef} aria-hidden className={cn('pointer-events-none size-full', className)} />
}
