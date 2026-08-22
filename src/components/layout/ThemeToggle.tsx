import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/**
 * The `.dark` class is applied pre-paint by the inline script in index.html;
 * this component only has to stay in sync with it.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      // Private browsing — the toggle still works for this session.
    }
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      className="grid size-10 place-items-center rounded-full border border-line bg-card text-muted transition-colors hover:text-ink"
    >
      {dark ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
    </button>
  )
}
