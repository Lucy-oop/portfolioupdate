import { useRef } from 'react'
import { useScrollFrame } from '../../lib/useScrollFrame'

/**
 * A paragraph whose words light up one by one as it scrolls through the
 * screen — faint until the reading line (60% down the viewport) passes them.
 * The text is real text throughout; only each word's opacity changes. Reduced
 * motion: fully lit (useScrollFrame never runs, and the resting opacity is 1).
 */
export default function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')

  useScrollFrame(ref, (el) => {
    const vh = window.innerHeight
    const r = el.getBoundingClientRect()
    // 0 as the paragraph's top reaches 85% of the screen, 1 as its bottom reaches 55%.
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)))
    const spans = el.children
    const lit = p * spans.length
    for (let i = 0; i < spans.length; i++) {
      const t = Math.min(1, Math.max(0, lit - i))
      ;(spans[i] as HTMLElement).style.opacity = String(0.22 + 0.78 * t)
    }
  })

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="transition-opacity duration-150">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
