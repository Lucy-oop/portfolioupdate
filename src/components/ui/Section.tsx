import type { ReactNode } from 'react'
import Reveal from './Reveal'
import { cn } from '../../lib/cn'

type SectionProps = {
  id: string
  /** Two-digit index shown in the eyebrow, e.g. "02". */
  index: string
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children: ReactNode
  className?: string
}

/** Shared section chrome: numbered eyebrow, display heading, optional lede. */
export default function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  className,
}: SectionProps) {
  const titleId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn('scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24', className)}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="eyebrow" y={8}>
          {index} — {eyebrow}
        </Reveal>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
          <Reveal delay={0.05}>
            <h2
              id={titleId}
              className="max-w-2xl text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl"
            >
              {title}
            </h2>
          </Reveal>

          {lede && (
            <Reveal delay={0.12} className="max-w-md">
              <p className="text-[15px] leading-relaxed text-muted">{lede}</p>
            </Reveal>
          )}
        </div>

        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  )
}
