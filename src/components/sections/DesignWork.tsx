import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import Tag from '../ui/Tag'
import Placeholder from '../ui/Placeholder'
import { caseStudies, type CaseStudy } from '../../data/caseStudies'

const process = [
  { step: '01', title: 'Understand', body: 'Who is stuck, on what, and how they work around it now.' },
  { step: '02', title: 'Research', body: 'Competitor teardowns and a handful of real conversations.' },
  { step: '03', title: 'Wireframe', body: 'Low-fidelity, so throwing one away costs nothing.' },
  { step: '04', title: 'Systemise', body: 'Tokens, type scale and component states before any screen is final.' },
  { step: '05', title: 'Build & test', body: 'Ship it in React, put it in front of people, then revise.' },
]

export default function DesignWork() {
  return (
    <Section
      id="design"
      index="02"
      eyebrow="UI/UX Design"
      title="I design it before I build it."
      lede={`${caseStudies.length} design projects — the problem, the research, the wireframes, the system, and what I got wrong.`}
    >
      {/* ---- process strip ---- */}
      <ol className="mb-3.5 grid grid-cols-1 gap-3.5 sm:mb-4 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {process.map((p, i) => (
          <Reveal key={p.step} as="li" delay={i * 0.05}>
            <div className="tile flex h-full flex-col gap-2 p-5">
              <span className="font-mono text-[10.5px] text-lilac">{p.step}</span>
              <h3 className="text-[15px] font-semibold">{p.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* ---- case studies ---- */}
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 0.06}>
            <CaseCard study={cs} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function CaseCard({ study: cs }: { study: CaseStudy }) {
  return (
    <Link
      to={`/design/${cs.slug}`}
      className="tile tile-hover group flex h-full flex-col overflow-hidden"
    >
      <Placeholder
        src={cs.cover}
        alt={`${cs.title} case study cover`}
        ratio="4 / 3"
        className="rounded-none border-0 border-b border-line"
      />

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
            {cs.discipline}
          </span>
          <span className="font-mono text-[10.5px] text-muted">{cs.year}</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-tight">{cs.title}</h3>
          <p className="mt-1 text-[13px] text-muted">{cs.subtitle}</p>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted">{cs.summary}</p>

        <ul className="flex flex-wrap gap-1.5">
          {cs.tools.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
          {cs.draft && (
            <li>
              <Tag tone="draft">Write-up in progress</Tag>
            </li>
          )}
        </ul>

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-lilac">
          Read the case study
          <ArrowRight
            size={15}
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}
