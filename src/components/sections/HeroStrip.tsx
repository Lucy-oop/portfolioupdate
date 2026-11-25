import { orderedProjects } from '../../data/projects'
import { useIntroDone } from '../../lib/intro'
import { MiniCardFace, miniCardClass } from '../ui/MiniCard'

/**
 * The slow-drifting project strip along the bottom of the hero — where the
 * intro's card ring settles. It sits still and hidden while the intro plays
 * (its first cards are the landing targets, found by [data-strip-card]),
 * then shows and starts drifting the moment the intro hands over.
 *
 * The list is doubled for a seamless loop; the copy is hidden from assistive
 * tech and the tab order. Hover pauses the drift. Reduced motion: no drift,
 * the strip just scrolls sideways.
 */
export default function HeroStrip() {
  const done = useIntroDone()

  return (
    <div
      className="hero-strip no-scrollbar relative mt-4 overflow-hidden motion-reduce:overflow-x-auto"
      style={{ opacity: done ? 1 : 0 }}
    >
      <ul aria-label="Projects" className="strip-track flex w-max" data-running={done}>
        {[...orderedProjects, ...orderedProjects].map((p, i) => {
          const copy = i >= orderedProjects.length
          return (
            <li key={`${p.slug}-${i}`} aria-hidden={copy || undefined} className="pr-4">
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={copy ? -1 : undefined}
                aria-label={copy ? undefined : `${p.title} (opens in a new tab)`}
                data-strip-card={copy ? undefined : i}
                className={`${miniCardClass} tile-hover`}
              >
                <MiniCardFace project={p} />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
