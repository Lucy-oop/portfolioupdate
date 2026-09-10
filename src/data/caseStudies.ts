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
 * Embeds are ON.
 *
 * Every `figmaEmbed` below renders a live, pannable iframe plus an "Open in
 * Figma" link. This works off each FILE's own link sharing — set Share ->
 * "Anyone with the link" -> "can view" on each one, or a signed-out visitor
 * gets a permission wall instead of the design.
 *
 * Flip this to `false` to fall back to the screenshots alone.
 */
const SHOW_EMBEDS = true

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
      figmaEmbed: embed(
        'https://www.figma.com/design/yu9PBVH12fAyblWP4CucTe/Client-Web-Projects-2026?node-id=0-1'
      ),
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

  build(
    'kith-craft',
    {
      title: 'Kith Craft',
      subtitle: 'Upcycled leather and Thai craftsmanship',
      year: '2026',
      discipline: 'Brand · E-commerce web UI',
      role: 'UI/UX design — four final pages',
      tools: ['Figma'],
      summary:
        'A responsive e-commerce web design for a modern sustainable brand. Focused on high-converting product pages, clean navigation, and compelling brand storytelling to position upcycled fashion as modern luxury.',
      draft: false,
    },
    {
      final: {
        title: 'Four pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. The structural decision is that there is no cart: an EN/TH toggle and a persistent "Order on Facebook" button sit in the header, and every section closes into that same button. The brand already sells through Facebook, so the site was designed to feed that flow rather than to replace it with a checkout nobody would maintain.',
          'Home runs the brand line, the four collection tiles, a Thai-led style lookbook, the Upcycled Leather Collection panel, and a Crafted with Purpose section that leans on the OTOP and SACIT certifications as the trust signal a Thai buyer recognises. Our Collection is the filterable catalogue — five category chips, colourway swatches on each card, pagination across three pages.',
          'Kith Story carries the heritage and community argument, and Contact Us splits into store location, office location, general contact and Apply for Work, which is the page acknowledging that an artisan collective recruits as much as it sells. Support content is handled as four FAQ tiles — material, shipping, order and pay, returns — so the questions that block a Facebook order get answered before the buyer has to ask.',
        ],
      },
    }
  ),

  build(
    'amara',
    {
      title: 'Amara',
      subtitle: 'Handwoven bags from recycled plastic, sold as modern luxury',
      year: '2026',
      discipline: 'Brand · E-commerce web UI',
      role: 'UI/UX design — four final pages',
      tools: ['Figma'],
      summary:
        'A luxury e-commerce concept for handwoven bags made from 100% recycled plastic. A bilingual EN/TH layout treats the sustainability claim as the selling point rather than a disclaimer, and prices accessible luxury from 490 baht.',
      figmaEmbed: embed(
        'https://www.figma.com/design/xi8MxJzV5APGDxR52x2kKc/Untitled?node-id=0-1'
      ),
      draft: false,
    },
    {
      final: {
        title: 'Four pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. The bilingual handling is the quiet decision across all four: Thai sits directly beneath the English as a second voice in the same block, never behind a toggle, so the eco claim and the price land in whichever language the reader trusts.',
          'Home makes the argument in three claims — 100% recycled plastics, handmade Thai heritage, accessible luxury from 490 baht — laid out as an editorial collage rather than a feature list, so the material reads as a design choice instead of a compromise. Collection is the catalogue: a dark architectural hero, free-shipping and starting-price badges, then nine bags with colourway swatches and pagination.',
          'AMARA Story is the manifesto page — Turning Plastic Waste into Timeless Thai Craftsmanship, the four core pillars, and the stockist row across Bangkok, Pattaya, Samui and Phuket. Contact keeps the channels a Thai buyer actually uses: phone, LINE Official and email as Direct Channels on one side, a typed inquiry form on the other.',
        ],
      },
    }
  ),

  build(
    'restyle',
    {
      title: 'ReStyle',
      subtitle: 'Modern tailoring, sold like an editorial',
      year: '2026',
      discipline: 'Brand · E-commerce web UI',
      role: 'UI/UX design — five final pages',
      tools: ['Figma'],
      summary:
        'A city-inspired menswear label selling meticulously restored garments as contemporary tailoring. Five pages of monochrome editorial, with a behind-the-seams video panel and the trust row — shipping, quality, support, checkout — pulled up to the fold.',
      figmaEmbed: embed(
        'https://www.figma.com/design/lO95TnM0xsXyoWGT7g0oAy/Untitled?node-id=0-1'
      ),
      draft: false,
    },
    {
      problem: {
        body: [
          'Users struggle to visualize how upcycled clothing fits into their daily wardrobe, leading to low conversion rates for sustainable fashion items.',
        ],
      },
      research: {
        body: [
          'Feedback showed buyers care deeply about garment origins and fabric details, but felt overwhelmed by long text descriptions.',
        ],
      },
      wireframes: {
        body: [
          'Standardized layout components to put full-length imagery first, placing sustainability metrics directly below the main product view.',
        ],
      },
      system: {
        body: [
          'Applied clean neutral tones with high-contrast typography to keep focus on garment textures and eco-credentials.',
        ],
      },
      outcome: {
        title: 'What the design achieves',
        body: [
          'Created a clear shopping flow that highlights fabric origins instantly, making sustainable choices feel simple and engaging.',
        ],
      },
      final: {
        title: 'Five pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. Home opens on a single editorial hero — "Define your style." — with the Behind the Seams video panel beside it, then drops into the trust row and the product categories before any pricing appears.',
          'Collections is the catalogue: five filter chips across Tailored Outerwear, Oversized Shirts, Wide Trousers and Knitwear, with Sold Out, New and Restocked badges carried on the card itself so availability is legible without a click. Product Detail pairs the gallery with the buy panel — colour, size and size guide, Add to Bag, Add to Wishlist — and holds the Product Philosophy and Atelier Care copy in accordions underneath, so provenance is available without pushing the price below the fold.',
          'About Us does the persuading: the founding story, the numbers, customer testimonials, and a Book a Consultation close. Contact Us answers the logistics — atelier address on an embedded map, direct email, concierge line, the enquiry form, and a four-column FAQ for everything the form would otherwise absorb.',
        ],
      },
    }
  ),

  build(
    'wan-mai',
    {
      title: 'Wan Mai',
      subtitle: 'A social enterprise marketplace across Myanmar and Thailand',
      year: '2026',
      discipline: 'Social enterprise · Marketplace UI',
      role: 'UI/UX design — four final pages',
      tools: ['Figma'],
      summary:
        'Nurturing women-led small businesses through a community-driven marketplace. The design leads with the artisans rather than the products — Shop, Meet Our Artisans, Impact and Workshops all sit at the top level.',
      figmaEmbed: embed(
        'https://www.figma.com/design/fFxsFlGOdr89Zpm7Gr6twk/Untitled?node-id=0-1'
      ),
      draft: false,
    },
    {
      problem: {
        body: [
          'The platform failed to tell the story of the individual artisans behind each product, making the store feel generic rather than craft-focused.',
        ],
      },
      research: {
        body: [
          'Shoppers were significantly more likely to buy when they knew who made the item and saw direct impact proof.',
        ],
      },
      wireframes: {
        body: [
          'Rebuilt card components to highlight artisan attributions (by <maker>) across shop grids and dedicated story pages.',
        ],
      },
      system: {
        body: [
          'Warm earth-toned palette with clean modern sans-serif headings to reflect hand-crafted authenticity.',
        ],
      },
      outcome: {
        title: 'What the design achieves',
        body: [
          'Increased artisan visibility on every product card, establishing a direct emotional link between buyers and makers.',
        ],
      },
      final: {
        title: 'Four pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. Home opens on "Empowering dreams. Bridging borders." and then puts the makers before the merchandise — a collective-partners collage, the curated product row, and a full artisan feature on Ju Ju before the page asks for anything. Every product card carries a "by <maker>" line under the title, so attribution rides along with the price rather than living on a separate page.',
          'Shop is the catalogue: category tiles across accessories, bags, crochet, décor, eco-print, self-care, fabric and stationery, then seven filter chips, a product count and a price sort. Meet Our Artisans is the same catalogue logic applied to people — partner cards tagged Heritage, Eco-Action or Empowerment, each with a Read Story / Shop Collection split, and an "Are You an Artisan?" recruitment card sitting inline in the grid rather than buried in a footer.',
          'Impact is the page that has to carry the claims without becoming a brochure. Three headline figures sit above four "How We Measure Change" cards that each name their own evidence — income parity, waste tonnage tracking, heritage badges awarded, a contribution calculator — then Advocacy Beyond the Storefront states the ethical charter, and Impact in Motion closes with the real stories behind the data points.',
        ],
      },
    }
  ),

  build(
    'smart-menu',
    {
      title: 'Smart Shop',
      subtitle: 'A QR menu builder for restaurants, in Burmese and English',
      year: '2026',
      discipline: 'Product UI · SaaS',
      role: 'UI/UX design — four marketing pages and the diner-facing menu',
      tools: ['Figma', 'Stitch'],
      summary:
        'A menu-maker product for Myanmar restaurants: pick a template, build the menu, print the QR. Bilingual by default rather than as an afterthought, with auto QR sync so a printed code never goes stale.',
      figmaEmbed: embed(
        'https://www.figma.com/design/UOqswbVJROUNtc86fSgNsu/Untitled?node-id=0-1'
      ),
      draft: false,
    },
    {
      problem: {
        body: [
          'Business owners found it difficult to pair physical in-store displays with digital product catalogs and instant payment options.',
        ],
      },
      research: {
        body: [
          'Store managers wanted a friction-free way for customers to scan items in-store and pay on their phones without staff help.',
        ],
      },
      wireframes: {
        body: [
          'Created a dual-purpose navigation layout featuring prominent QR code generation and quick-buy checkout steps.',
        ],
      },
      system: {
        body: [
          'High-visibility primary colors and bold status badges designed for fast legibility on mobile screens in full daylight.',
        ],
      },
      outcome: {
        title: 'What the design achieves',
        body: [
          'Delivered a unified QR-to-checkout flow that syncs inventory and pricing across physical and digital storefronts.',
        ],
      },
      final: {
        title: 'Four marketing pages, and the thing being sold',
        body: [
          'Each page below is the full-length export, scrollable in place. The bilingual decision is visible in every one of them: Burmese and English sit in the same heading block rather than behind a language switch, because the buyer is a Myanmar shop owner and the diner may be a tourist. Home runs hero → three product tiers → industries → How it works → template picker → testimonials → FAQ, and the desktop mockup carries the Auto QR Sync callout that the whole product rests on.',
          'The QR Code page is the argument, laid out as an explicit Problem/Solution pair — language barriers, Burmese-only menus, guests who cannot read the ingredients, ordering mistakes on one side; instant scanning with no app, machine translation, photos and direct phone ordering on the other. Pricing is in MMK with a monthly/annual toggle and a "not sure which plan" escape hatch beside the tiers, then an enterprise lane for 10–200+ locations. Resources sells the operations story: one central hub syncing four channels, the cost of fragmented menus, and digital signage controlled at scale.',
          'The last screen is the product itself rather than a page about it — the diner-facing mobile menu, with search, a dietary and allergens filter, category tabs and an Ask AI button on the item card. It is the only screen where the customer, not the shop owner, is the user, which is why it is worth showing next to the marketing site.',
        ],
      },
    }
  ),

  build(
    'scale-up-solution',
    {
      title: 'ScaleUp Solution',
      subtitle: 'Digital growth and AI visibility studio',
      year: '2026',
      discipline: 'Product UI · Marketing site',
      role: 'UI/UX design — four final pages',
      tools: ['Stitch', 'Figma'],
      summary:
        'A studio selling custom web development, AI search optimisation and automated workflows across Thailand, Myanmar and Singapore. Designed in Google Stitch, then rebuilt in Figma.',
      figmaEmbed: embed(
        'https://www.figma.com/design/E6khcSmkd9nArlnr59pHdC/Untitled?node-id=0-25'
      ),
      sourceUrl: embed('https://stitch.withgoogle.com/projects/9275009312831750600'),
      sourceLabel: 'Open in Google Stitch',
      draft: false,
    },
    {
      problem: {
        body: [
          'Potential clients found service offerings confusing and abandoned the contact funnel before submitting project inquiries.',
        ],
      },
      research: {
        body: [
          'Visitors dropped off because intake forms asked for too much technical detail upfront instead of focusing on project goals.',
        ],
      },
      wireframes: {
        body: [
          'Restructured the site navigation around service categories and simplified the project intake into a quick 3-step form.',
        ],
      },
      system: {
        body: [
          'Clean light mode layout with high-contrast accent bands and subtle floating navigation capsules for quick section switching.',
        ],
      },
      outcome: {
        title: 'What the design achieves',
        body: [
          'Streamlined service navigation and intake, making it easier for potential clients to request accurate proposals quickly.',
        ],
      },
      final: {
        title: 'Four pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. A floating navigation capsule rides above all four, and the active item is a filled pill inside it — the one component that has to stay legible over a white hero, a dark hero and a photograph, which is why it went through the most passes.',
          'Home is the studio pitch: the positioning line, the credibility row (10+ years, 80+ projects, 98% satisfaction, three regional markets), six service cards, transparent pricing in baht, a six-step process and the industries served. Service re-enters the same material at depth — a portfolio strip, the mission statement, then Website Strategy, UI/UX and Development each given their own alternating section, with the pricing table repeated near the bottom where the reader is closer to deciding.',
          'Website Development is the most technical page and the one that has to prove capability rather than assert it: a Lighthouse/SEO/CLS metric row, four capability cards, a named engineering stack across frontend, backend and deployment, a four-step protocol, then an Initiate Project form that asks for budget and timeline up front. Contact keeps only what qualifies a lead — a 24-hour response promise, the same budget and timeline selects, and a three-question FAQ.',
        ],
      },
    }
  ),

  build(
    'too-fast-to-sleep',
    {
      title: 'Too Fast To Sleep',
      subtitle: 'Bangkok’s original 24-hour café and co-working space',
      year: '2026',
      discipline: 'Hospitality · Web UI',
      role: 'UI/UX design — four final pages',
      tools: ['Figma'],
      summary:
        'Designed for the decision made at 2am: is it open, can I get a seat, where is it. Verified opening hours, plug count and transit directions are answered above the fold, before anything else.',
      figmaEmbed: embed(
        'https://www.figma.com/design/YyGxFnXJS0tHeihRdoTZiF/Too-Fast-To-Sleep?node-id=0-1'
      ),
      draft: false,
    },
    {
      problem: {
        body: [
          'Customers could not easily check real-time seating availability or find quiet study spots across multiple cafe locations.',
        ],
      },
      research: {
        body: [
          "Guests frequently arrived at full capacity because the website didn't show spatial zones or busy hours.",
        ],
      },
      wireframes: {
        body: [
          'Designed an interactive space guide featuring six named seating zones, spatial zone previews and a direct Book-via-LINE flow.',
        ],
      },
      system: {
        body: [
          'Deep navy blues and soft warm lighting accents mirroring the late-night cafe environment.',
        ],
      },
      outcome: {
        title: 'What the design achieves',
        body: [
          'Allowed customers to preview specific seating zones and locations before visiting, reducing crowding at peak hours.',
        ],
      },
      final: {
        title: 'Four pages, full length',
        body: [
          'Each page below is the full-length export, scrollable in place. Home answers the 2am questions in order and then stops: a "Verified 24 Hours Open · 100+ Plugs Available" badge sits above the headline, directions are a primary button next to it, and the three cards under the hero are opening hours, community size and rating rather than marketing copy. Booking runs through LINE, which is where this audience already is, so the CTA says so instead of promising an app.',
          'Spaces is the "can I get a seat" page, and it resolves seating into six named zones — Main Study Hall, Chamber of Secrets, Floor Seating, Café Counter, Greenhouse Lounge, Ground Floor Dining — each tagged with what actually decides it: 24/7 access, bookable, private, no booking, daylight, full meals. The full menu with baht prices sits on the same page, because at 3am "is the kitchen open" is part of the same decision.',
          'Locations carries the flagship transit guide plus a branch grid — Rama IV, Siam Square, SWU, Surawong — each with its own hours, quirks and a Directions link, and a Need to Know card for the two things that vary by branch: private room availability and whether cash is accepted. About Us is the only page allowed to be slow, telling the origin story and the philosophy behind zero barriers, library-quiet balance and a power outlet at every seat.',
        ],
      },
    }
  ),
]

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug)
