import { ImageOff } from 'lucide-react'
import { cn } from '../../lib/cn'

export type Framing = 'crop' | 'contain' | 'scroll'

type PlaceholderProps = {
  src?: string | null
  alt: string
  /** CSS aspect-ratio string, e.g. "4 / 3". Ignored when framing is "scroll". */
  ratio?: string
  framing?: Framing
  className?: string
}

/**
 * Renders an image in one of three framings, or a dashed "asset pending" box
 * when `src` is absent. Never breaks the layout on a missing file.
 *
 *  crop    — fills a fixed ratio, anchored top. Landscape exports only.
 *  contain — whole image fits, nothing cropped. Wireframes, component sheets.
 *  scroll  — natural proportions in a capped, scrollable browser frame.
 *            This is the one for tall full-page website exports.
 */
export default function Placeholder({
  src,
  alt,
  ratio = '4 / 3',
  framing = 'crop',
  className,
}: PlaceholderProps) {
  if (!src) {
    return (
      <div
        style={{ aspectRatio: framing === 'scroll' ? '16 / 10' : ratio }}
        className={cn(
          'grid place-items-center rounded-tile border border-dashed border-line bg-canvas-sunk text-muted',
          className
        )}
      >
        <span className="flex flex-col items-center gap-2 text-center">
          <ImageOff size={20} aria-hidden />
          <span className="font-mono text-[10.5px] uppercase tracking-wider">Asset pending</span>
        </span>
      </div>
    )
  }

  if (framing === 'scroll') {
    return (
      <div className={cn('overflow-hidden rounded-tile border border-line bg-card', className)}>
        {/* Browser chrome, so a tall page export reads as a screen not a poster. */}
        <div className="flex items-center gap-1.5 border-b border-line bg-canvas-sunk px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-peach" />
          <span className="size-2.5 rounded-full bg-lilac" />
          <span className="size-2.5 rounded-full bg-mint" />
        </div>
        <div className="max-h-[560px] overflow-y-auto overscroll-contain">
          <img src={src} alt={alt} loading="lazy" className="block w-full" />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn(
        'overflow-hidden rounded-tile border border-line',
        framing === 'contain' ? 'bg-canvas-sunk' : 'bg-card',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          'size-full',
          framing === 'contain' ? 'object-contain' : 'object-cover object-top'
        )}
      />
    </div>
  )
}
