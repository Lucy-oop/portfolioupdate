import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Section from '../ui/Section'
import Placeholder from '../ui/Placeholder'
import { caseStudies, type CaseStudy } from '../../data/caseStudies'
import { useScrollFrame } from '../../lib/useScrollFrame'
import { useInViewOnce } from '../../lib/useInViewOnce'
import { useReducedMotion } from '../../lib/useReducedMotion'

const process = [
  { step: '01', title: 'Understand', body: 'Who is stuck, on what, and how they work around it now.' },
  { step: '02', title: 'Research', body: 'Competitor teardowns and a handful of real conversations.' },
  { step: '03', title: 'Wireframe', body: 'Low-fidelity, so throwing one away costs nothing.' },
  { step: '04', title: 'Systemise', body: 'Tokens, type scale and component states before any screen is final.' },
  { step: '05', title: 'Build & test', body: 'Ship it in React, put it in front of people, then revise.' },
]

export default function DesignWork() {
  return (
    <Section
      id="design"
      index="02"
      eyebrow="UI/UX Design"
      title="The thinking behind the screens."
      lede={`${caseStudies.length} design projects — the problem, the research, the wireframes, the system, and what I got wrong.`}
    >
      <ProcessStrip />
      <CaseIndex />
    </Section>
  )
}

/**
 * The process as a compact strip of numbered chips on a hairline. The chips
 * light up one after another as the strip passes the middle of the screen.
 * Reduced motion: all lit.
 */
function ProcessStrip() {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()

  useScrollFrame(ref, (el) => {
    const vh = window.innerHeight
    const r = el.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.35)))
    el.querySelectorAll<HTMLElement>('[data-chip]').forEach((chip, i) => {
      chip.toggleAttribute('data-lit', p >= (i + 0.5) / process.length)
    })
  })

  return (
    <ol ref={ref} className="relative mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5 md:gap-4">
      <span aria-hidden className="absolute inset-x-0 top-[17px] hidden h-px bg-line md:block" />
      {process.map((p) => (
        <li key={p.step} className="relative">
          <span
            data-chip
            data-lit={reduced || undefined}
            className="process-chip relative inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-[13px] font-semibold"
          >
            <span className="font-mono text-[10.5px] font-normal text-muted">{p.step}</span>
            {p.title}
          </span>
          <p className="mt-3 max-w-[22ch] text-[13px] leading-relaxed text-muted">{p.body}</p>
        </li>
      ))}
    </ol>
  )
}

/* =================================================================
 * HOVER-REVEAL INDEX
 * -----------------------------------------------------------------
 * The case studies as a large editorial list. With a mouse, hovering a
 * row draws its underline, nudges the title and dims the rest, while one
 * floating preview follows the cursor on a spring — tilting with its
 * speed and wiping between covers as you move from row to row. Keyboard
 * focus shows the same preview anchored beside the focused row.
 *
 * Touch screens have no hover, so each row shows its cover inline instead
 * (pointer-coarse). Reduced motion: the preview just appears, no follow,
 * tilt or wipe.
 * ================================================================= */

