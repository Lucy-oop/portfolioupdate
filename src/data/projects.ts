import mingalar from '../assets/work/mingalardelivery.png'
import quickbook from '../assets/work/quickbook.png'
import logvault from '../assets/work/logvault.jpg'
import lucyAi from '../assets/work/lucyAi.png'
import htweOo from '../assets/work/htwe-oo.webp'
import nexus from '../assets/work/nexus.png'
import trinkora from '../assets/work/trinkora.jpg'
import ecommerce from '../assets/work/ecommerce.jpg'
import myflix from '../assets/work/myflix.jpg'
import lifeos from '../assets/work/lifeos.webp'
import wanmai from '../assets/work/wanmai.webp'

export type Project = {
  slug: string
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
    slug: 'lifeos',
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
    slug: 'mingalar-express',
    title: 'Mingalar Express',
    year: '2026',
    role: 'Full-stack + geospatial dispatch',
    blurb:
      'A hyper-local delivery and cash-on-delivery platform for Thingangyun Township, Yangon — row-locked route dispatch, an offline-first rider PWA that queues every state change before it sends, and an append-only COD ledger settled in integer MMK. Bilingual throughout.',
    stack: ['Next.js 16', 'Supabase', 'PostGIS', 'Leaflet'],
    href: 'https://mingalar-express.vercel.app',
    img: mingalar,
    featured: true,
  },
  {
    slug: 'htwe-oo-myanmar',
    title: 'Htwe Oo Myanmar',
    year: '2026',
    role: 'UI/UX design + frontend build',
    blurb:
      'A landing site for a family-run Burmese marionette theatre touring out of Phnom Penh and Bangkok — a scroll-driven hero, a heritage timeline running from the Yangon home theatre to the UNIMA Meschke prize and the Milan showcase, and a seat-reservation flow for the weekly Sunday show. Designed in Google Flow and Stitch, then built by hand.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'React Router'],
    href: 'https://lucy-oop.github.io/Htwe-Oo-Myanmar/',
    img: htweOo,
    featured: true,
  },
  {
    slug: 'quickbook',
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
