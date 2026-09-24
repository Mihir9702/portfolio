import { site } from '@/content/site'
import PlayerMark from './PlayerMark'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
  { href: site.resume, label: 'Resume' },
]

export default function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
      <a href="#top" aria-label={site.name}>
        <PlayerMark className="size-6" />
      </a>
      <nav aria-label="Main">
        <ul className="flex gap-6 text-base">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
