# Yee Mon Thant (Lucy) — Portfolio

Personal site for a junior frontend developer in Bangkok. React 19 + TypeScript + Vite + Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

## Deploying to Vercel

Import the repo; Vercel detects Vite automatically. `vercel.json` adds the SPA
rewrite so `/design/<slug>` resolves on a hard refresh.

## Where to edit things

All content lives in `src/data/` — no component changes needed for routine updates.

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, role, contact, About copy, spoken languages, soft skills |
| `projects.ts` | The dev projects. `featured: true` promotes to a large card — keep that at 3 |
| `caseStudies.ts` | The UI/UX design case studies |
| `stack.ts` | Skills grid and the "Learning next" tile |

The CV lives at `public/yee-mon-thant-cv.pdf` — replace the file to update it.

## Adding case study images

**Images are picked up by filename. No imports, no code changes.**

Drop files into `src/assets/case-studies/<slug>/`, matching the slug in
`caseStudies.ts`:

```
src/assets/case-studies/panae-craft/
  cover.webp              card image in the Design section (4:3 crop)
  hero.webp               wide page banner (21:9) — falls back to cover
  problem.webp            "The problem"        (4:3 crop)
  research.webp           "Research"           (4:3 crop)
  wireframes.webp         "Wireframes"         (fits whole image)
  system.webp             "Design system"      (fits whole image)
  outcome.webp            "Outcome"            (4:3 crop)
  screens/
    01-home.webp          -> tab "Home"
    02-collections.webp   -> tab "Collections"
    03-product-detail.webp-> tab "Product Detail"
```

- `screens/NN-label.ext` becomes the tabbed gallery in the "Final design"
  section. The `NN-` prefix sets tab order; the rest becomes the label. Export
  each page as one tall full-page image — they render in a scrollable browser
  frame, so don't crop them.
- With no `cover`, the first screen is used for the card and banner. A
  `screens/` folder alone is enough to make a case study look complete.
- Missing section images are simply omitted from the page, so a partly-filled
  study still reads as finished.
- `.png`, `.jpg`, `.webp` and `.svg` all work. **Prefer WebP** — the Panae
  Craft exports went from 9.2 MB to 1.4 MB with no visible quality loss:
  ```bash
  cwebp -q 80 -m 6 page.png -o page.webp
  ```

## Promoting a draft case study

Six of the seven studies are marked `draft: true` — they show a "write-up in progress" tag
and a notice banner. To finish one:

1. Replace the placeholder copy in that study's `overrides` in `caseStudies.ts`.
2. Drop its images into the folder above.
3. Set `draft: false`.

## Live embeds — currently OFF

`SHOW_EMBEDS` at the top of `caseStudies.ts` is set to `false`.

Every Figma file and the Google Stitch project are private right now, so a
signed-out visitor would hit a permission wall instead of the design. With the
flag off, the URLs stay in the data but nothing is rendered — the screenshots
carry the section.

To turn them back on:

1. In Figma, per file: **Share → "Anyone with the link"**. The embed works off
   the file's own link sharing, not API access.
2. Set `SHOW_EMBEDS = true`.

Note that **Google Stitch cannot be embedded at all** — it requires a signed-in
Google account and renders blank in an iframe. It uses `sourceUrl` +
`sourceLabel`, which render as a button rather than an iframe, and it will
still be a login wall for anyone without access.

## Notes

- **Dark mode** is class-based. The theme is applied pre-paint by an inline
  script in `index.html`, so there's no cream flash for dark-mode visitors.
  `ThemeToggle.tsx` mirrors the same logic.
- **Reveal animations** run through `useInViewOnce`, which deliberately fails
  *visible* — if IntersectionObserver never fires, content shows anyway rather
  than being stuck at `opacity: 0`.
- **Reduced motion** disables the reveals and Lenis smooth scrolling entirely.
- **The contact form** posts to Web3Forms. The access key in `Contact.tsx` is
  public by design; the honeypot field is what keeps the inbox usable.
- Responsive grids all declare a `grid-cols-1` base. Without it the implicit
  column sizes to content and clips on narrow phones.
