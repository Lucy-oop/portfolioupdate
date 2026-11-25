import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * A small pill that trails the mouse over anything marked `data-cursor`,
 * showing that attribute's text — "View" on project cards, "Read" on case
 * studies. It sits beside the native cursor, which is never hidden.
 *
 * Mouse only, off for reduced motion; purely visual (aria-hidden), since the
 * links underneath already say what they do.
 */
export default function CursorLabel() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const el = ref.current
    if (reduced || !el || !window.matchMedia('(pointer: fine)').matches) return

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let frame = 0
    let current: string | null = null

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const hit = (e.target as Element | null)?.closest?.('[data-cursor]')
      const next = hit?.getAttribute('data-cursor') ?? null
      if (next !== current) {
        if (!current && next) {
          // Appear at the pointer rather than sliding in from the last spot.
          pos.x = target.x
          pos.y = target.y
        }
        current = next
        setLabel(next)
      }
    }
    const tick = () => {
      frame = requestAnimationFrame(tick)
      pos.x += (target.x - pos.x) * 0.22
      pos.y += (target.y - pos.y) * 0.22
      el.style.transform = `translate3d(${pos.x + 18}px, ${pos.y + 18}px, 0)`
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]">
      <span
        className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-canvas shadow-bento transition-[opacity,scale] duration-200"
        style={{ opacity: label ? 1 : 0, scale: label ? '1' : '0.6' }}
      >
        {label}
        <ArrowUpRight size={12} />
      </span>
    </div>
  )
}
