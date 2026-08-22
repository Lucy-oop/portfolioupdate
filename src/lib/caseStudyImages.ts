/**
 * CASE STUDY IMAGE PIPELINE
 * =================================================================
 * Images are resolved by *filename convention*, so adding artwork to a case
 * study never requires touching a component or writing an import.
 *
 *   src/assets/case-studies/<slug>/<section-id>.png   -> that section's image
 *   src/assets/case-studies/<slug>/screens/NN-name.png -> tabbed gallery
 *
 * The `NN-` prefix sets tab order and is stripped from the label, so
 * `03-product-detail.png` renders as the tab "Product Detail".
 *
 * Anything missing renders a dashed Placeholder rather than breaking layout.
 */

const sectionModules = import.meta.glob('../assets/case-studies/*/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const screenModules = import.meta.glob('../assets/case-studies/*/screens/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const imagesBySlug: Record<string, Record<string, string>> = {}
for (const [path, url] of Object.entries(sectionModules)) {
  const match = path.match(/case-studies\/([^/]+)\/([^/]+)\.[^.]+$/)
  if (!match) continue
  const [, slug, name] = match
  ;(imagesBySlug[slug] ??= {})[name] = url
}

export type Screen = { label: string; src: string }

const toLabel = (filename: string) =>
  filename
    .replace(/^\d+[-_]?/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Screen'

const screensBySlug: Record<string, (Screen & { sortKey: string })[]> = {}
for (const [path, url] of Object.entries(screenModules)) {
  const match = path.match(/case-studies\/([^/]+)\/screens\/([^/]+)\.[^.]+$/)
  if (!match) continue
  const [, slug, filename] = match
  ;(screensBySlug[slug] ??= []).push({ sortKey: filename, label: toLabel(filename), src: url })
}
for (const list of Object.values(screensBySlug)) {
  list.sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'en', { numeric: true }))
}

/** Image for one named slot (`cover`, `hero`, `problem`, …), or null. */
export const imageFor = (slug: string, name: string): string | null =>
  imagesBySlug[slug]?.[name] ?? null

export const screensFor = (slug: string): Screen[] =>
  (screensBySlug[slug] ?? []).map(({ label, src }) => ({ label, src }))

/**
 * Card/banner image. Falls back to the first screen, so a `screens/` folder
 * alone is enough to make a case study look finished.
 */
export const coverFor = (slug: string): string | null =>
  imageFor(slug, 'cover') ?? screensFor(slug)[0]?.src ?? null

export const heroFor = (slug: string): string | null => imageFor(slug, 'hero') ?? coverFor(slug)
