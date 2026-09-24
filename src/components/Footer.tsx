import { site } from '@/content/site'

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <p className="border-t border-line pt-6 text-sm text-muted">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  )
}
