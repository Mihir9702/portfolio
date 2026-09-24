import { site } from '@/content/site'
import TextLink from './TextLink'

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-4 py-28 sm:px-6"
    >
      <h2 id="contact-title" className="text-2xl font-bold">
        Contact
      </h2>
      <p className="mt-6 max-w-[32rem] text-xl/relaxed text-pretty">
        The best way to reach me is{' '}
        <TextLink href={site.linkedin}>LinkedIn</TextLink>
        {site.email && (
          <>
            , or <TextLink href={`mailto:${site.email}`}>email</TextLink>
          </>
        )}
        . I&apos;m also on <TextLink href={site.github}>GitHub</TextLink>, and
        here&apos;s my <TextLink href={site.resume}>resume</TextLink>.
      </p>
    </section>
  )
}
