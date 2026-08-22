import { useId, useState } from 'react'
import type { Screen } from '../../lib/caseStudyImages'
import Placeholder from './Placeholder'
import { cn } from '../../lib/cn'

/**
 * Tabbed viewer for a case study's `screens/` folder. Each tab shows one full
 * page export inside scrollable browser chrome.
 */
export default function ScreensGallery({ screens, title }: { screens: Screen[]; title: string }) {
  const [active, setActive] = useState(0)
  const baseId = useId()

  if (screens.length === 0) {
    return <Placeholder alt={`${title} screens`} framing="scroll" />
  }

  const current = screens[Math.min(active, screens.length - 1)]

  return (
    <div>
      <div
        role="tablist"
        aria-label={`${title} screens`}
        className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {screens.map((s, i) => (
          <button
            key={s.src}
            role="tab"
            id={`${baseId}-tab-${i}`}
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors',
              i === active
                ? 'bg-ink text-canvas'
                : 'border border-line bg-card text-muted hover:text-ink'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
      >
        <Placeholder src={current.src} alt={`${title} — ${current.label}`} framing="scroll" />
      </div>
    </div>
  )
}
