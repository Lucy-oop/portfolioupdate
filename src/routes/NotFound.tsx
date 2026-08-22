import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 py-32 sm:px-8">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">That page doesn’t exist.</h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] text-muted">
          The link may be out of date, or the case study may have been renamed.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-opacity hover:opacity-88"
        >
          <ArrowLeft size={15} aria-hidden /> Back home
        </Link>
      </div>
    </section>
  )
}
