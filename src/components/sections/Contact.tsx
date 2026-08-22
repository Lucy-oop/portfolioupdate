import { useState } from 'react'
import { AlertCircle, ArrowUpRight, Check, Mail, Phone } from 'lucide-react'
import Section from '../ui/Section'
import Reveal from '../ui/Reveal'
import { profile, socials } from '../../data/profile'

// Public by design — Web3Forms access keys are meant to ship client-side.
// The honeypot field below is what keeps the inbox usable.
const WEB3FORMS_ACCESS_KEY = '44b610bc-ccc7-4f72-bcd1-912925a9157f'

const empty = { name: '', email: '', subject: '', message: '', botcheck: '' }
type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState<Status>('idle')

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
      if (data.success) setForm(empty)
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
      lede="I’m looking for a junior frontend role, and open to freelance in the meantime. If you have something in mind, tell me about it."
    >
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-5">
        {/* ---- direct details ---- */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-2">
          <Reveal>
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

          <Reveal delay={0.06}>
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

          <Reveal delay={0.12} className="flex-1">
            <div className="tile flex h-full flex-col gap-4 p-6">
              <h3 className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Elsewhere
              </h3>
              <ul className="flex flex-col gap-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-baseline justify-between gap-3 text-[15px] font-medium transition-colors hover:text-lilac"
                    >
                      {s.label}
                      <span className="truncate font-mono text-[11px] text-muted">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ---- form ---- */}
        <Reveal delay={0.1} className="lg:col-span-3">
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
              <Field id="c-name" label="Name" name="name" value={form.name} onChange={onChange} autoComplete="name" placeholder="Your name" />
              <Field id="c-email" label="Email" name="email" type="email" required value={form.email} onChange={onChange} autoComplete="email" placeholder="you@example.com" />
            </div>

            <Field id="c-subject" label="Subject" name="subject" value={form.subject} onChange={onChange} placeholder="What is this about?" />

            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="c-message" className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Message <span aria-hidden>*</span>
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={onChange}
                placeholder="Tell me about the project, the role, or just say hello."
                className="min-h-32 flex-1 resize-y rounded-tile border border-line bg-canvas-sunk px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted/70 focus:border-lilac"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-canvas transition-opacity hover:opacity-88 disabled:opacity-55"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
              {status !== 'sending' && <ArrowUpRight size={15} aria-hidden />}
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

type FieldProps = {
  id: string
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}

function Field({ id, label, required, ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      <input
        id={id}
        required={required}
        {...rest}
        className="rounded-tile border border-line bg-canvas-sunk px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted/70 focus:border-lilac"
      />
    </div>
  )
}
