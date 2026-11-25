import type { ReactNode } from 'react'
import Reveal from './Reveal'
import { useInViewOnce } from '../../lib/useInViewOnce'
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
      className={cn('scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20', className)}
    >
      <div className="mx-auto max-w-6xl">
        {/* Label, then a hairline running to the edge: every section starts the same way. */}
        <Reveal className="eyebrow flex items-center gap-4" y={8}>
          <span className="shrink-0">
            {index} — {eyebrow}
          </span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </Reveal>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
          <MaskTitle id={titleId}>{title}</MaskTitle>

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

/** The heading slides up through an overflow mask the first time it scrolls into view. */
function MaskTitle({ id, children }: { id: string; children: ReactNode }) {
  const { ref, inView, reduced } = useInViewOnce<HTMLHeadingElement>()
  return (
    <h2
      ref={ref}
      id={id}
      className="max-w-2xl overflow-hidden pb-[0.12em] text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl"
    >
      <span
        className="block transition-transform duration-900 ease-out-soft"
        style={{ transform: inView || reduced ? 'none' : 'translateY(105%)' }}
      >
        {children}
      </span>
    </h2>
  )
}
