import type { ReactNode } from 'react'
import { useIntroReveal } from '../../lib/intro'
import { cn } from '../../lib/cn'

type IntroRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** "rise": fade and lift in. "mask": slide up from behind an overflow edge. */
  mode?: 'rise' | 'mask'
}

/**
 * Above-the-fold entrance, played once on load (lib/intro.ts).
 */
export default function IntroReveal({
  children,
  className,
  delay = 0,
  mode = 'rise',
}: IntroRevealProps) {
  const shown = useIntroReveal()
  const style = { transitionDelay: `${delay}s` }

  if (mode === 'mask') {
    return (
      <span className={cn('block overflow-hidden pb-[0.14em]', className)}>
        <span
          className="block transition-transform duration-900 ease-out-soft"
          style={{ ...style, transform: shown ? 'none' : 'translateY(110%)' }}
        >
          {children}
        </span>
      </span>
    )
  }

  return (
    <div
      className={cn('transition-[opacity,transform] duration-700 ease-out-soft', className)}
      style={{ ...style, opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(18px)' }}
    >
      {children}
    </div>
  )
}
