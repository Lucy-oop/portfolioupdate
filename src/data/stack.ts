import {
  Code2,
  Layers,
  Server,
  Wrench,
  PenTool,
  Sparkles,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'

export type StackGroup = {
  id: string
  label: string
  icon: LucideIcon
  /** Tints the group's icon chip. Keys map to classes in Stack.tsx. */
  tone: 'lilac' | 'peach' | 'mint'
  items: string[]
}

export const stackGroups: StackGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    icon: Code2,
    tone: 'lilac',
    items: ['HTML', 'CSS3', 'JavaScript (ES6+)', 'TypeScript'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    icon: Layers,
    tone: 'peach',
    items: ['React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Framer Motion'],
  },
  {
    id: 'backend',
    label: 'Backend & Data',
    icon: Server,
    tone: 'mint',
    items: ['Node.js', 'Express.js', 'Python', 'Firebase', 'PostgreSQL', 'Nodemon'],
  },
  {
    id: 'devtools',
    label: 'Developer Tools',
    icon: Wrench,
    tone: 'lilac',
    items: ['Git / GitHub', 'VS Code', 'Postman', 'Docker', 'Vercel', 'Chrome DevTools'],
  },
  {
    id: 'design',
    label: 'Design',
    icon: PenTool,
    tone: 'peach',
    items: ['Figma', 'Stitch', 'Responsive design', 'Design systems', 'UX principles'],
  },
  {
    id: 'ai',
    label: 'AI & Productivity',
    icon: Sparkles,
    tone: 'mint',
    items: ['Cursor', 'Claude Code', 'ChatGPT', 'Rapid prototyping'],
  },
  {
    id: 'business',
    label: 'Business / CRM',
    icon: Briefcase,
    tone: 'lilac',
    items: ['HubSpot'],
  },
]

export const learningNext = ['System Design', 'C#', 'Testing with Vitest', 'Accessibility audits']
