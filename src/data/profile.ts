export const profile = {
  fullName: 'Yee Mon Thant',
  preferredName: 'Lucy',
  role: 'Junior Frontend Developer',
  location: 'Bangkok, Thailand',
  timezone: 'GMT+7',
  email: 'tomon5609@gmail.com',
  phone: '+9 41574675',
  cv: '/yee-mon-thant-cv.pdf',
  availability: 'Open to junior frontend roles',
  tagline: 'I design it before I build it.',
  intro:
    'A junior frontend developer in Bangkok who came to code from the design side — so the Figma file usually opens before the editor.',
} as const

export const socials = [
  { label: 'GitHub', handle: 'Lucy-oop', href: 'https://github.com/Lucy-oop' },
  {
    label: 'LinkedIn',
    handle: 'yee-mon-thant',
    href: 'https://www.linkedin.com/in/yee-mon-thant-15973a2b9',
  },
  {
    label: 'Instagram',
    handle: 'yeemon7631',
    href: 'https://www.instagram.com/yeemon7631?igsh=MWt2ZmtveXI0cWcwMg==',
  },
  {
    label: 'Facebook',
    handle: 'yeemonthant0611',
    href: 'https://www.facebook.com/yeemonthant0611',
  },
] as const

export const aboutCopy = [
  'I’m a junior frontend developer based in Bangkok. I came to code from the design side, which is why I still open Figma before the editor — settling the type scale, the spacing rhythm and the component states first makes the build the easy part.',
  'What I actually enjoy is the debugging. That hour where something is broken for a reason you can’t see yet, and then you can, and it works. That’s the part that made this stick.',
  'I’m looking for a junior frontend role where I can keep doing both halves — designing the interface, then shipping it properly.',
] as const

export const facts = [
  { label: 'Based in', value: 'Bangkok, Thailand' },
  { label: 'Focus', value: 'React · UI/UX · Design systems' },
  { label: 'Speaks', value: 'Burmese · English · Japanese N4 · Thai' },
  { label: 'Currently', value: 'Going deeper on TypeScript' },
] as const

/** `level` is 0–100 and drives the meter width only. */
export const spokenLanguages = [
  { name: 'Burmese', level: 100, note: 'Native' },
  { name: 'English', level: 65, note: 'Intermediate' },
  { name: 'Japanese', level: 45, note: 'JLPT N4' },
  { name: 'Thai', level: 25, note: 'Basic' },
] as const

export const softSkills = [
  'Clear communication',
  'Team collaboration',
  'Strong focus & concentration',
  'Problem-solving mindset',
  'Time management',
  'Adaptable, growth mindset',
  'Eager to learn new tech',
] as const
