import type { Project } from '../../data/projects'

/**
 * The small project card shared by the intro's 3D ring and the hero strip.
 * Both use this exact face at the same width (--mini-w), so when the intro's
 * cards land on the strip the swap underneath is invisible.
 */
export const miniCardClass =
  'mini-card block w-(--mini-w) shrink-0 overflow-hidden rounded-tile border border-line bg-card'

export function MiniCardFace({ project: p, onImageDone }: { project: Project; onImageDone?: () => void }) {
  return (
    <>
      <img
        src={p.img}
        alt=""
        draggable={false}
        onLoad={onImageDone}
        onError={onImageDone}
        className="aspect-16/10 w-full object-cover object-top"
      />
      <span className="block truncate px-3 py-2 font-mono text-[10.5px] tracking-wide text-muted">
        {p.title}
      </span>
    </>
  )
}
