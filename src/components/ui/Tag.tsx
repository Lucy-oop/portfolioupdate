import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type TagProps = {
  children: ReactNode
  tone?: 'default' | 'lilac' | 'peach' | 'draft'
  className?: string
}

const tones: Record<NonNullable<TagProps['tone']>, string> = {
  default: 'border-line bg-canvas-sunk text-muted',
  lilac: 'border-transparent bg-lilac-soft text-lilac',
  peach: 'border-transparent bg-peach-soft text-peach',
  draft: 'border-dashed border-line bg-transparent text-muted',
}

export default function Tag({ children, tone = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] leading-none tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
