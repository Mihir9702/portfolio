import Image from 'next/image'
import { projects } from '@/content/projects'
import TextLink from './TextLink'

export default function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="mx-auto max-w-6xl px-4 pt-28 sm:px-6"
    >
      <h2 id="work-title" className="text-2xl font-bold">
        Work
      </h2>
      <ul className="mt-6 border-t border-line">
        {projects.map(project => (
          <li
            key={project.title}
            className="grid gap-x-10 gap-y-3 border-b border-line py-8 md:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)_22rem]"
          >
            <h3 className="text-xl font-bold">{project.title}</h3>
            <div className="max-w-[36rem]">
              <p className="text-pretty">{project.description}</p>
              {project.stack.length > 0 && (
                <p className="mt-2 text-base text-muted">
                  {project.stack.join(', ')}
                </p>
              )}
              {project.links ? (
                <p className="mt-4 flex gap-6 text-base">
                  {project.links.map(link => (
                    <TextLink key={link.href} href={link.href}>
                      {link.label}
                    </TextLink>
                  ))}
                </p>
              ) : (
                project.private && (
                  <p className="mt-4 text-base text-muted">Private</p>
                )
              )}
            </div>
            {project.image && (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                placeholder="blur"
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) calc(100vw - 20rem), 100vw"
                className="border border-line md:col-start-2 lg:col-start-3 lg:row-start-1"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
