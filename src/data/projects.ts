import mingalar from '../assets/work/mingalardelivery.png'
import quickbook from '../assets/work/quickbook.png'
import taskflow from '../assets/work/taskflow.webp'
import logvault from '../assets/work/logvault.jpg'
import lucyAi from '../assets/work/lucyAi.png'
import nexus from '../assets/work/nexus.png'
import trinkora from '../assets/work/trinkora.jpg'
import momkitchen from '../assets/work/momkitchen.jpg'
import ecommerce from '../assets/work/ecommerce.jpg'
import myflix from '../assets/work/myflix.jpg'
import kfc from '../assets/work/kfc.jpg'

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
    slug: 'quickbook',
    title: 'Quickbook',
    year: '2026',
    role: 'Full-stack + database design',
    blurb:
      'A multi-tenant ERP, POS and accounting system for Myanmar businesses — tenant isolation enforced in Postgres row-level security, six roles, per-tenant custom fields and MMK/THB/USD reporting, all bilingual.',
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL RLS'],
    href: 'https://quickbook-one.vercel.app/',
    img: quickbook,
    featured: true,
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
    featured: true,
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
    slug: 'taskflow-dashboard',
    title: 'TaskFlow Dashboard',
    year: '2026',
    role: 'Frontend + auth',
    blurb:
      'A task manager behind a login: create tasks with priority and due dates, then search, filter and sort the list.',
    stack: ['JavaScript', 'Tailwind CSS', 'REST API', 'Auth'],
    href: 'https://taskflow-dashboard1-ten.vercel.app',
    img: taskflow,
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
    slug: 'moms-kitchen',
    title: 'Mom’s Kitchen',
    year: '2025',
    role: 'Frontend',
    blurb: 'Restaurant ordering flow with a running basket.',
    stack: ['React', 'JavaScript'],
    href: 'https://lucy-oop.github.io/mom-skitchen/',
    img: momkitchen,
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
  {
    slug: 'kfc',
    title: 'KFC Website',
    year: '2024',
    role: 'Frontend',
    blurb: 'A pixel-matching rebuild, done to drill layout and responsive fundamentals.',
    stack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    href: 'https://lucy-oop.github.io/KFC-L/',
    img: kfc,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const otherProjects = projects.filter((p) => !p.featured)
