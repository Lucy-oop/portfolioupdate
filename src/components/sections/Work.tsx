import { ArrowUpRight } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import Tag from '../ui/Tag'
import { featuredProjects, otherProjects, projects, type Project } from '../../data/projects'

export default function Work() {
  return (
    <Section
      id="work"
      index="01"
      eyebrow="Selected work"
      title="Things I built and shipped."
      lede={`${projects.length} projects, all live. Three are worth the long look; the rest are here because the range matters.`}
    >
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-3">
        {featuredProjects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.07}>
            <FeaturedCard project={p} />
          </Reveal>
        ))}
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:mt-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <CompactCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function FeaturedCard({ project: p }: { project: Project }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      className="tile tile-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="aspect-16/10 overflow-hidden border-b border-line bg-canvas-sunk">
        <img
          src={p.img}
          alt={`${p.title} screenshot`}
          loading="lazy"
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-muted">
              {p.year} · {p.role}
            </p>
          </div>
          <ArrowUpRight
            size={18}
            aria-hidden
            className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lilac"
          />
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted">{p.blurb}</p>

        <ul className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </a>
  )
}

function CompactCard({ project: p }: { project: Project }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      className="tile tile-hover group flex h-full items-center gap-4 p-4"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas-sunk">
        <img
          src={p.img}
          alt=""
          loading="lazy"
          className="size-full object-cover object-top"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold">{p.title}</h3>
        <p className="mt-0.5 truncate text-xs text-muted">{p.stack.join(' · ')}</p>
      </div>

      <ArrowUpRight
        size={16}
        aria-hidden
        className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lilac"
      />
    </a>
  )
}
