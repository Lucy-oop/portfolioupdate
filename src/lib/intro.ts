import { useEffect, useState, useSyncExternalStore } from 'react'

/**
 * Where the first-visit intro (layout/Preloader.tsx) has got to:
 *
 *   'playing'  the card ring is spinning; the page waits underneath
 *   'opening'  the ring is unrolling and the overlay dissolves, so the
 *              hero container fades in behind the cards
 *   'done'     the cards have landed on the hero strip; the nav and the
 *              headline make their entrance
 *
 * Defaults to 'done', so a page without the intro never waits on anything.
 * The preloader sets 'playing' during its first render, before the hero and
 * nav render.
 */
export type IntroStage = 'playing' | 'opening' | 'done'
const order: Record<IntroStage, number> = { playing: 0, opening: 1, done: 2 }

let stage: IntroStage = 'done'
const listeners = new Set<() => void>()

function set(next: IntroStage) {
  if (stage === next) return
  stage = next
  listeners.forEach((l) => l())
}

export const intro = {
  begin: () => set('playing'),
  open: () => set('opening'),
  finish: () => set('done'),
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useIntroStage() {
  return useSyncExternalStore(subscribe, () => stage, () => 'done' as IntroStage)
}

/** True once the intro has handed over completely. */
export function useIntroDone() {
  return useIntroStage() === 'done'
}

/**
 * True one frame after the intro reaches `at` (or after mount, without an
 * intro), so CSS transitions keyed on it always have a "before" to animate from.
 */
export function useIntroReveal(at: Exclude<IntroStage, 'playing'> = 'done') {
  const reached = order[useIntroStage()] >= order[at]
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!reached) return
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [reached])
  return shown
}