function CaseIndex() {
  const reduced = useReducedMotion()
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [fine, setFine] = useState(false)

  // Motion state lives in refs: the loop writes styles directly.
  const target = useRef({ x: 0, y: 0 })
  const anchored = useRef(false)

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFine(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])

  // The follow loop runs only while a row is active.
  useEffect(() => {
    const el = previewRef.current
    if (active === null || !el) return
    const pos = { ...target.current }
    let vx = 0
    let vy = 0
    let tilt = 0
    let last = 0
    let frame = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 40) / 1000 : 0
      last = now
      const t = target.current
      if (reduced || anchored.current) {
        pos.x = t.x
        pos.y = t.y
        vx = 0
      } else {
        vx += ((t.x - pos.x) * 120 - vx * 16) * dt
        vy += ((t.y - pos.y) * 120 - vy * 16) * dt
        pos.x += vx * dt
        pos.y += vy * dt
      }
      tilt += ((reduced ? 0 : Math.max(-8, Math.min(8, vx / 90))) - tilt) * 0.15
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reduced])

  const onPointer = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    anchored.current = false
    // Sit up and to the right of the cursor, so the row text stays readable.
    target.current = { x: e.clientX + 220, y: e.clientY - 40 }
  }

  /** Keyboard focus: anchor the preview beside the focused row. */
  const onRowFocus = (i: number, row: HTMLElement) => {
    if (!fine) return
    const r = row.getBoundingClientRect()
    anchored.current = true
    target.current = { x: Math.min(window.innerWidth - 240, r.right - 260), y: r.top + r.height / 2 }
    setActive(i)
  }

  return (
    <div onPointerMove={onPointer} onPointerLeave={() => setActive(null)}>
      <ol className="index-list">
        {caseStudies.map((cs, i) => (
          <IndexRow
            key={cs.slug}
            study={cs}
            index={i}
            onEnter={(e) => {
              if (e.pointerType !== 'mouse') return
              onPointer(e)
              setActive(i)
            }}
            onFocus={(row) => onRowFocus(i, row)}
            onBlur={() => setActive(null)}
          />
        ))}
      </ol>

      {fine && (
        <div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[60] w-[min(400px,32vw)]"
        >
          <div
            className="overflow-hidden rounded-tile border border-line bg-card shadow-bento-lift transition-[opacity,scale] duration-300 ease-out-soft"
            style={{ opacity: active === null ? 0 : 1, scale: active === null ? '0.85' : '1' }}
          >
            <div className="relative aspect-16/10 bg-canvas-sunk">
              {caseStudies.map((cs, i) =>
                cs.cover ? (
                  <img
                    key={cs.slug}
                    src={cs.cover}
                    alt=""
                    loading="lazy"
                    data-active={active === i || undefined}
                    className="cover-layer absolute inset-0 size-full object-cover object-top"
                  />
                ) : null
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="truncate text-[12.5px] text-muted">
                {active !== null ? caseStudies[active].subtitle : ''}
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-lilac">
                {active !== null ? caseStudies[active].tools.slice(0, 2).join(' · ') : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function IndexRow({
  study: cs,
  index,
  onEnter,
  onFocus,
  onBlur,
}: {
  study: CaseStudy
  index: number
  onEnter: (e: React.PointerEvent) => void
  onFocus: (row: HTMLElement) => void
  onBlur: () => void
}) {
  // Each title rises through its own mask as the row scrolls into view.
  const { ref, inView, reduced } = useInViewOnce<HTMLLIElement>()
  const shown = inView || reduced

  return (
    <li ref={ref} className="index-row border-t border-line last:border-b">
      <Link
        to={`/design/${cs.slug}`}
        onPointerEnter={onEnter}
        onFocus={(e) => onFocus(e.currentTarget)}
        onBlur={onBlur}
        className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 py-6 outline-none md:grid-cols-[3rem_1fr_auto] md:py-8"
      >
        {/* Touch screens: the cover sits in the row, since there's no hover to reveal it. */}
        <div className="col-span-full mb-5 hidden overflow-hidden rounded-tile border border-line pointer-coarse:block">
          <Placeholder src={cs.cover} alt="" ratio="16 / 10" className="rounded-none border-0" />
        </div>

        <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, '0')}</span>

        <span className="block overflow-hidden pb-[0.18em]">
          <span
            className="block transition-transform duration-900 ease-out-soft"
            style={{ transform: shown ? 'none' : 'translateY(105%)', transitionDelay: `${Math.min(index, 6) * 0.06}s` }}
          >
            <span className="index-title font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1] tracking-[-0.035em]">
              {cs.title}
            </span>
          </span>
        </span>

        <span className="col-start-2 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-wider text-muted md:col-start-3 md:mt-0 md:justify-end">
          {cs.discipline}
          <span aria-hidden>·</span>
          {cs.year}
          {cs.draft && <span className="rounded-full border border-dashed border-line px-2 py-0.5 normal-case">Write-up in progress</span>}
          <span className="index-read hidden items-center gap-0.5 text-lilac md:inline-flex">
            Read <ArrowUpRight size={12} aria-hidden />
          </span>
        </span>
      </Link>
    </li>
  )
}
