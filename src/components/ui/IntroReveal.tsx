import type { ReactNode } from 'react'
import { useIntroReveal } from '../../lib/intro'
import { cn } from '../../lib/cn'

type IntroRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** "rise": fade and lift in. "mask": slide up from behind an overflow edge. */
  mode?: 'rise' | 'mask'
  /**
   * Which intro stage it waits for: 'opening' as the card ring unrolls (the
   * hero container), or 'done' once the cards have landed (headline, nav).
   */
  at?: 'opening' | 'done'
}

/**
 * Above-the-fold entrance that waits for the first-visit intro to hand over
 * (lib/intro.ts), so the hero isn't spent animating underneath the preloader.
 * Without an intro it simply plays on load.
 */
export default function IntroReveal({
  children,
  className,
  delay = 0,
  mode = 'rise',
  at = 'done',
}: IntroRevealProps) {
  const shown = useIntroReveal(at)
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
