import { useEffect, useState } from 'react'
import { AlertCircle, ArrowUpRight, Check, Mail, Phone } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import { profile, socials } from '../../data/profile'
import { burst } from '../../lib/burst'
import { useMagnetic } from '../../lib/useMagnetic'
import { useReducedMotion } from '../../lib/useReducedMotion'

// Public by design — Web3Forms access keys are meant to ship client-side.
// The honeypot field below is what keeps the inbox usable.
const WEB3FORMS_ACCESS_KEY = '44b610bc-ccc7-4f72-bcd1-912925a9157f'

const empty = { name: '', email: '', subject: '', message: '', botcheck: '' }
type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState<Status>('idle')
  const reduced = useReducedMotion()
  const sendRef = useMagnetic<HTMLButtonElement>(0.2)

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Honeypot: a real person never fills a field they cannot see.
    if (form.botcheck) {
      setStatus('success')
      setForm(empty)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: form.subject || 'New message from your portfolio',
          from_name: form.name || 'Portfolio visitor',
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
      if (data.success) {
        setForm(empty)
        // The send button bursts into the three colours.
        const r = sendRef.current?.getBoundingClientRect()
        if (r && !reduced) burst(r.left + r.width / 2, r.top + r.height / 2)
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section
      id="contact"
      index="05"
      eyebrow="Contact"
      title="Let’s build something."
      lede="I’m looking for a product engineering role, and open to freelance in the meantime. If you have something in mind, tell me about it."
    >
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-5">
        {/* ---- direct details ---- */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-2">
          <Reveal x={-40} y={0}>
            <a
              href={`mailto:${profile.email}`}
              className="tile tile-hover group flex items-center gap-4 p-6"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lilac-soft text-lilac">
                <Mail size={17} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">
                  Email
                </span>
                <span className="block truncate text-[15px] font-semibold">{profile.email}</span>
              </span>
              <ArrowUpRight size={16} aria-hidden className="shrink-0 text-muted" />
            </a>
          </Reveal>

          <Reveal delay={0.06} x={-40} y={0}>
            <a
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
              className="tile tile-hover group flex items-center gap-4 p-6"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-peach-soft text-peach">
                <Phone size={17} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">
                  Phone
                </span>
                <span className="block truncate text-[15px] font-semibold">{profile.phone}</span>
              </span>
              <ArrowUpRight size={16} aria-hidden className="shrink-0 text-muted" />
            </a>
          </Reveal>

          <Reveal delay={0.12} x={-40} y={0} className="flex-1">
            <div className="tile flex h-full flex-col p-6">
              <h3 className="font-mono text-[10.5px] uppercase tracking-wider text-muted">Elsewhere</h3>
              <ul className="mt-3 divide-y divide-line">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 py-3 text-[17px] font-semibold transition-colors hover:text-lilac"
                    >
                      <span className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1.5">
                        {s.label}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[11px] font-normal text-muted">
                        <span className="truncate">{s.handle}</span>
                        <ArrowUpRight
                          size={14}
                          aria-hidden
                          className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <LocalTime />
            </div>
          </Reveal>
        </div>

        {/* ---- form ---- */}
        <Reveal delay={0.1} x={40} y={0} className="lg:col-span-3">
          <form onSubmit={onSubmit} className="tile flex h-full flex-col gap-4 p-7 sm:p-9">
            {/* Honeypot — hidden from sight and from screen readers. */}
            <input
              type="text"
              name="botcheck"
              value={form.botcheck}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] size-0 opacity-0"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="c-name" label="Your name" name="name" value={form.name} onChange={onChange} autoComplete="name" />
              <Field id="c-email" label="Email" name="email" type="email" required value={form.email} onChange={onChange} autoComplete="email" />
            </div>

            <Field id="c-subject" label="What is this about?" name="subject" value={form.subject} onChange={onChange} />

            {/* Floating label: rests inside the field, rises when focused or filled. */}
            <div className="relative flex flex-1 flex-col">
              <textarea
                id="c-message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={onChange}
                placeholder=" "
                className="peer min-h-32 flex-1 resize-y rounded-tile border border-line bg-canvas-sunk px-4 pb-3 pt-7 text-[15px] outline-none transition-colors focus:border-lilac"
              />
              <label htmlFor="c-message" className={floatLabel('peer-placeholder-shown:top-4')}>
                Message <span aria-hidden>*</span>
              </label>
            </div>

            <button
              ref={sendRef}
              data-magnetic
              type="submit"
              disabled={status === 'sending'}
              className="btn-lift inline-flex items-center justify-center gap-1.5 self-end rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas disabled:opacity-55"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
              {status !== 'sending' && <ArrowUpRight size={15} aria-hidden className="nudge-up-right" />}
            </button>

            <div aria-live="polite" className="min-h-5">
              {status === 'success' && (
                <p className="flex items-center gap-1.5 text-[13px] text-mint">
                  <Check size={14} aria-hidden /> Thanks — that’s sent. I’ll reply soon.
                </p>
              )}
              {status === 'error' && (
                <p className="flex items-center gap-1.5 text-[13px] text-peach">
                  <AlertCircle size={14} aria-hidden /> Something went wrong. Email me directly
                  instead?
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

/**
 * A floating label: sits inside the empty field like a placeholder, then
 * rises to a small caption when the field is focused or filled. Driven by the
 * field's `:placeholder-shown` (its placeholder is a single space), so it
 * needs no state. `resting` positions it while it rests.
 */
const floatLabel = (resting: string) =>
  [
    'pointer-events-none absolute left-4 top-2.5 font-mono text-[10px] uppercase tracking-wider text-muted transition-all duration-200',
    resting,
    'peer-placeholder-shown:text-[15px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-sans',
    'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:font-mono peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-lilac',
  ].join(' ')

type FieldProps = {
  id: string
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  autoComplete?: string
}

function Field({ id, label, required, ...rest }: FieldProps) {
  return (
    <div className="relative">
      <input
        id={id}
        required={required}
        placeholder=" "
        {...rest}
        className="peer w-full rounded-tile border border-line bg-canvas-sunk px-4 pb-2.5 pt-6 text-[15px] outline-none transition-colors focus:border-lilac"
      />
      <label htmlFor={id} className={floatLabel('peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2')}>
        {label} {required && <span aria-hidden>*</span>}
      </label>
    </div>
  )
}

/** Lucy's local time, ticking each minute — useful context for anyone writing from elsewhere. */
function LocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(now)

  return (
    <p className="mt-auto flex items-center gap-2 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-mint" />
      </span>
      Bangkok · <span className="tabular-nums text-ink">{time}</span> local time
    </p>
  )
}
