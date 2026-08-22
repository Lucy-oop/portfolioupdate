import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import avatar from '../../assets/avatar.webp'
import ThemeToggle from './ThemeToggle'
import { cn } from '../../lib/cn'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Design', href: '#design' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation, and lock the body while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Section links only resolve on the home route; elsewhere prefix with "/".
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled && 'backdrop-blur-md'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8',
          scrolled ? 'py-3' : 'py-5'
        )}
      >
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-tight"
        >
          <img
            src={avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-xl border border-line object-cover shadow-sm"
          />
          <span className="hidden sm:inline">
            Lucy
            <span className="text-muted"> · Yee Mon Thant</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={hrefFor(l.href)}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-canvas-sunk hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={hrefFor('#contact')}
            className="hidden rounded-full bg-ink px-4.5 py-2.5 text-sm font-semibold text-canvas transition-opacity hover:opacity-88 sm:inline-block"
          >
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-line bg-card md:hidden"
          >
            {open ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="mx-5 mt-1 flex flex-col gap-1 rounded-bento border border-line bg-card p-3 shadow-bento md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={hrefFor(l.href)}
              onClick={() => setOpen(false)}
              className="rounded-tile px-4 py-3 text-[15px] font-medium transition-colors hover:bg-canvas-sunk"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
