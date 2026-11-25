import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, GalleryHorizontal, LayoutGrid, List } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import Tag from '../ui/Tag'
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
                <span className="ml-1.5 font-mono text-[10.5px] opacity-60">{count}</span>
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

function ProjectCarousel({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  // Which card sits on the leading edge, for the counter.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const edge = track.scrollLeft + gutterOf(track)
      let best = 0
      let bestD = Infinity
      cardRefs.current.forEach((c, i) => {
        if (!c) return
        const d = Math.abs(c.offsetLeft - edge)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      setActive(best)
    }
    onScroll()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [projects])

  const go = (dir: 1 | -1) => {
    const next = Math.min(projects.length - 1, Math.max(0, active + dir))
    const card = cardRefs.current[next]
    const track = trackRef.current
    if (!card || !track) return
    track.scrollTo({ left: card.offsetLeft - gutterOf(track), behavior: reduced ? 'auto' : 'smooth' })
  }

  useDragScroll(trackRef)

  return (
    // Full-bleed, with the row and counter starting on the section's content edge.
    <div className="mx-[calc(50%-50vw)] [--pad:1.25rem] [--gutter:max(var(--pad),calc((100vw-72rem)/2))] sm:[--pad:2rem]">
      <div
        ref={trackRef}
        data-lenis-prevent-horizontal
        aria-label="Projects"
        role="region"
        className={cn(
          'no-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto py-3',
          '[--card-w:clamp(250px,74vw,340px)] scroll-px-(--gutter) px-(--gutter)'
        )}
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="w-(--card-w) shrink-0 snap-start"
          >
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-(--gutter)">
        <p className="font-mono text-[11px] tracking-wider text-muted" aria-live="polite">
          <span className="text-ink">{String(active + 1).padStart(2, '0')}</span> /{' '}
          {String(projects.length).padStart(2, '0')}
        </p>
        <div className="flex gap-2">
          <CarouselButton label="Previous project" onClick={() => go(-1)} disabled={active === 0}>
            <ArrowLeft size={16} aria-hidden />
          </CarouselButton>
          <CarouselButton label="Next project" onClick={() => go(1)} disabled={active === projects.length - 1}>
            <ArrowRight size={16} aria-hidden />
          </CarouselButton>
        </div>
      </div>
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
          <ProjectCard project={p} index={i} />
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
