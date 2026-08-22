import { Sparkles } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import Tag from '../ui/Tag'
import { learningNext, stackGroups, type StackGroup } from '../../data/stack'
import { cn } from '../../lib/cn'

const toneClasses: Record<StackGroup['tone'], string> = {
  lilac: 'bg-lilac-soft text-lilac',
  peach: 'bg-peach-soft text-peach',
  mint: 'bg-mint/15 text-mint',
}

export default function Stack() {
  return (
    <Section
      id="stack"
      index="03"
      eyebrow="Stack & tools"
      title="What I reach for."
      lede="Strongest at the top of each list. Everything here is something I have actually shipped with."
    >
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map((g, i) => (
          <Reveal key={g.id} delay={i * 0.05}>
            <div className="tile flex h-full flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <span
                  className={cn('grid size-9 shrink-0 place-items-center rounded-xl', toneClasses[g.tone])}
                >
                  <g.icon size={17} aria-hidden />
                </span>
                <h3 className="text-[15px] font-semibold">{g.label}</h3>
              </div>

              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}

        {/* ---- learning next ---- */}
        <Reveal delay={stackGroups.length * 0.05}>
          <div className="gradient-wash flex h-full flex-col gap-4 rounded-bento p-6 text-white shadow-bento">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/20">
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
      </div>
    </Section>
  )
}
