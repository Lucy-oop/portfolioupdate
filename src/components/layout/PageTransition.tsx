import type { ReactNode } from 'react'

/**
 * Each route fades and rises in (keyed on the pathname by the caller, so it
 * replays on every navigation). Pure CSS — .page-in in index.css — and the
 * global reduced-motion rule makes it instant.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>
}
