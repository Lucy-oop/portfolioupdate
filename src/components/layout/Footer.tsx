import { ArrowUp, ArrowUpRight } from 'lucide-react'
import KineticWordmark from '../fx/KineticWordmark'
import { profile, socials } from '../../data/profile'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * The sign-off: contact line and socials, then the name set edge to edge as
 * an oversized wordmark whose last letters lift off the baseline as you
 * arrive at the bottom of the page.
 */
export default function Footer() {
  const reduced = useReducedMotion()

  return (
    <footer className="overflow-hidden border-t border-line px-5 pt-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{profile.role}</p>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-2 inline-flex items-center gap-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {profile.email}
            <ArrowUpRight
              size={22}
              aria-hidden
              className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lilac"
            />
          </a>
        </div>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-0.5 text-sm text-muted transition-colors hover:text-ink"
              >
                {s.label}
                <ArrowUpRight
                  size={13}
                  aria-hidden
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Room above for the lifting letters. */}
      <div className="mx-auto mt-16 max-w-6xl pt-[3vw]">
        <KineticWordmark text={profile.fullName.toUpperCase()} />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-line py-5 text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {profile.fullName} · {profile.location}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          className="group inline-flex items-center gap-1 font-medium transition-colors hover:text-ink"
        >
          Back to top
          <ArrowUp size={13} aria-hidden className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  )
}
