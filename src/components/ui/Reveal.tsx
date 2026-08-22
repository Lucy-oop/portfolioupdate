import type { ElementType, ReactNode } from 'react'
import { useInViewOnce } from '../../lib/useInViewOnce'
import { cn } from '../../lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: ElementType
}

/**
 * Fade-and-rise on first scroll into view.
 *
 * CSS transitions rather than a motion library, driven by useInViewOnce —
 * which fails visible, so a missed observer callback costs an animation
 * rather than hiding the content.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, inView, reduced } = useInViewOnce<HTMLDivElement>()

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag
      ref={ref}
      className={cn('transition-[opacity,transform] duration-600 ease-out-soft', className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateY(${y}px)`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </Tag>
  )
}
