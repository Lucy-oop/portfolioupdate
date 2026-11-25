import mingalar from '../assets/work/mingalardelivery.webp'
import quickbook from '../assets/work/quickbook.webp'
import logvault from '../assets/work/logvault.webp'
import lucyAi from '../assets/work/lucyAi.webp'
import htweOo from '../assets/work/htwe-oo.webp'
import nexus from '../assets/work/nexus.webp'
import trinkora from '../assets/work/trinkora.webp'
import ecommerce from '../assets/work/ecommerce.webp'
import myflix from '../assets/work/myflix.webp'
import goldenGoat from '../assets/work/goldengoat.webp'
import lifeos from '../assets/work/lifeos.webp'
import wanmai from '../assets/work/wanmai.webp'
import cavernResort from '../assets/work/cavern-resort.webp'
import csNorth from '../assets/work/cs-north.webp'
import myanmarForb from '../assets/work/myanmar-forb.webp'
import nayEngineering from '../assets/work/nay-engineering.webp'
import youthStrength from '../assets/work/youth-strength.webp'
import jenaShipping from '../assets/work/jena-shipping.webp'
import nineStar from '../assets/work/ninestar.webp'

export type Category = 'fullstack' | 'frontend' | 'design'

export const categoryLabels: Record<Category, string> = {
  fullstack: 'Full-stack',
  frontend: 'Frontend',
  design: 'UI/UX',
}

