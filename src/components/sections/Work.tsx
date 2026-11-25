import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, GalleryHorizontal, LayoutGrid, List } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import Tag from '../ui/Tag'
import TiltCard from '../ui/TiltCard'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cn } from '../../lib/cn'
import {
  categoryLabels,
  orderedProjects,
  type Category,
  type Project,
} from '../../data/projects'

type Filter = 'all' | Category
type View = 'row' | 'grid' | 'list'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...(Object.keys(categoryLabels) as Category[]).map((id) => ({ id, label: categoryLabels[id] })),
]

const views: { id: View; label: string; icon: typeof List }[] = [
  { id: 'row', label: 'Carousel', icon: GalleryHorizontal },
  { id: 'grid', label: 'Grid', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: List },
]

export default function Work() {
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('row')

  const shown = useMemo(
    () =>
      filter === 'all' ? orderedProjects : orderedProjects.filter((p) => p.categories.includes(filter)),
    [filter]
  )

  return (
    <Section
      id="work"
      index="01"
      className="pb-6 sm:pb-8"
      eyebrow="Selected work"
      title="Things I built and shipped."
      lede={`${orderedProjects.length} projects, all live. Filter by discipline, or switch to a grid or list to scan them all at once.`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter projects"
          className="no-scrollbar -my-1 flex min-w-0 gap-1.5 overflow-x-auto py-1"
        >
          {filters.map((f) => {
            const count =
              f.id === 'all'
                ? orderedProjects.length
                : orderedProjects.filter((p) => p.categories.includes(f.id as Category)).length
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
                  filter === f.id
                    ? 'border-transparent bg-ink text-canvas'
                    : 'border-line bg-card text-muted hover:text-ink'
                )}
              >
                {f.label}
                <span className="ml-1.5 font-mono text-[10.5px] opacity-80">{count}</span>
              </button>
            )
          })}
        </div>

        <div role="group" aria-label="Layout" className="flex shrink-0 rounded-full border border-line bg-card p-1">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              aria-label={v.label}
              title={v.label}
              onClick={() => setView(v.id)}
              className={cn(
                'grid size-8 place-items-center rounded-full transition-colors',
                view === v.id ? 'bg-ink text-canvas' : 'text-muted hover:text-ink'
              )}
            >
              <v.icon size={15} aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {view === 'row' && <ProjectCarousel key={filter} projects={shown} />}
        {view === 'grid' && <ProjectGrid projects={shown} />}
        {view === 'list' && <ProjectList projects={shown} />}
      </div>
    </Section>
  )
}

/* =================================================================
 * CAROUSEL
 * -----------------------------------------------------------------
 * A plain scroll-snap row, full-bleed but starting on the page's
 * content edge so it lines up with the heading. Native swipe and
 * trackpad scrolling, mouse drag, and prev/next buttons. The intro
 * preloader's card ring unfurls into this row's shape.
 * ================================================================= */

const gutterOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).paddingLeft) || 0

/* -----------------------------------------------------------------
 * 3D CARD RING SHOWCASE
 * As you scroll through the section it changes step by step:
 *
 *   01 Ring  the cards spin on a tilted 3D ring
 *   02 Arc   the ring unrolls into a wide arc that leans toward you
 *   03 Row   the arc flattens into the browsable row below
 *
 * Every card is laid out in the normal scroll-snap row — its real, final
 * position, so the row is accessible and works without JS. The ring and the
 * arc are only transform offsets from that slot; once the row is reached the
 * transforms are cleared and it scrolls, drags and snaps as usual.
 *
 * Once flat, the row slides right to left on its own, looping seamlessly
 * over a second, aria-hidden copy of the cards. It pauses while you hover,
 * focus, drag or use the arrows, and picks up again a moment later.
 *
 * The pin is CSS sticky inside a taller wrapper, so it rides along with Lenis
 * and native scrolling alike. Reduced motion: just the row, no pin, no slide.
 * ----------------------------------------------------------------- */

const STEPS = ['Ring', 'Arc', 'Row'] as const
const TILT = 0.2 // radians the ring leans toward the viewer
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Pose = { x: number; y: number; z: number; rot: number; scale: number; opacity: number }
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  rot: lerp(a.rot, b.rot, t),
  scale: lerp(a.scale, b.scale, t),
  opacity: lerp(a.opacity, b.opacity, t),
})

