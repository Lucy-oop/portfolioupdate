import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import avatar from '../../assets/avatar.webp'
import ThemeToggle from './ThemeToggle'
import { cn } from '../../lib/cn'
import { useIntroReveal } from '../../lib/intro'
import { useMagnetic } from '../../lib/useMagnetic'
import { profile, socials } from '../../data/profile'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Design', href: '#design' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

/**
 * A floating pill: mark on the left, section links in the middle with a
 * highlight that slides to wherever you are, availability + theme + "Let's
 * talk" on the right. It tucks away while you scroll down and comes back the
 * moment you scroll up. Phones get a full-screen menu whose links rise in.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const shown = useIntroReveal() // slides down as the intro hands over (or on load)
  const talk = useMagnetic<HTMLAnchorElement>(0.3)
  const lastY = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)

  // Hide on the way down, show on the way up; always shown near the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > 160 && y > lastY.current)
        lastY.current = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: whichever section holds the middle of the viewport is "here".
  useEffect(() => {
    if (!onHome) {
      setActive(null)
      return
    }
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onHome])

  // The active-section pill: one element that glides to the active link.
  useEffect(() => {
    const nav = navRef.current
    const pill = pillRef.current
    if (!nav || !pill) return
    const place = () => {
      const link = active ? nav.querySelector<HTMLElement>(`a[href$="${active}"]`) : null
      if (!link) {
        pill.style.opacity = '0'
        return
      }
      pill.style.opacity = '1'
      pill.style.width = `${link.offsetWidth}px`
      pill.style.transform = `translateX(${link.offsetLeft}px)`
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  // Close the menu on navigation, lock the page while it is open, Escape closes.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Section links only resolve on the home route; elsewhere prefix with "/".
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`)
  const tucked = !shown || (hidden && !open)

  return (
    <header
      // The header strip itself lets clicks through; only the pill and menu take them.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out-soft sm:px-6 sm:pt-4"
      style={{ transform: tucked ? 'translateY(-130%)' : 'none' }}
    >
      <div
        className={cn(
          'pointer-events-auto relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border p-1.5 pl-2 transition-[background-color,border-color,box-shadow] duration-300',
          scrolled || open
            ? 'border-line bg-card/85 shadow-bento backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        )}
      >
        <Link to="/" className="flex items-center gap-2.5 rounded-full pr-2 font-display text-[15px] font-semibold tracking-tight">
          <img
            src={avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full border border-line object-cover"
          />
          Lucy
          <span className="sr-only">, {profile.fullName}, home</span>
        </Link>

        <nav ref={navRef} aria-label="Primary" className="relative isolate hidden items-center md:flex">
          <span
            ref={pillRef}
            aria-hidden
            className="nav-pill absolute left-0 top-0 -z-10 h-full rounded-full bg-canvas-sunk opacity-0"
          />
          {links.map((l) => (
            <a
              key={l.href}
              href={hrefFor(l.href)}
              aria-current={active === l.href ? 'location' : undefined}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-ink',
                active === l.href ? 'text-ink' : 'text-muted'
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <span
            className="hidden items-center gap-2 px-2 text-[12.5px] font-medium text-muted lg:inline-flex"
            title={profile.availability}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-mint" />
            </span>
            Available
          </span>
          <ThemeToggle />
          <a
            ref={talk}
            href={hrefFor('#contact')}
            data-magnetic
            className="btn-lift hidden items-center gap-1 rounded-full bg-ink px-4.5 py-2.5 text-sm font-semibold text-canvas sm:inline-flex"
          >
            Let’s talk <ArrowUpRight size={14} aria-hidden className="nudge-up-right" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-10 place-items-center rounded-full border border-line bg-card md:hidden"
          >
            {open ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
          </button>
        </div>
      </div>

      {/* ---- phones: full-screen menu ---- */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 flex flex-col bg-canvas px-6 pb-8 pt-28 transition-[opacity,visibility] duration-300 md:hidden',
          open ? 'pointer-events-auto visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {links.map((l, i) => (
            <span key={l.href} className="block overflow-hidden">
              <a
                href={hrefFor(l.href)}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-baseline gap-4 py-1.5 font-display text-5xl font-semibold tracking-tight transition-transform duration-600 ease-out-soft"
                style={{
                  transform: open ? 'none' : 'translateY(110%)',
                  transitionDelay: open ? `${0.05 + i * 0.06}s` : '0s',
                }}
              >
                <span className="font-mono text-[11px] font-normal text-muted">0{i + 1}</span>
                {l.label}
              </a>
            </span>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6 text-sm">
          <a href={`mailto:${profile.email}`} tabIndex={open ? undefined : -1} className="font-medium">
            {profile.email}
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-muted">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? undefined : -1}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
