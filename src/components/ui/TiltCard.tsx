import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cn } from '../../lib/cn'

/**
 * Leans its card a few degrees toward the mouse. A wrapper, so the card's own
 * hover lift (.tile-hover) keeps working underneath. Mouse only; off for
 * reduced motion.
 */
export default function TiltCard({ children, className, max = 4 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduced || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transition = 'transform 0.12s linear'
    el.style.transform = `perspective(900px) rotateX(${-py * max * 2}deg) rotateY(${px * max * 2}deg)`
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = ''
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn('h-full', className)}>
      {children}
    </div>
  )
}
