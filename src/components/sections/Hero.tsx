import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, Download, MapPin } from 'lucide-react'
import portrait from '../../assets/portrait.webp'
import IntroReveal from '../ui/IntroReveal'
import ParticleHalo from '../fx/ParticleHalo'
import { profile } from '../../data/profile'
import { useIntroReveal } from '../../lib/intro'
import { useCountUp } from '../../lib/useCountUp'
import { useMagnetic } from '../../lib/useMagnetic'
import { useScrollFrame } from '../../lib/useScrollFrame'

/**
 * The hero, editorial style: an oversized headline with Lucy's portrait set
 * into the type as a rounded pill — "I design [portrait] it / before I build
 * it." — over the particle halo, which follows the cursor across the whole
 * section and rests on the pill otherwise.
 *
 * Below: the intro and actions, then a hairline bar with the stats and a
 * scroll cue. Lines rise through masks on load; scrolling away drifts the
 * headline up and fades it.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const viewWork = useMagnetic<HTMLAnchorElement>(0.25)
  const shown = useIntroReveal()

  useScrollFrame(sectionRef, (section) => {
    const p = Math.min(1, Math.max(0, window.scrollY / section.offsetHeight))
    if (headRef.current) {
      headRef.current.style.transform = `translateY(${-p * 110}px)`
      headRef.current.style.opacity = String(1 - p * 0.85)
    }
    if (barRef.current) barRef.current.style.opacity = String(1 - p * 1.6)
  })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden px-5 pb-8 pt-28 sm:px-8"
    >
      <ParticleHalo anchorRef={pillRef} size={0.18} className="absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl">
        <div ref={headRef}>
          {/* ---- top row ---- */}
          <IntroReveal className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-mint" />
              </span>
              {profile.availability}
            </span>
            <span className="eyebrow inline-flex items-center gap-1.5">
              <MapPin size={12} aria-hidden className="text-lilac" />
              {profile.role} · Bangkok, {profile.timezone}
            </span>
          </IntroReveal>

          {/* ---- headline with the portrait set into it ---- */}
          <h1
            id="hero-title"
            className="mt-8 font-display text-[clamp(2.9rem,10.5vw,9rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
          >
            <IntroReveal mode="mask" delay={0.05}>
              I design{' '}
              <span
                ref={pillRef}
                aria-hidden
                className="hero-pill relative mx-[0.06em] inline-block h-[0.78em] overflow-hidden rounded-full border border-line align-[-0.04em] shadow-bento-lift"
                style={{ width: shown ? '1.75em' : '0em' }}
              >
                <img src={portrait} alt="" className="hero-pill-img absolute inset-0 size-full object-cover" />
              </span>{' '}
              it
            </IntroReveal>
            <IntroReveal mode="mask" delay={0.16}>
              <span className="relative whitespace-nowrap">
                before
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.02em] left-0 h-[0.09em] w-full text-lilac"
                >
                  <path d="M2 8c40-5 90-6 196-3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              I build it.
            </IntroReveal>
          </h1>

          {/* ---- intro + actions ---- */}
          <IntroReveal delay={0.3} className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-[15px] leading-relaxed text-muted sm:text-[17px]">{profile.intro}</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                ref={viewWork}
                href="#work"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-opacity hover:opacity-88"
              >
                View work <ArrowDown size={15} aria-hidden />
              </a>
              <a
                href={profile.cv}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-lilac"
              >
                Download CV <Download size={15} aria-hidden />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-0.5 px-2 py-3 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {profile.email} <ArrowUpRight size={14} aria-hidden />
              </a>
            </div>
          </IntroReveal>
        </div>

        {/* ---- stats bar ---- */}
        {/*
          Totals across all her work, not a count of what this page lists —
          the site shows a selection. Kept as literals for that reason.
        */}
        <div ref={barRef}>
          <IntroReveal delay={0.42} className="mt-12 flex items-end justify-between gap-6 border-t border-line pt-6">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={30} suffix="+" label="Builds shipped" />
              <Stat value={12} suffix="+" label="Design projects" />
              <Stat value={4} label="Languages" />
            </dl>
            <a
              href="#work"
              className="hidden items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted sm:inline-flex"
            >
              Scroll
              <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-line">
                <span className="scroll-cue-dot absolute inset-x-0 top-0 h-3 bg-lilac" />
              </span>
            </a>
          </IntroReveal>
        </div>
      </div>
    </section>
  )
}

/** Label first in the markup (dt before dd), number shown on top. */
function Stat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const n = useCountUp(value, useIntroReveal())
  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="font-display text-3xl font-bold leading-none tabular-nums">
        {n}
        {suffix}
      </dd>
    </div>
  )
}
