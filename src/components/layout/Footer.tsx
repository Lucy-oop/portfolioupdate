import { ArrowUpRight } from 'lucide-react'
import { profile, socials } from '../../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-[15px] font-semibold">{profile.fullName}</p>
          <p className="mt-1 text-sm text-muted">
            {profile.role} · {profile.location}
          </p>
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

      <p className="mx-auto mt-8 max-w-6xl text-xs text-muted">
        Built with React, TypeScript and Tailwind CSS.
      </p>
    </footer>
  )
}
