import { useRef } from 'react'
import portrait from '../../assets/portrait.webp'
import ParticleHalo from '../fx/ParticleHalo'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import Meter from '../ui/Meter'
import ScrubText from '../ui/ScrubText'
import Tag from '../ui/Tag'
import { aboutCopy, facts, profile, softSkills, spokenLanguages } from '../../data/profile'

export default function About() {
  const portraitRef = useRef<HTMLImageElement>(null)

  return (
    <Section
      id="about"
      index="04"
      eyebrow="About"
      title={
        <>
          I like the part where it{' '}
          <span className="bg-lilac-soft px-2 text-lilac">finally works.</span>
        </>
      }
      lede="Design-side background, fullstack job. The two halves are the point, not a coincidence."
    >
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-3">
        {/* ---- narrative ---- */}
        <Reveal className="lg:col-span-2">
          <div className="tile flex h-full flex-col gap-5 p-7 sm:p-9">
            {/* The hero's halo again, faint and still: it just breathes around the portrait. */}
            <div className="mb-2 flex items-center gap-4">
              <div className="relative size-16 shrink-0">
                {/* Kept to a soft round glow, so it never spills over the card's corner. */}
                <div className="pointer-events-none absolute -inset-10 overflow-hidden rounded-full opacity-70 [mask-image:radial-gradient(closest-side,#000_60%,transparent)]">
                  <ParticleHalo anchorRef={portraitRef} interactive={false} size={0.3} />
                </div>
                <img
                  ref={portraitRef}
                  src={portrait}
                  alt=""
                  className="relative size-16 rounded-full border border-line object-cover object-top"
                />
              </div>
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{profile.fullName}</p>
                <p className="text-[13px] text-muted">
                  {profile.preferredName} · {profile.location}
                </p>
              </div>
            </div>
            {aboutCopy.map((p) => (
              <ScrubText key={p.slice(0, 24)} text={p} className="text-[16px] leading-relaxed sm:text-[17px]" />
            ))}
          </div>
        </Reveal>

        {/* ---- facts ---- */}
        <Reveal delay={0.08}>
          <dl className="tile flex h-full flex-col gap-5 p-7">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                  {f.label}
                </dt>
                <dd className="mt-1 text-[15px] font-medium leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ---- spoken languages ---- */}
        <Reveal delay={0.12}>
          <div className="tile flex h-full flex-col gap-5 p-7">
            <h3 className="text-lg font-semibold">Languages</h3>
            <div className="flex flex-col gap-4">
              {spokenLanguages.map((l) => (
                <Meter key={l.name} label={l.name} value={l.level} note={l.note} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---- soft skills ---- */}
        <Reveal className="lg:col-span-2" delay={0.16}>
          <div className="tile flex h-full flex-col gap-5 p-7">
            <h3 className="text-lg font-semibold">How I work</h3>
            <ul className="flex flex-wrap gap-2">
              {softSkills.map((s) => (
                <li key={s}>
                  <Tag tone="default" className="px-3 py-2 text-[11.5px]">
                    {s}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
