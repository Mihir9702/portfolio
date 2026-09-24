import type { StaticImageData } from 'next/image'
import jump from '@/assets/jump.png'

export type Project = {
  title: string
  description: string
  stack: string[]
  image?: { src: StaticImageData; alt: string }
  link?: { href: string; label: string }
  private?: boolean
}

export const projects: Project[] = [
  {
    title: 'Adiya OS',
    description: 'Internal operating system for Adiya Pharma Inc.',
    stack: [],
    private: true,
  },
  {
    title: 'Aura',
    description:
      'A research workspace for US stocks and ETFs. An AI "investment committee" argues for and against each trade idea, and the survivors are paper-traded under strict, deterministic risk controls.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript'],
  },
  {
    title: 'Jump',
    description:
      'A parallax side-scrolling platformer built from scratch with vanilla JavaScript and the Canvas API. The little square at the top of this page comes from it.',
    stack: ['JavaScript', 'Canvas API'],
    image: {
      src: jump,
      alt: 'Jump: a cyan square on grassy platforms against a sunset',
    },
    link: { href: 'https://mihir9702.github.io/jump/', label: 'Play it' },
  },
]
