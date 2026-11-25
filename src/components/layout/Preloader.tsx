import { useCallback, useEffect, useRef, useState } from 'react'
import { orderedProjects } from '../../data/projects'
import { profile } from '../../data/profile'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { intro } from '../../lib/intro'
import { MiniCardFace, miniCardClass } from '../ui/MiniCard'
import { setScrollLocked } from './SmoothScroll'

/**
 * INTRO: 3D CARD RING → ARC → HERO STRIP
 * =================================================================
 * First visit of a session, one continuous sequence:
 *
 *   ring     project cards spin on a tilted 3D ring, mirrored on the floor,
 *            while a big counter runs to 100 (card images + page load;
 *            at least MIN_SPIN, never more than MAX_SPIN)
 *   arc      the ring unrolls into a wide curved arc that pushes toward the
 *            camera, and the overlay dissolves so the hero shows behind it
 *   strip    the arc flattens and each card lands exactly on its twin in
 *            the hero strip ([data-strip-card]); then the intro hands over
 *            (lib/intro.ts) — the real strip appears in the same frame, the
 *            nav and headline slide up through their masks
 *
 * Every card's pose (x, y, z, rotateY, scale) is computed per frame for the
 * phase it is in and blended toward the next; one rAF loop writes them.
 *
 * Only on "/" without a #hash, once per session, never for reduced motion.
 * Skip intro / Escape hand over immediately.
 */

const STORAGE_KEY = 'ring-intro'
const MAX_CARDS = 8
const TILT = 0.21 // radians the ring leans toward the viewer
const SPIN_SPEED = 0.6 // rad/s
const MIN_SPIN = 1600
const MAX_SPIN = 4200
const ARC = 1100
const FLATTEN = 900

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Pose = { x: number; y: number; z: number; rot: number; scale: number }
const blend = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  rot: lerp(a.rot, b.rot, t),
  scale: lerp(a.scale, b.scale, t),
})

const cards = orderedProjects.slice(0, MAX_CARDS)

function shouldPlay(reduced: boolean) {
  if (reduced || window.location.pathname !== '/' || window.location.hash) return false
  try {
    return !sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return true // storage blocked: play, it just won't remember
  }
}

export default function Preloader() {
  const reduced = useReducedMotion()
  // Decided during the first render — before the hero and nav render — so
  // they start out waiting, and the page never flashes in first.
  const [show, setShow] = useState(() => {
    const play = shouldPlay(reduced)
    if (play) intro.begin()
    return play
  })
  const done = useCallback(() => setShow(false), [])

  return show ? <RingIntro onDone={done} /> : null
}

