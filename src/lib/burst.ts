/**
 * A one-off burst of particles in the site's three colours from a point on
 * screen — the "sent!" moment on the contact form. Draws on a temporary
 * canvas that removes itself when the last particle fades. Callers skip it
 * for reduced motion.
 */
export function burst(x: number, y: number, count = 42) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '95',
  })
  document.body.appendChild(canvas)
  ctx.scale(dpr, dpr)

  const cs = getComputedStyle(document.documentElement)
  const colors = ['--color-lilac', '--color-peach', '--color-mint'].map((v) => cs.getPropertyValue(v).trim())
  const parts = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2
    const v = 140 + Math.random() * 320
    return {
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 160,
      life: 0.8 + Math.random() * 0.6,
      age: 0,
      len: 4 + Math.random() * 6,
      color: colors[(Math.random() * colors.length) | 0],
    }
  })

  let last = performance.now()
  const tick = (now: number) => {
    const dt = Math.min(now - last, 50) / 1000
    last = now
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    let alive = 0
    ctx.lineCap = 'round'
    ctx.lineWidth = 2
    for (const p of parts) {
      p.age += dt
      if (p.age >= p.life) continue
      alive++
      p.vx *= 0.97
      p.vy = p.vy * 0.97 + 520 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      // Dashes, like the halo: each points along its direction of travel.
      const sp = Math.hypot(p.vx, p.vy) || 1
      ctx.globalAlpha = 1 - p.age / p.life
      ctx.strokeStyle = p.color
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x - (p.vx / sp) * p.len, p.y - (p.vy / sp) * p.len)
      ctx.stroke()
    }
    if (alive) requestAnimationFrame(tick)
    else canvas.remove()
  }
  requestAnimationFrame(tick)
}