export type Project = {
  slug: string
  /** Drives the Work filters. A project can sit under more than one. */
  categories: Category[]
  title: string
  year: string
  role: string
  blurb: string
  stack: string[]
  href: string
  img: string
  /** Promotes into the three large cards. Keep this at exactly 3. */
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: 'cavern-resort',
    categories: ['design', 'frontend'],
    title: 'Cavern Island Resort',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A resort site for 25 rooms between jungle and sea on Hlaing Gu Island in the Mergui Archipelago — a full-screen photo slider, rooms, sea-cave experiences, dining and getting-here guides, in English, Burmese, Thai and Chinese.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    href: 'https://lucy-oop.github.io/Cavern-Resort/',
    img: cavernResort,
    featured: true,
  },
  {
    slug: 'jena-shipping',
    categories: ['fullstack', 'design'],
    title: 'Jena Shipping',
    year: '2026',
    role: 'Full-stack build',
    blurb:
      'A crewing and maritime-training site for a Yangon agency that places Myanmar seafarers with international shipowners — a multi-step crew application validated with zod, server actions writing to Supabase with a private document bucket, and GSAP/Lenis motion throughout.',
    stack: ['Next.js 15', 'Tailwind v4', 'Supabase', 'GSAP'],
    href: 'https://lucy-oop.github.io/Jena-Shipping/',
    img: jenaShipping,
    featured: true,
  },
  {
    slug: 'lifeos',
    categories: ['fullstack'],
    title: 'LifeOS',
    year: '2026',
    role: 'Solo build — design, frontend + backend',
    blurb:
      'A privacy-first personal dashboard shipped as a lightweight, installable PWA — tasks, focus sessions, goals and notes synced live across devices through Cloud Firestore, with a vault that is encrypted on the client before anything leaves the browser. Firebase Authentication for accounts, Firebase Hosting for delivery, and no framework overhead.',
    stack: ['Vanilla JS', 'Vite', 'Firebase Auth', 'Cloud Firestore'],
    href: 'https://lifeos-cec7a.web.app/',
    img: lifeos,
    featured: true,
  },
  {
    slug: 'nine-star',
    categories: ['design', 'frontend'],
    title: 'Nine Star',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'An online shop bringing Myanmar pantry staples to Japan — ten categories, product pages and a browser-stored cart that sends a pre-filled order enquiry by email, with all products and prices editable from one data file.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Python'],
    href: 'https://lucy-oop.github.io/NineStar/',
    img: nineStar,
  },
  {
    slug: 'nay-engineering',
    categories: ['design', 'frontend'],
    title: 'Nay Engineering',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A site for a Singapore steel-structure, piping and construction firm — five services, filterable projects with a photo gallery, and a shared header, footer and carousel all built from one data file.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    href: 'https://lucy-oop.github.io/Nay-Engineering/',
    img: nayEngineering,
  },
  {
    slug: 'golden-goat-myanmar',
    categories: ['fullstack'],
    title: 'Golden G.O.A.T Myanmar',
    year: '2026',
    role: 'Full-stack build',
    blurb:
      'A brand site for a family juice business born at the foot of Mount Popa — natural juices from Myanmar’s volcanic dry zone, no added cane sugar and no preservatives. Trilingual throughout in English, Chinese and Burmese, with a distributor “Join with us” flow and the brand story told through market stalls and trade fairs.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS'],
    href: 'https://lucy-oop.github.io/Golden-Goat-Myanmar/',
    img: goldenGoat,
  },
  {
    slug: 'mingalar-express',
    categories: ['fullstack'],
    title: 'Mingalar Express',
    year: '2026',
    role: 'Full-stack + geospatial dispatch',
    blurb:
      'A hyper-local delivery and cash-on-delivery platform for Thingangyun Township, Yangon — row-locked route dispatch, an offline-first rider PWA that queues every state change before it sends, and an append-only COD ledger settled in integer MMK. Bilingual throughout.',
    stack: ['Next.js 16', 'Supabase', 'PostGIS', 'Leaflet'],
    href: 'https://mingalar-express.vercel.app',
    img: mingalar,
  },
  {
    slug: 'myanmar-forb-network',
    categories: ['design', 'frontend'],
    title: 'Myanmar FoRB Network',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A five-page site for a network defending freedom of religion or belief in Myanmar — violation figures that count up from one data file, an inline SVG map, filterable insights, a six-colour page-transition curtain and scroll reveals that all switch off for reduced motion.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Python'],
    href: 'https://lucy-oop.github.io/Myanmar-ForB-Network/',
    img: myanmarForb,
  },
  {
    slug: 'cs-north-engineering',
    categories: ['design', 'frontend'],
    title: 'CS North Engineering',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A site for a Singapore building-management-system specialist — BMS, SCADA and PLC services, a projects showcase, and quote and WhatsApp contact paths.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Python'],
    href: 'https://lucy-oop.github.io/CS-North-Engineering/',
    img: csNorth,
  },
  {
    slug: 'youth-strength-association',
    categories: ['design', 'frontend'],
    title: 'Youth Strength Association',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A bilingual site for a community organisation empowering youth and women in Kyauk Phyu, Rakhine State, since 2014 — education, livelihood and emergency-relief programmes in an autoplaying story slider, with clear ways to support.',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    href: 'https://lucy-oop.github.io/Youthstrengthassociation/',
    img: youthStrength,
  },
  {
    slug: 'htwe-oo-myanmar',
    categories: ['design', 'frontend'],
    title: 'Htwe Oo Myanmar',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A landing site for a family-run Burmese marionette theatre touring out of Phnom Penh and Bangkok — a scroll-driven hero, a heritage timeline running from the Yangon home theatre to the UNIMA Meschke prize and the Milan showcase, and a seat-reservation flow for the weekly Sunday show. Designed in Google Flow and Stitch, then built by hand.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'React Router'],
    href: 'https://lucy-oop.github.io/Htwe-Oo-Myanmar/',
    img: htweOo,
  },
  {
    slug: 'quickbook',
    categories: ['fullstack'],
    title: 'Quickbook',
    year: '2026',
    role: 'Full-stack + database design',
    blurb:
      'A multi-tenant ERP, POS and accounting system for Myanmar businesses — tenant isolation enforced in Postgres row-level security, six roles, per-tenant custom fields and MMK/THB/USD reporting, all bilingual.',
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL RLS'],
    href: 'https://quickbook-one.vercel.app/',
    img: quickbook,
  },
  {
    slug: 'wan-mai',
    categories: ['design', 'frontend'],
    title: 'WanMai',
    year: '2026',
    role: 'UI/UX design, frontend, network testing + debugging',
    blurb:
      'A social enterprise marketplace for women-led small businesses across Myanmar and Thailand. I designed the UI, built the frontend, and handled network testing and error fixing — the design leads with the artisans rather than the products, with Shop, Meet Our Artisans and Impact all at the top level.',
    stack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    href: 'https://wan-mai.onrender.com/',
    img: wanmai,
  },
  {
    slug: 'log-vault',
    categories: ['fullstack'],
    title: 'Log Vault',
    year: '2026',
    role: 'Full-stack build',
    blurb:
      'A logging and audit-trail dashboard with typed queries, filtered views and persistent storage.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    href: 'https://log-vault.vercel.app',
    img: logvault,
  },
  {
    slug: 'portfolio-ai-assistant',
    categories: ['frontend'],
    title: 'Portfolio AI Assistant',
    year: '2026',
    role: 'Frontend + API integration',
    blurb:
      'A conversational agent that answers questions about my work, streaming responses from the Gemini API.',
    stack: ['React', 'TypeScript', 'Gemini API', 'Tailwind CSS'],
    href: 'https://ai-portfolio-chatbot-cyan.vercel.app',
    img: lucyAi,
  },
  {
    slug: 'nexus-saas',
    categories: ['design', 'frontend'],
    title: 'Nexus SaaS',
    year: '2025',
    role: 'UI design + build',
    blurb:
      'A marketing and analytics surface for a fictional SaaS — motion-led sections and live charts.',
    stack: ['React', 'Framer Motion', 'Recharts', 'Vite'],
    href: 'https://lucy-oop.github.io/nexus-saas/',
    img: nexus,
  },
  {
    slug: 'trinkora',
    categories: ['frontend'],
    title: 'TrinKora Clothing',
    year: '2025',
    role: 'Frontend',
    blurb: 'Clothing storefront with cart state and product filtering.',
    stack: ['React', 'JavaScript'],
    href: 'https://lucy-oop.github.io/TRINKORAClothing/',
    img: trinkora,
  },
  {
    slug: 'ecommerce-ts',
    categories: ['frontend'],
    title: 'Ecommerce (TypeScript)',
    year: '2025',
    role: 'Frontend',
    blurb: 'Typed product catalogue and cart, built to practise generics in real code.',
    stack: ['React', 'TypeScript'],
    href: 'https://lucy-oop.github.io/Ecommerce-project-ts/',
    img: ecommerce,
  },
  {
    slug: 'myflix',
    categories: ['frontend'],
    title: 'MyFlix',
    year: '2024',
    role: 'Frontend',
    blurb: 'Streaming-style browser with auth, search and an embedded player.',
    stack: ['React', 'Firebase', 'REST API'],
    href: 'https://lucy-oop.github.io/myFlix-L/',
    img: myflix,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const otherProjects = projects.filter((p) => !p.featured)

/** Display order is simply the array order above. */
export const orderedProjects = projects
