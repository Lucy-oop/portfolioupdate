import type { Framing } from '../components/ui/Placeholder'
import { coverFor, heroFor, imageFor, screensFor, type Screen } from '../lib/caseStudyImages'

/**
 * UI/UX CASE STUDIES
 * =================================================================
 * IMAGES ARE AUTOMATIC. Drop exports into
 *     src/assets/case-studies/<slug>/<section-id>.png
 * and they appear — no imports, no edits here. Full-page website exports go in
 *     src/assets/case-studies/<slug>/screens/NN-label.png
 * and become the tabbed gallery.
 *
 * TO PROMOTE A DRAFT
 *  1. Replace the placeholder copy in its `overrides`.
 *  2. Drop the images in.
 *  3. Set `draft: false`.
 *
 * FIGMA EMBEDS
 * `figmaEmbed` renders a live pannable file. It works off that file's OWN link
 * sharing — set Share -> "Anyone with the link" in Figma, or visitors get a
 * permission error inside the iframe.
 */

export type SectionId =
  | 'problem'
  | 'research'
  | 'wireframes'
  | 'system'
  | 'final'
  | 'outcome'

export type CaseSection = {
  id: SectionId
  eyebrow: string
  title: string
  body: string[]
  image: string | null
  framing: Framing
}

export type CaseStudy = {
  slug: string
  title: string
  subtitle: string
  year: string
  discipline: string
  role: string
  tools: string[]
  summary: string
  /** A Figma design URL. Renders as a live, pannable iframe. */
  figmaEmbed?: string
  /**
   * A source link that cannot be embedded — Google Stitch, for instance,
   * requires a signed-in Google account and renders blank in an iframe.
   * Shown as a button instead.
   */
  sourceUrl?: string
  sourceLabel?: string
  draft: boolean
  cover: string | null
  hero: string | null
  screens: Screen[]
  sections: CaseSection[]
}

type Override = { title?: string; eyebrow?: string; body?: string[]; framing?: Framing }

const DEFAULT_SECTIONS: { id: SectionId; eyebrow: string; title: string; framing: Framing }[] = [
  { id: 'problem', eyebrow: 'The problem', title: 'What was actually broken', framing: 'crop' },
  { id: 'research', eyebrow: 'Research', title: 'What I looked at first', framing: 'crop' },
  { id: 'wireframes', eyebrow: 'Wireframes', title: 'Cheap enough to throw away', framing: 'contain' },
  { id: 'system', eyebrow: 'Design system', title: 'Tokens before screens', framing: 'contain' },
  { id: 'final', eyebrow: 'Final design', title: 'The screens', framing: 'scroll' },
  { id: 'outcome', eyebrow: 'Outcome', title: 'What I would change', framing: 'crop' },
]

const PLACEHOLDER: Record<SectionId, string[]> = {
  problem: ['Write-up in progress — the problem statement for this project is being written.'],
  research: ['Write-up in progress — competitor teardowns and notes are being written up.'],
  wireframes: ['Write-up in progress — low-fidelity wireframes are being collected.'],
  system: ['Write-up in progress — the type scale and component sheet are being documented.'],
  final: ['Write-up in progress — final screens are being exported.'],
  outcome: ['Write-up in progress — the reflection for this project is being written.'],
}

function build(
  slug: string,
  meta: Omit<CaseStudy, 'cover' | 'hero' | 'screens' | 'sections' | 'slug'>,
  overrides: Partial<Record<SectionId, Override>> = {}
): CaseStudy {
  return {
    slug,
    ...meta,
    cover: coverFor(slug),
    hero: heroFor(slug),
    screens: screensFor(slug),
    sections: DEFAULT_SECTIONS.map((s) => {
      const o = overrides[s.id] ?? {}
      return {
        id: s.id,
        eyebrow: o.eyebrow ?? s.eyebrow,
        title: o.title ?? s.title,
        body: o.body ?? PLACEHOLDER[s.id],
        framing: o.framing ?? s.framing,
        // The `final` section is driven by the screens gallery, not a single file.
        image: s.id === 'final' ? null : imageFor(slug, s.id),
      }
    }),
  }
}


