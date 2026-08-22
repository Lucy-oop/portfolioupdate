import { ArrowDown, ArrowUpRight, Download, MapPin } from 'lucide-react'
import portrait from '../../assets/portrait.webp'
import Reveal from '../ui/Reveal'
import { profile } from '../../data/profile'

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="px-5 pb-8 pt-28 sm:px-8 sm:pt-36">
      {/*
        grid-cols-1 below `xs` matters: without an explicit base the implicit
        column sizes to content and clips on 360px phones.
      */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* ---- intro: the anchor tile ---- */}
        <Reveal className="min-[420px]:col-span-2 lg:col-span-3" y={22}>
          <div className="tile flex h-full flex-col justify-between gap-8 p-7 sm:p-10">
            <div>
              <span className="eyebrow">{profile.role}</span>
              <h1
                id="hero-title"
                className="mt-4 text-balance text-4xl font-semibold leading-[1.03] sm:text-5xl md:text-6xl"
              >
                I design it{' '}
                <span className="relative whitespace-nowrap">
                  before
                  <svg
                    aria-hidden
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2.5 w-full text-lilac"
                  >
                    <path
                      d="M2 8c40-5 90-6 196-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{' '}
                I build it.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">
                {profile.intro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
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
          </div>
        </Reveal>

        {/* ---- portrait ---- */}
        <Reveal className="min-[420px]:col-span-1" delay={0.08} y={22}>
          <div className="gradient-wash relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-bento shadow-bento">
            <img
              src={portrait}
              alt={`Illustrated portrait of ${profile.fullName}`}
              className="absolute inset-0 size-full object-cover object-top"
            />
            {/* Scrim so the name stays legible over the illustration. */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/40 to-transparent"
            />
            <div className="relative p-5 text-white">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-85">
                {profile.preferredName}
              </p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug">{profile.fullName}</p>
            </div>
          </div>
        </Reveal>

        {/* ---- availability ---- */}
        <Reveal className="min-[420px]:col-span-1" delay={0.14} y={22}>
          <div className="tile flex h-full flex-col justify-between gap-4 p-6">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-mint" />
            </span>
            <p className="text-[15px] font-semibold leading-snug">{profile.availability}</p>
          </div>
        </Reveal>

        {/* ---- location ---- */}
        <Reveal className="min-[420px]:col-span-1" delay={0.18} y={22}>
          <div className="tile flex h-full flex-col justify-between gap-4 p-6">
            <MapPin size={18} className="text-lilac" aria-hidden />
            <div>
              <p className="text-[15px] font-semibold leading-snug">Bangkok</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted">
                Thailand · {profile.timezone}
              </p>
            </div>
          </div>
        </Reveal>

        {/* ---- counts ---- */}
        <Reveal className="min-[420px]:col-span-2" delay={0.22} y={22}>
          {/*
            Totals across all her work, not a count of what this page lists —
            the site shows a selection. Kept as literals for that reason.
          */}
          <div className="tile flex h-full items-center justify-around gap-4 p-6">
            <Stat value="20+" label="Builds shipped" />
            <span aria-hidden className="h-9 w-px bg-line" />
            <Stat value="12+" label="Design projects" />
            <span aria-hidden className="h-9 w-px bg-line" />
            <Stat value="4" label="Languages" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold leading-none">{value}</p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">{label}</p>
    </div>
  )
}
