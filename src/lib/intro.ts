import { useEffect, useState } from 'react'

/**
 * Above-the-fold entrance: true one frame after mount, so CSS transitions
 * keyed on it always have a "before" state to animate from.
 */
export function useIntroReveal() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return shown
}