/**
 * Embeds are OFF.
 *
 * All three Figma files and the Google Stitch project are currently private —
 * a signed-out visitor gets a permission wall, not the design. Until link
 * sharing is turned on, the screenshots do the work. Flip this to `true` to
 * bring back the live Figma iframes and the Stitch button.
 */
const SHOW_EMBEDS = false

const embed = (url: string) => (SHOW_EMBEDS ? url : undefined)

export const caseStudies: CaseStudy[] = [
  build(
    'panae-craft',
    {
      title: 'Panae Craft',
      subtitle: 'Pandanus weaving from Ban Duhun, designed for a modern storefront',
      year: '2026',
      discipline: 'Brand · E-commerce web UI',
      role: 'UI/UX design — research, wireframes, design system, five final pages',
      tools: ['Figma', 'Design system', 'Responsive design'],
      summary:
        'A Trang Province artisan collective weaving sun-dried pandanus into bags, baskets and home objects. I designed a five-page storefront where the craft — and the people making it — carry the page.',
      draft: false,
    },
    {
      problem: {
        title: 'Handmade goods, sold like a catalogue',
        body: [
          'Panae Craft is an artisan collective in Ban Duhun, Trang Province. Master weavers turn sun-dried pandanus leaves into handwoven bags, baskets, home décor and lifestyle accessories — ancestral technique, contemporary shapes, every piece slightly different from the last.',
          'The problem is that this reads as generic the moment it is flattened into a product grid. A woven tote at 2,450 THB next to a woven tote at 1,900 THB is a price comparison. Nothing on the page explains why either one costs that, or that a named person in a named village made it by hand.',
          'The brief was a storefront that sells the craft rather than the SKU: room for the material, the technique and the community, without turning the shop into an essay.',
        ],
      },
      research: {
        title: 'How craft brands sell online, and where they lose',
        body: [
          'I pulled apart small handmade storefronts alongside larger craft marketplaces, and the split was consistent. Marketplaces optimise for density — grids of small thumbnails, heavy filter rails, everything competing for the same glance. Independent brands do the opposite: fewer products per screen, much larger photography, and a story section doing real commercial work.',
          'Panae Craft is firmly the second kind. The catalogue is around twelve pieces and the margin comes from provenance, so borrowing marketplace density would have actively worked against it.',
          'The other consistent finding: on every storefront that convinced me, the About page was not a footer afterthought. It was where the decision to trust the seller actually happened. So I planned it as a first-class page and pulled a fragment of it — the artisan panel — directly into the Collections sidebar, where the buyer is comparing prices and most needs the context.',
        ],
      },
      wireframes: {
        title: 'Five pages, settled at low fidelity first',
        body: [
          'I sketched the whole set before opening a single high-fidelity frame: Home, Collections, Product Detail, About Us, Contact Us.',
          'Collections took the most iterations. The filter rail (categories, materials, collections) and a 3-up product grid fought each other at tablet width — the grid dropped to two columns while the rail still ate a third of the screen. Resolving it as a rail that collapses into a sheet below the breakpoint, rather than shrinking in place, made the responsive behaviour a decision instead of a patch.',
          'Product Detail had the same lesson in miniature: the gallery and buy panel sat side by side at every width in early sketches, and fell apart on mobile.',
        ],
      },
      system: {
        title: 'Type scale and spacing before any screen was final',
        body: [
          'I set the type scale, spacing rhythm and component states — buttons, cards, filter controls, form fields, the nav — as Figma styles before finishing any page. It is the step that makes five pages read as one site rather than five separate designs.',
          'The palette stays deliberately quiet: a deep indigo drawn from the dyed pandanus, warm neutrals, and almost nothing else. The weave is already pattern-dense and high-contrast, so any decorative colour in the interface would have competed with the product photography instead of framing it.',
        ],
      },
      final: {
        title: 'Five pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. Home opens on the material and the province; Collections is the filterable catalogue with the artisan panel held in the sidebar; Product Detail carries the gallery, the price in THB and the provenance; About Us tells the Ban Duhun story; Contact Us closes the loop.',
        ],
      },
      outcome: {
        title: 'What I would change',
        body: [
          'The design does what it set out to do. Provenance is present at the moment of comparison rather than buried a page away, and the photography has enough room to carry the material.',
          'What I would change: I designed the desktop frames first and adapted downward, and I could feel it in Collections. Starting at the narrowest width would have surfaced the filter-rail problem in the first hour instead of the third round.',
          'I would also want it in front of five real buyers before calling it finished. Right now the flow is reasoned about, not tested — and that is a genuine difference, not a modest disclaimer.',
        ],
      },
    }
  ),

  build('kith-craft', {
    title: 'Kith Craft',
    subtitle: 'Upcycled leather and Thai craftsmanship',
    year: '2026',
    discipline: 'Brand · E-commerce web UI',
    role: 'UI/UX design',
    tools: ['Figma'],
    summary:
      'An artisanal Thai bag brand working in upcycled genuine leather and hand embroidery. Editorial home page with a bilingual EN/TH shell, built to sit in front of an existing Facebook order flow.',
    figmaEmbed: embed(
      'https://www.figma.com/design/Rye2uGadaoPcQqHeqR1QM1/Untitled?node-id=0-1'
    ),
    draft: true,
  }),

  build('restyle', {
    title: 'ReStyle',
    subtitle: 'Modern tailoring, sold like an editorial',
    year: '2026',
    discipline: 'Brand · E-commerce web UI',
    role: 'UI/UX design',
    tools: ['Figma'],
    summary:
      'A city-inspired clothing label. Monochrome editorial storefront with a behind-the-scenes video panel and the trust row — shipping, quality, support, checkout — pulled up to the fold.',
    figmaEmbed: embed(
      'https://www.figma.com/design/lO95TnM0xsXyoWGT7g0oAy/Untitled?node-id=0-1'
    ),
    draft: true,
  }),

  build('wan-mai', {
    title: 'Wan Mai',
    subtitle: 'A social enterprise marketplace across Myanmar and Thailand',
    year: '2026',
    discipline: 'Social enterprise · Marketplace UI',
    role: 'UI/UX design',
    tools: ['Figma'],
    summary:
      'Nurturing women-led small businesses through a community-driven marketplace. The design leads with the artisans rather than the products — Shop, Meet Our Artisans, Impact and Workshops all sit at the top level.',
    figmaEmbed: embed(
      'https://www.figma.com/design/fFxsFlGOdr89Zpm7Gr6twk/Untitled?node-id=3-701'
    ),
    draft: true,
  }),

  build('smart-menu', {
    title: 'Smart Shop',
    subtitle: 'A QR menu builder for restaurants, in Burmese and English',
    year: '2026',
    discipline: 'Product UI · SaaS',
    role: 'UI/UX design',
    tools: ['Figma', 'Stitch'],
    summary:
      'A menu-maker product for Myanmar restaurants: pick a template, build the menu, print the QR. Bilingual by default rather than as an afterthought, with auto QR sync so a printed code never goes stale.',
    draft: true,
  }),

  build('scale-up-solution', {
    title: 'ScaleUp Solution',
    subtitle: 'Digital growth and AI visibility studio',
    year: '2026',
    discipline: 'Product UI · Marketing site',
    role: 'UI/UX design',
    tools: ['Stitch', 'Figma'],
    summary:
      'A studio selling custom web development, AI search optimisation and automated workflows across Thailand, Myanmar and Singapore. Designed in Google Stitch.',
    sourceUrl: embed('https://stitch.withgoogle.com/projects/9275009312831750600'),
    sourceLabel: 'Open in Google Stitch',
    draft: true,
  }),

  build('too-fast-to-sleep', {
    title: 'Too Fast To Sleep',
    subtitle: 'Bangkok’s original 24-hour café and co-working space',
    year: '2026',
    discipline: 'Hospitality · Web UI',
    role: 'UI/UX design',
    tools: ['Figma'],
    summary:
      'Designed for the decision made at 2am: is it open, can I get a seat, where is it. Verified opening hours, plug count and transit directions are answered above the fold, before anything else.',
    draft: true,
  }),
]

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug)
