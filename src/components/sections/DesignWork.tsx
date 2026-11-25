import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Section from '../ui/Section'
import Tag from '../ui/Tag'
import Placeholder from '../ui/Placeholder'
import { caseStudies, type CaseStudy } from '../../data/caseStudies'
import { useScrollFrame } from '../../lib/useScrollFrame'

const process = [
  { step: '01', title: 'Understand', body: 'Who is stuck, on what, and how they work around it now.' },
  { step: '02', title: 'Research', body: 'Competitor teardowns and a handful of real conversations.' },
  { step: '03', title: 'Wireframe', body: 'Low-fidelity, so throwing one away costs nothing.' },
  { step: '04', title: 'Systemise', body: 'Tokens, type scale and component states before any screen is final.' },
  { step: '05', title: 'Build & test', body: 'Ship it in React, put it in front of people, then revise.' },
]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function DesignWork() {
  return (
    <Section
      id="design"
      index="02"
      eyebrow="UI/UX Design"
      title="The thinking behind the screens."
      lede={`${caseStudies.length} design projects — the problem, the research, the wireframes, the system, and what I got wrong.`}
    >
      <ProcessLine />
      <CaseStack />
    </Section>
  )
}

/**
 * The five steps on one line that fills as you scroll past it, each stop
 * lighting as the fill reaches it. Horizontal from md, vertical on phones.
 * Reduced motion: shown complete.
 */
function ProcessLine() {
  const ref = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useScrollFrame(ref, (el) => {
    const vh = window.innerHeight
    const r = el.getBoundingClientRect()
    // Starts as the strip comes up past 85% of the screen, full by 40%.
    const p = clamp01((vh * 0.85 - r.top) / (vh * 0.45))
    const fill = fillRef.current
    if (fill) fill.style.setProperty('--p', String(p))
    el.querySelectorAll<HTMLElement>('[data-stop]').forEach((stop, i) => {
      stop.toggleAttribute('data-lit', p >= i / (process.length - 1) - 0.02)
    })
  })

  const line =
    'absolute left-[15px] top-4 bottom-4 w-px md:left-4 md:right-4 md:bottom-auto md:top-[15px] md:h-px md:w-auto'

  return (
    <ol ref={ref} className="relative mb-14 grid grid-cols-1 gap-7 md:grid-cols-5 md:gap-5">
      <span aria-hidden className={`${line} bg-line`} />
      <span
        ref={fillRef}
        aria-hidden
        className={`${line} process-fill bg-linear-to-b from-lilac via-peach to-mint md:bg-linear-to-r`}
      />
      {process.map((p) => (
        <li key={p.step} className="relative flex gap-4 md:flex-col md:gap-5">
          <span
            data-stop
            className="process-stop relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full border border-line bg-canvas font-mono text-[10.5px] text-muted"
          >
            {p.step}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold">{p.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * Case studies as a pinned stack: each card sticks a little below the last,
 * and eases back (smaller, dimmer) as the next one slides over it.
 *
 * From md up only. On phones a card is taller than the screen, so pinning it
 * would let the next one cover its summary and link before you reach them;
 * there they simply scroll (and never scale, since none overlap).
 */
function CaseStack() {
  const ref = useRef<HTMLOListElement>(null)

  useScrollFrame(ref, (el) => {
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-stack-card]'))
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      const inner = card.firstElementChild as HTMLElement | null
      if (!inner) return
      let t = 0
      if (next) {
        const a = card.getBoundingClientRect()
        const b = next.getBoundingClientRect()
        t = clamp01(1 - (b.top - a.top) / a.height)
      }
      inner.style.transform = t ? `scale(${1 - t * 0.06})` : ''
      inner.style.setProperty('--dim', String(t * 0.45))
    })
  })

  return (
    <ol ref={ref} className="flex flex-col gap-6">
      {caseStudies.map((cs, i) => (
        <li
          key={cs.slug}
          data-stack-card
          className="md:sticky"
          style={{ top: `calc(6rem + ${i * 0.9}rem)` }}
        >
          <div className="stack-card origin-top">
            <CaseCard study={cs} />
          </div>
        </li>
      ))}
    </ol>
  )
}

function CaseCard({ study: cs }: { study: CaseStudy }) {
  return (
    <Link
      to={`/design/${cs.slug}`}
      data-cursor="Read"
      className="tile group grid grid-cols-1 overflow-hidden md:grid-cols-5"
    >
      <div className="overflow-hidden border-b border-line md:col-span-3 md:border-b-0 md:border-r">
        <Placeholder
          src={cs.cover}
          alt={`${cs.title} case study cover`}
          ratio="16 / 10"
          className="rounded-none border-0 transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col gap-3 p-6 md:col-span-2 md:p-8">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted">{cs.discipline}</span>
          <span className="font-mono text-[10.5px] text-muted">{cs.year}</span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold leading-tight tracking-tight">{cs.title}</h3>
          <p className="mt-1 text-[13px] text-muted">{cs.subtitle}</p>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted">{cs.summary}</p>

        <ul className="flex flex-wrap gap-1.5">
          {cs.tools.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
          {cs.draft && (
            <li>
              <Tag tone="draft">Write-up in progress</Tag>
            </li>
          )}
        </ul>

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-lilac">
          Read the case study
          <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
