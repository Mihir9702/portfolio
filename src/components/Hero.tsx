import type { ReactNode } from 'react'
import { site } from '@/content/site'
import Playfield from './Playfield'

// Each letter is its own element so the game can stand on it
function Word({ text }: { text: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {[...text].map((letter, i) => (
        <span key={i} data-letter className="inline-block">
          {letter}
        </span>
      ))}
    </span>
  )
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-block min-w-[1.75em] border border-b-2 border-line px-1 text-center font-sans text-sm text-ink">
      {children}
    </kbd>
  )
}

export default function Hero() {
  const [first, ...rest] = site.name.split(' ')

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative touch-manipulation border-b-2 border-ink pt-[clamp(6rem,20vh,13rem)] select-none">
        {/* Two tiers of platforms on phones, one long row from sm up */}
        <h1
          aria-label={site.name}
          className="pb-[0.22em] font-pixel text-[clamp(4.5rem,28vw,10.5rem)] leading-[0.9] font-bold sm:text-[clamp(4.5rem,17vw,10.5rem)]"
        >
          <Word text={first} /> <Word text={rest.join(' ')} />
        </h1>
        <Playfield />
      </div>

      <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:justify-between">
        <p className="max-w-[32rem] text-xl/relaxed text-pretty">
          {site.role} in {site.location}. I build full-stack web and mobile
          apps, and the occasional game, like the one above.
        </p>
        <p className="text-base text-muted sm:pt-1 sm:text-right">
          <span className="pointer-coarse:hidden">
            <Key>←</Key> <Key>→</Key> to run, <Key>space</Key> to jump
          </span>
          <span className="hidden pointer-coarse:inline">
            Tap the name to jump
          </span>
        </p>
      </div>
    </section>
  )
}