function ProjectCarousel({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const dupRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const pauseUntil = useRef(0)
  const hovered = useRef(false)
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(reduced ? 2 : 0)

  // ---- the scroll-driven morph ----
  useEffect(() => {
    if (reduced) {
      setStep(2)
      return
    }
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    let spin = 0
    let last = 0
    let frame = 0
    let running = false
    let shownStep = -1
    let wasSettled = false

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 64) / 1000 : 0
      last = now

      const rect = pin.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const p = clamp01(-rect.top / travel)
      // 0–0.12 ring holds · 0.12–0.45 ring → arc · 0.45–0.8 arc → row · then row holds
      const a = ease(clamp01((p - 0.12) / 0.33))
      const f = ease(clamp01((p - 0.45) / 0.35))
      const nextStep = f >= 1 ? 2 : a >= 0.5 ? 1 : 0
      if (nextStep !== shownStep) {
        shownStep = nextStep
        setStep(nextStep)
      }

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      const n = cards.length
      if (!n) return

      const settled = f >= 1
      if (settled) {
        if (!wasSettled) {
          wasSettled = true
          for (const c of cards) {
            c.style.transform = ''
            c.style.opacity = ''
            c.style.zIndex = ''
          }
        }
        return
      }
      wasSettled = false
      if (track.scrollLeft) track.scrollLeft = 0

      if (a === 0) spin += dt * 0.35 // only the closed ring turns

      const cw = track.clientWidth
      const cardW = cards[0].offsetWidth
      const radius = (n * (cardW + 28)) / (2 * Math.PI)
      const ringScale = Math.min(1, (cw * (cw < 640 ? 2 : 1.05)) / (2 * radius + cardW))
      const spread = Math.min(cw * 0.94, n * cardW * 0.62)
      const arcScale = Math.min(0.85, (spread / n / cardW) * 1.6)

      cards.forEach((c, i) => {
        const slotX = c.offsetLeft + c.offsetWidth / 2 // from the track's left edge
        const theta = wrap((i / n) * Math.PI * 2 + spin)
        const z = radius * Math.cos(theta) - radius // 0 front, -2r back
        const depth = (Math.cos(theta) + 1) / 2

        const ring: Pose = {
          x: cw / 2 + ringScale * radius * Math.sin(theta),
          y: ringScale * z * Math.sin(TILT),
          z: ringScale * z * Math.cos(TILT),
          rot: theta,
          scale: ringScale,
          opacity: 0.35 + 0.65 * depth,
        }
        const u = n > 1 ? (i - (n - 1) / 2) / ((n - 1) / 2) : 0
        const arc: Pose = {
          x: cw / 2 + (u * spread) / 2,
          y: u * u * 70,
          z: 160 - u * u * 320,
          rot: -u * 0.55,
          scale: arcScale,
          opacity: 1,
        }
        const row: Pose = { x: slotX, y: 0, z: 0, rot: 0, scale: 1, opacity: 1 }

        const pose = blend(blend(ring, arc, a), row, f)
        c.style.transform =
          `translate3d(${pose.x - slotX}px, ${pose.y}px, ${pose.z}px) ` +
          `rotateY(${pose.rot}rad) scale(${pose.scale})`
        c.style.opacity = String(pose.opacity)
        c.style.zIndex = String(Math.round(1000 + z * (1 - a)))
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
      { rootMargin: '200px 0px' }
    )
    io.observe(pin)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reduced, projects])

  const settled = step === 2

  /** Hold the auto-slide for a moment after any manual interaction. */
  const holdSlide = (ms = 2500) => {
    pauseUntil.current = performance.now() + ms
  }

  // ---- auto-slide, right to left, once the row has settled ----
  useEffect(() => {
    const track = trackRef.current
    if (!track || !settled || reduced) return

    let pos = track.scrollLeft
    let last = 0
    let frame = 0
    let wasHeld = false
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min(now - last, 50) / 1000 : 0
      last = now
      const held = hovered.current || now < pauseUntil.current || document.hidden
      if (held) {
        wasHeld = true
        return
      }
      // Pick up from wherever the visitor left it.
      if (wasHeld) {
        pos = track.scrollLeft
        wasHeld = false
      }
      const first = cardRefs.current[0]
      const dup = dupRefs.current[0]
      if (!first || !dup) return
      const span = dup.offsetLeft - first.offsetLeft // one full set of cards
      pos += 40 * dt // px/s; kept as a float, since scrollLeft rounds
      if (pos >= span) pos -= span
      track.scrollLeft = pos
    }

    const hold = () => holdSlide()
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovered.current = true
    }
    const leave = () => {
      hovered.current = false
      holdSlide(1200)
    }
    track.addEventListener('pointerenter', enter)
    track.addEventListener('pointerleave', leave)
    track.addEventListener('pointerdown', hold)
    track.addEventListener('wheel', hold, { passive: true })
    track.addEventListener('touchstart', hold, { passive: true })
    track.addEventListener('focusin', hold)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      hovered.current = false
      track.removeEventListener('pointerenter', enter)
      track.removeEventListener('pointerleave', leave)
      track.removeEventListener('pointerdown', hold)
      track.removeEventListener('wheel', hold)
      track.removeEventListener('touchstart', hold)
      track.removeEventListener('focusin', hold)
    }
  }, [settled, reduced, projects])

  // ---- no empty half-screen after the pin ----
  // The sticky stage is a full screen tall with the row centred in it, so when
  // the pin lets go, the space under the row would follow. Pull the next
  // section up by exactly that much.
  useEffect(() => {
    const pin = pinRef.current
    const content = contentRef.current
    if (!pin || !content || reduced) return
    const fit = () => {
      const empty = Math.max(0, (window.innerHeight - content.offsetHeight) / 2)
      pin.style.marginBottom = `${-empty}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(content)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [reduced])

  // Which card sits on the leading edge, for the counter.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const edge = track.scrollLeft + gutterOf(track)
      let best = 0
      let bestD = Infinity
      ;[...cardRefs.current, ...dupRefs.current].forEach((c, i) => {
        if (!c) return
        const d = Math.abs(c.offsetLeft - edge)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      setActive(best % projects.length)
    }
    onScroll()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [projects])

  /** Step one card either way; the row loops, so there is no end. */
  const go = (dir: 1 | -1) => {
    const track = trackRef.current
    const first = cardRefs.current[0]
    const dup = dupRefs.current[0]
    if (!track || !first || !dup) return
    holdSlide()
    const span = dup.offsetLeft - first.offsetLeft
    // At the very start, jump to the identical spot one set along so "back" works.
    if (dir < 0 && track.scrollLeft < 4) track.scrollLeft += span
    const step = first.offsetWidth + 20
    track.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' })
  }

  useDragScroll(trackRef)

  const stage = (
    <div className={cn('flex flex-col', !reduced && 'sticky top-0 h-svh justify-center')}>
      <div ref={contentRef}>
      {!reduced && (
        <ol aria-hidden className="mb-2 flex items-center gap-3 px-(--gutter) font-mono text-[11px] uppercase tracking-wider">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              {i > 0 && <span className="h-px w-8 bg-line" />}
              <span className={cn('transition-colors duration-300', i === step ? 'text-lilac' : 'text-muted')}>
                0{i + 1} {s}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div
        ref={trackRef}
        data-lenis-prevent-horizontal
        aria-label="Projects"
        role="region"
        className={cn(
          'no-scrollbar relative flex gap-5 py-10 [perspective-origin:50%_45%] [perspective:1600px]',
          // Scrollable only once flat. No snap: it would fight the auto-slide.
          settled ? 'overflow-x-auto' : 'overflow-x-hidden',
          '[--card-w:clamp(250px,74vw,340px)] scroll-px-(--gutter) px-(--gutter)'
        )}
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="w-(--card-w) shrink-0 snap-start will-change-transform"
          >
            <TiltCard>
              <ProjectCard project={p} index={i} />
            </TiltCard>
          </div>
        ))}
        {/* The loop's second set: hidden from assistive tech and the tab order. */}
        {projects.map((p, i) => (
          <div
            key={`${p.slug}-loop`}
            ref={(el) => {
              dupRefs.current[i] = el
            }}
            aria-hidden
            inert
            className={cn(
              'w-(--card-w) shrink-0 transition-opacity duration-300',
              settled ? 'opacity-100' : 'opacity-0'
            )}
          >
            <TiltCard>
              <ProjectCard project={p} index={i} />
            </TiltCard>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-4 px-(--gutter) transition-opacity duration-500',
          settled ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <p className="font-mono text-[11px] tracking-wider text-muted" aria-live="polite">
          <span className="text-ink">{String(active + 1).padStart(2, '0')}</span> /{' '}
          {String(projects.length).padStart(2, '0')}
        </p>
        <div className="flex gap-2">
          <CarouselButton label="Previous project" onClick={() => go(-1)} disabled={false}>
            <ArrowLeft size={16} aria-hidden />
          </CarouselButton>
          <CarouselButton label="Next project" onClick={() => go(1)} disabled={false}>
            <ArrowRight size={16} aria-hidden />
          </CarouselButton>
        </div>
      </div>
      </div>
    </div>
  )

  // Full-bleed, with the row starting on the section's content edge; tall
  // enough to give the three steps about two screens of scroll.
  return (
    <div
      ref={pinRef}
      className={cn(
        'relative mx-[calc(50%-50vw)] [--pad:1.25rem] [--gutter:max(var(--pad),calc((100vw-72rem)/2))] sm:[--pad:2rem]',
        !reduced && 'h-[230svh]'
      )}
    >
      {stage}
    </div>
  )
}

/** Mouse drag-to-scroll for the carousel. Touch and trackpads scroll natively. */
function useDragScroll(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const track = ref.current
    if (!track) return

    let startX = 0
    let startLeft = 0
    let dragging = false
    let moved = false

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      moved = false
      startX = e.clientX
      startLeft = track.scrollLeft
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 5 && !moved) {
        moved = true
        track.style.scrollSnapType = 'none'
        track.style.cursor = 'grabbing'
      }
      if (moved) track.scrollLeft = startLeft - dx
    }
    const up = () => {
      if (!dragging) return
      dragging = false
      track.style.scrollSnapType = ''
      track.style.cursor = ''
    }
    // A drag that ends on a card must not open it.
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }

    track.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    track.addEventListener('click', click, true)
    return () => {
      track.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      track.removeEventListener('click', click, true)
    }
  }, [ref])
}

function CarouselButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 place-items-center rounded-full border border-line bg-card transition-colors hover:border-lilac disabled:opacity-35 disabled:hover:border-line"
    >
      {children}
    </button>
  )
}

/* =================================================================
 * CARDS
 * ================================================================= */

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      draggable={false}
      data-cursor="View"
      className="tile tile-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="aspect-16/10 overflow-hidden border-b border-line bg-canvas-sunk">
        <img
          src={p.img}
          alt={`${p.title} screenshot`}
          loading="lazy"
          draggable={false}
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3 font-mono text-[10.5px] uppercase tracking-wider text-muted">
          <span>
            {String(index + 1).padStart(2, '0')} · {p.year}
          </span>
          {p.featured && <span className="text-lilac">Featured</span>}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
            <p className="mt-1 text-[13px] text-muted">{p.role}</p>
          </div>
          <ArrowUpRight
            size={18}
            aria-hidden
            className="mt-0.5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lilac"
          />
        </div>

        <ul className="mt-auto flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </a>
  )
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {projects.map((p, i) => (
        <Reveal key={p.slug} delay={Math.min(i, 6) * 0.04}>
          <TiltCard>
            <ProjectCard project={p} index={i} />
          </TiltCard>
        </Reveal>
      ))}
    </div>
  )
}

/** The fast-scan view: one line per project. */
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="tile divide-y divide-line overflow-hidden">
      {projects.map((p, i) => (
        <li key={p.slug}>
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-canvas-sunk sm:grid-cols-[3rem_1.2fr_1fr_4rem_auto] sm:px-6"
          >
            <span className="hidden font-mono text-[11px] text-muted sm:block">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold">{p.title}</span>
              <span className="block truncate text-xs text-muted sm:hidden">{p.role}</span>
            </span>
            <span className="hidden truncate text-[13px] text-muted sm:block">{p.stack.join(' · ')}</span>
            <span className="font-mono text-[11px] text-muted">{p.year}</span>
            <ArrowUpRight
              size={16}
              aria-hidden
              className="text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lilac"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
