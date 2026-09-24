import Link from 'next/link'
import PlayerMark from '@/components/PlayerMark'

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto grid min-h-dvh max-w-6xl content-center px-4 sm:px-6"
    >
      <PlayerMark className="size-10" />
      <h1 className="mt-6 font-pixel text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl">This page fell off the map.</p>
      <p className="mt-6">
        <Link href="/" className="text-link">
          Back to the start
        </Link>
      </p>
    </main>
  )
}
