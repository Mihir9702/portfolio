import type { ComponentProps } from 'react'

export default function TextLink({
  href,
  children,
  ...props
}: ComponentProps<'a'>) {
  const external = href?.startsWith('http')

  return (
    <a
      href={href}
      className="text-link"
      {...(external && { target: '_blank', rel: 'noreferrer' })}
      {...props}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