function RingIntro({ onDone }: { onDone: () => void }) {
  const bgRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mirrorRefs = useRef<(HTMLDivElement | null)[]>([])
  const loadedRef = useRef(0)
  const skipRef = useRef(false)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const bg = bgRef.current
    const hud = hudRef.current
    if (!bg || !hud) return

    // Hold the page still, at the top, and out of reach underneath.
    window.scrollTo(0, 0)
    setScrollLocked(true)
    const behind = Array.from(document.querySelectorAll<HTMLElement>('#root > *:not([data-preloader])'))
    behind.forEach((el) => el.setAttribute('inert', ''))

    let pageLoaded = document.readyState === 'complete'
    const onLoad = () => (pageLoaded = true)
    window.addEventListener('load', onLoad)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skipRef.current = true
    }
    window.addEventListener('keydown', onKey)

    const n = cards.length
    let start = 0
    let last = 0
    let spin = 0
    let arcAt = 0
    let shownPercent = -1
    let frame = 0
    let finished = false

    const release = () => {
      behind.forEach((el) => el.removeAttribute('inert'))
      setScrollLocked(false)
    }

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(frame)
      release()
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Private mode: fine, it plays again next time.
      }
      // Same commit: the real strip appears as these cards disappear.
      intro.finish()
      onDone()
    }

    /** Where each card lands: its twin in the hero strip, relative to the stage centre. */
    const stripPoses = (vw: number, vh: number, cardW: number): Pose[] =>
      cards.map((_, i) => {
        const el = document.querySelector<HTMLElement>(`[data-strip-card="${i}"]`)
        if (!el) return { x: 0, y: vh, z: 0, rot: 0, scale: 1 }
        const r = el.getBoundingClientRect()
        return {
          x: r.left + r.width / 2 - vw / 2,
          y: r.top + r.height / 2 - vh / 2,
          z: 0,
          rot: 0,
          scale: r.width / cardW,
        }
      })

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      // Times come from rAF only, measured from the first frame we draw.
      if (!start) start = last = now
      const dt = Math.min(now - last, 64) / 1000
      last = now
      const elapsed = now - start

      // ---- progress + phase ----
      const pct = Math.round((loadedRef.current / n) * 90 + (pageLoaded ? 10 : 0))
      if (pct !== shownPercent) {
        shownPercent = pct
        setPercent(pct)
      }
      if (skipRef.current) return finish()
      const ready = loadedRef.current >= n && pageLoaded
      if (!arcAt && ((ready && elapsed >= MIN_SPIN) || elapsed >= MAX_SPIN)) {
        arcAt = now
        intro.open() // the hero starts fading in behind the unrolling ring
      }
      if (!arcAt) spin += dt * SPIN_SPEED

      const a = arcAt ? ease(clamp01((now - arcAt) / ARC)) : 0
      const f = arcAt ? ease(clamp01((now - arcAt - ARC) / FLATTEN)) : 0

      // ---- geometry, from the viewport each frame ----
      const vw = window.innerWidth
      const vh = window.innerHeight
      const cardW = cardRefs.current[0]?.offsetWidth ?? 200
      const radius = (n * (cardW + 28)) / (2 * Math.PI)
      const ringScale = Math.min(1.15, (vw * (vw < 640 ? 1.3 : 0.85)) / (2 * radius + cardW))
      const spread = Math.min(vw * 0.92, n * cardW * 1.2)
      const targets = f > 0 ? stripPoses(vw, vh, cardW) : null

      cardRefs.current.forEach((c, i) => {
        if (!c) return
        const theta = wrap((i / n) * Math.PI * 2 + spin)
        const z = radius * Math.cos(theta) - radius // 0 front, -2r back
        const depth = (Math.cos(theta) + 1) / 2

        const ring: Pose = {
          x: ringScale * radius * Math.sin(theta),
          y: -vh * 0.06 + ringScale * z * Math.sin(TILT),
          z: ringScale * z * Math.cos(TILT),
          rot: theta,
          scale: ringScale,
        }
        // The arc: a wide curve, centre pushed toward the camera, ends swept back and turned in.
        const u = n > 1 ? (i - (n - 1) / 2) / ((n - 1) / 2) : 0
        const arc: Pose = {
          x: (u * spread) / 2,
          y: -vh * 0.02 - u * u * vh * 0.07,
          z: 220 - u * u * 380,
          rot: -u * 0.5,
          scale: Math.min(1.1, (spread / n / cardW) * 0.92),
        }

        let pose = blend(ring, arc, a)
        if (targets) pose = blend(pose, targets[i], f)

        c.style.transform =
          `translate(-50%, -50%) translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) ` +
          `rotateY(${pose.rot}rad) scale(${pose.scale})`
        c.style.opacity = String(lerp(0.4 + 0.6 * depth, 1, a))
        c.style.zIndex = String(Math.round(1000 + z * (1 - a)))

        const mirror = mirrorRefs.current[i]
        if (mirror) mirror.style.opacity = String((1 - a) * 0.5)
      })

      // The hero shows through as the ring opens; the counter goes with it.
      bg.style.opacity = String(1 - a)
      hud.style.opacity = String(1 - clamp01(a * 1.8))

      if (f >= 1) finish()
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('keydown', onKey)
      // Unmounted early (HMR, StrictMode's test unmount): never leave the page locked.
      if (!finished) release()
    }
  }, [onDone])

  return (
    <div data-preloader className="fixed inset-0 z-[100] overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 bg-canvas" />

      {/* the stage */}
      <div aria-hidden className="absolute inset-0 [perspective:1400px] [perspective-origin:50%_40%]">
        {cards.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <div className={miniCardClass}>
              <MiniCardFace project={p} onImageDone={() => (loadedRef.current += 1)} />
            </div>
            {/* floor reflection: the card flipped, fading out downward */}
            <div
              ref={(el) => {
                mirrorRefs.current[i] = el
              }}
              className="ring-mirror pointer-events-none absolute inset-x-0 top-full mt-1.5"
            >
              <div className={miniCardClass}>
                <MiniCardFace project={p} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* counter + name */}
      <div
        ref={hudRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-9"
      >
        <p
          role="status"
          className="font-display text-[22vw] font-semibold leading-[0.8] tracking-tighter tabular-nums sm:text-[11rem]"
        >
          <span className="sr-only">Loading portfolio, </span>
          {String(percent).padStart(3, '0')}
          <span className="text-[0.35em] text-muted">%</span>
        </p>
        <p className="mb-2 text-right font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {profile.fullName}
          <br />
          Portfolio · {new Date().getFullYear()}
        </p>
      </div>

      <button
        type="button"
        onClick={() => (skipRef.current = true)}
        className="absolute right-4 top-4 rounded-full border border-line bg-card px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:text-ink sm:right-6 sm:top-6"
      >
        Skip intro
      </button>
    </div>
  )
}
