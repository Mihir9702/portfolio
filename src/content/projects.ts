import type { StaticImageData } from 'next/image'
import adiyaOs from '@/assets/adiya-os.png'
import aura from '@/assets/aura.png'
import jump from '@/assets/jump.png'

export type Project = {
  title: string
  description: string
  stack: string[]
  image?: { src: StaticImageData; alt: string }
  links?: { href: string; label: string }[]
  private?: boolean
}

export const projects: Project[] = [
  {
    title: 'Adiya OS',
    description:
      'Internal operating system for Adiya Pharma Inc. that runs orders, artwork, production, quality and shipping for labels, inserts and cartons in one place.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    image: {
      src: adiyaOs,
      alt: 'The Adiya OS sign-in page, next to the line "Labels, inserts and cartons, run in one place."',
    },
    private: true,
  },
  {
    title: 'Aura',
    description:
      'A paper-trading research workspace for US stocks and ETFs, designed around an AI "investment committee" kept in check by deterministic risk rules. The foundation is built and tested: owner sign-in, a double-entry ledger, kill switches and live updates. The trading engine is designed but not built yet.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript'],
    image: {
      src: aura,
      alt: 'The Aura overview: a $500.00 paper account with its equity double-underlined, five strategy pods on a lifecycle grid, and the entry halt and full kill controls',
    },
    links: [{ href: 'https://github.com/Mihir9702/Aura', label: 'Source' }],
  },
  {
    title: 'Jump',
    description:
      'A 2.5D platformer about a cyan cube crossing a sunset valley: three levels, tuned jump physics, and keyboard, gamepad and touch controls. The little square at the top of this page comes from it.',
    stack: ['TypeScript', 'Three.js', 'Vite'],
    image: {
      src: jump,
      alt: 'The Jump title screen: the word JUMP built from grass-topped blocks above a valley at sunset',
    },
    links: [
      { href: 'https://mihir9702.github.io/jump/', label: 'Play it' },
      { href: 'https://github.com/Mihir9702/jump', label: 'Source' },
    ],
  },
]
