import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import Tag from '../components/ui/Tag'
import Placeholder from '../components/ui/Placeholder'
import ScreensGallery from '../components/ui/ScreensGallery'
import FigmaEmbed from '../components/ui/FigmaEmbed'
import NotFound from './NotFound'
import { caseStudies, caseStudyBySlug } from '../data/caseStudies'

export default function CaseStudyPage() {
  const { slug = '' } = useParams()
  const study = caseStudyBySlug(slug)

  if (!study) return <NotFound />

  const index = caseStudies.findIndex((c) => c.slug === slug)
  const next = caseStudies[(index + 1) % caseStudies.length]

  return (
    <article className="px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/#design"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} aria-hidden /> All design work
        </Link>

        {/* ---- header ---- */}
        <Reveal className="mt-8">
          <p className="eyebrow">{study.discipline}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{study.subtitle}</p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {study.tools.map((t) => (
              <li key={t}>
                <Tag tone="lilac">{t}</Tag>
              </li>
            ))}
            <li>
              <Tag>{study.year}</Tag>
            </li>
            {study.draft && (
              <li>
                <Tag tone="draft">Write-up in progress</Tag>
              </li>
            )}
          </ul>
        </Reveal>

        {study.draft && (
          <Reveal className="mt-8">
            <p className="rounded-tile border border-dashed border-line bg-canvas-sunk px-5 py-4 text-[13px] leading-relaxed text-muted">
              This case study is still being written. The structure below is in place; the copy and
              exports are being finished.
            </p>
          </Reveal>
        )}

        {/* ---- banner ---- */}
        {study.hero && (
          <Reveal className="mt-10">
            <Placeholder
              src={study.hero}
              alt={`${study.title} — overview`}
              ratio="21 / 9"
              className="rounded-bento"
            />
          </Reveal>
        )}

        {/* ---- meta ---- */}
        <Reveal className="mt-10">
          <dl className="tile grid grid-cols-1 gap-6 p-7 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">Role</dt>
              <dd className="mt-1.5 text-sm leading-relaxed">{study.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">Year</dt>
              <dd className="mt-1.5 text-sm leading-relaxed">{study.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                In short
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed">{study.summary}</dd>
            </div>
          </dl>
        </Reveal>

        {/* ---- source link that cannot be embedded (e.g. Google Stitch) ---- */}
        {study.sourceUrl && (
          <Reveal className="mt-10">
            <a
              href={study.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="tile tile-hover group flex items-center justify-between gap-4 p-6"
            >
              <span>
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                  Source file
                </span>
                <span className="mt-1 block text-[15px] font-semibold">
                  {study.sourceLabel ?? 'Open the project'}
                </span>
              </span>
              <ArrowUpRight
                size={18}
                aria-hidden
                className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        )}

        {/* ---- live Figma file ---- */}
        {study.figmaEmbed && (
          <Reveal className="mt-14">
            <p className="eyebrow">Live file</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Open it in Figma</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              The working file, embedded live — pan and zoom it here, or open it in Figma.
            </p>
            <div className="mt-6">
              <FigmaEmbed url={study.figmaEmbed} title={study.title} />
            </div>
            <a
              href={study.figmaEmbed}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-lilac"
            >
              Open in Figma <ArrowRight size={15} aria-hidden />
            </a>
          </Reveal>
        )}

        {/* ---- sections ---- */}
        {study.sections.map((s) => (
          <Reveal key={s.id} className="mt-14">
            <section aria-labelledby={`${study.slug}-${s.id}`}>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2
                id={`${study.slug}-${s.id}`}
                className="mt-3 text-balance text-2xl font-semibold sm:text-3xl"
              >
                {s.title}
              </h2>

              <div className="mt-4 flex max-w-2xl flex-col gap-4">
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>

              {/*
                Only the screens gallery renders unconditionally. Other slots
                are hidden until their file exists — six dashed "asset pending"
                boxes read as an abandoned page, not a work in progress.
              */}
              {s.id === 'final' ? (
                <div className="mt-6">
                  <ScreensGallery screens={study.screens} title={study.title} />
                </div>
              ) : (
                s.image && (
                  <div className="mt-6">
                    <Placeholder
                      src={s.image}
                      alt={`${study.title} — ${s.eyebrow}`}
                      framing={s.framing}
                      ratio={s.framing === 'contain' ? '16 / 10' : '4 / 3'}
                    />
                  </div>
                )
              )}
            </section>
          </Reveal>
        ))}

        {/* ---- next ---- */}
        <Reveal className="mt-16">
          <Link
            to={`/design/${next.slug}`}
            className="tile tile-hover group flex items-center justify-between gap-4 p-7"
          >
            <span>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Next project
              </span>
              <span className="mt-1.5 block text-xl font-semibold">{next.title}</span>
            </span>
            <ArrowRight
              size={20}
              aria-hidden
              className="shrink-0 text-muted transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
    </article>
  )
}
