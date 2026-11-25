import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, Download, MapPin } from 'lucide-react'
import portrait from '../../assets/portrait.webp'
import IntroReveal from '../ui/IntroReveal'
import ParticleHalo from '../fx/ParticleHalo'
import HeroStrip from './HeroStrip'
import { profile } from '../../data/profile'
import { useIntroReveal } from '../../lib/intro'
import { useCountUp } from '../../lib/useCountUp'
import { useMagnetic } from '../../lib/useMagnetic'
import { useScrollFrame } from '../../lib/useScrollFrame'

/**
 * The hero: a large two-line headline on the left, the portrait on the right
 * framed by the particle halo, and the project strip — where the intro's card
 * ring lands — along the bottom.
 *
 * The halo follows the mouse anywhere in the section and rests on the
 * portrait otherwise (touch, or the pointer elsewhere).
 *
 * Entrance is staged by the intro (lib/intro.ts): the section fades in while
 * the ring unrolls ('opening'); the headline lines slide up through their
 * masks once the cards land ('done').
 */
export default function Hero() {
  const portraitRef = useRef<HTMLDivElement>(null)
  const viewWork = useMagnetic<HTMLAnchorElement>(0.25)
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)

  // Scroll parallax as you leave the hero: the words lift and fade faster than
  // the portrait, which drifts and shrinks a touch — depth without a 3D scene.
  useScrollFrame(sectionRef, (section) => {
    const p = Math.min(1, Math.max(0, window.scrollY / section.offsetHeight))
    if (wordsRef.current) {
      wordsRef.current.style.transform = `translateY(${-p * 90}px)`
      wordsRef.current.style.opacity = String(1 - p * 0.9)
    }
    if (artRef.current) artRef.current.style.transform = `translateY(${-p * 40}px) scale(${1 - p * 0.06})`
  })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden px-5 pb-8 pt-28 sm:px-8 sm:pt-32"
    >
      <ParticleHalo anchorRef={portraitRef} className="absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* ---- words ---- */}
        <div ref={wordsRef} className="lg:col-span-7">
          <IntroReveal at="opening" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-mint" />
              </span>
              {profile.availability}
            </span>
            <span className="eyebrow inline-flex items-center gap-1.5">
              <MapPin size={12} aria-hidden className="text-lilac" />
              Bangkok · {profile.timezone}
            </span>
          </IntroReveal>

          <h1
            id="hero-title"
            className="mt-6 text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-[5.2rem]"
          >
            <IntroReveal mode="mask" delay={0.05}>
              I design it{' '}
              <span className="relative whitespace-nowrap">
                before
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full text-lilac"
                >
                  <path
                    d="M2 8c40-5 90-6 196-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </IntroReveal>
            <IntroReveal mode="mask" delay={0.16}>
              I build it.
            </IntroReveal>
          </h1>

          <IntroReveal at="opening" delay={0.1}>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[17px]">{profile.intro}</p>
          </IntroReveal>

          <IntroReveal at="opening" delay={0.16} className="mt-8 flex flex-wrap items-center gap-2.5">
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
          </IntroReveal>

          {/*
            Totals across all her work, not a count of what this page lists —
            the site shows a selection. Kept as literals for that reason.
          */}
          <IntroReveal at="opening" delay={0.22}>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={20} suffix="+" label="Builds shipped" />
              <Stat value={12} suffix="+" label="Design projects" />
              <Stat value={4} label="Languages" />
            </dl>
          </IntroReveal>
        </div>

        {/* ---- portrait: the halo's resting place ---- */}
        <IntroReveal at="opening" delay={0.08} className="lg:col-span-5">
          <div ref={artRef}>
            <div
              ref={portraitRef}
              className="relative mx-auto aspect-4/5 w-full max-w-[360px] overflow-hidden rounded-[2rem] border border-line shadow-bento-lift"
            >
              <img
                src={portrait}
                alt={`Illustrated portrait of ${profile.fullName}`}
                className="absolute inset-0 size-full object-cover object-top"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/35 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-85">
                  {profile.preferredName}
                </p>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug">{profile.fullName}</p>
                <p className="mt-0.5 text-[12.5px] opacity-80">{profile.role}</p>
              </div>
            </div>
          </div>
        </IntroReveal>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        <HeroStrip />
      </div>
    </section>
  )
}

/** Label first in the markup (dt before dd), number shown on top. */
function Stat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const shown = useIntroReveal('opening')
  const n = useCountUp(value, shown)
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
