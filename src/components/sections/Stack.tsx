import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import { learningNext, stackGroups, type StackGroup } from '../../data/stack'
import { cn } from '../../lib/cn'

const toneClasses: Record<StackGroup['tone'], string> = {
  lilac: 'border-lilac/40 bg-lilac-soft text-lilac',
  peach: 'border-peach/40 bg-peach-soft text-peach',
  mint: 'border-mint/40 bg-mint/15 text-mint',
}

type Chip = { item: string; group: StackGroup }
const chips: Chip[] = stackGroups.flatMap((group) => group.items.map((item) => ({ item, group })))
// Two rows of roughly equal length, drifting in opposite directions.
const half = Math.ceil(chips.length / 2)
const rows = [chips.slice(0, half), chips.slice(half)]

/**
 * The stack as two drifting rows of chips (opposite directions, paused on
 * hover). Pick a category and its chips light up in their colour while the
 * rest fade back. The same stack is listed in plain groups for screen
 * readers; reduced motion stops the drift and lets the rows scroll sideways.
 */
export default function Stack() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Section
      id="stack"
      index="03"
      eyebrow="Stack & tools"
      title="What I reach for."
      lede="Everything here is something I have actually shipped with. Pick a category to see where it sits."
    >
      <div role="group" aria-label="Highlight a category" className="flex flex-wrap gap-1.5">
        {stackGroups.map((g) => {
          const on = selected === g.id
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(on ? null : g.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
                on ? toneClasses[g.tone] : 'border-line bg-card text-muted hover:text-ink'
              )}
            >
              <g.icon size={14} aria-hidden />
              {g.label}
            </button>
          )
        })}
      </div>

      {/* Visual rows: decorative copies of the list below. */}
      <div aria-hidden className="mx-[calc(50%-50vw)] mt-8 flex flex-col gap-3">
        {rows.map((row, r) => (
          <div key={r} className="marquee no-scrollbar overflow-hidden motion-reduce:overflow-x-auto">
            <div className={cn('marquee-track flex w-max', r === 1 && 'marquee-reverse')}>
              {[...row, ...row].map(({ item, group }, i) => {
                const dim = selected && selected !== group.id
                return (
                  <span key={`${item}-${i}`} className="pr-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-[15px] font-medium transition-[opacity,background-color,border-color,color] duration-300',
                        selected === group.id ? toneClasses[group.tone] : 'border-line bg-card',
                        dim && 'opacity-25'
                      )}
                    >
                      <group.icon size={15} className="opacity-60" />
                      {item}
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* The same stack, grouped, for assistive tech. */}
      <ul className="sr-only">
        {stackGroups.map((g) => (
          <li key={g.id}>
            {g.label}: {g.items.join(', ')}
          </li>
        ))}
      </ul>

      {/* ---- learning next ---- */}
      <Reveal className="mt-10">
        <div className="gradient-wash flex flex-col gap-4 rounded-bento p-6 text-white shadow-bento sm:flex-row sm:items-center sm:gap-6">
          <div className="flex shrink-0 items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-white/20">
              <Sparkles size={17} aria-hidden />
            </span>
            <h3 className="text-[15px] font-semibold">Learning next</h3>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {learningNext.map((item) => (
              <li key={item}>
                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 font-mono text-[10.5px] leading-none tracking-wide">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
