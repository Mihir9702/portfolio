import { skills } from '@/content/skills'

export default function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="mx-auto max-w-6xl px-4 pt-28 sm:px-6"
    >
      <h2 id="stack-title" className="text-2xl font-bold">
        Stack
      </h2>
      <dl className="mt-6 border-t border-line">
        {skills.map(group => (
          <div
            key={group.title}
            className="grid gap-x-10 gap-y-1 border-b border-line py-4 sm:grid-cols-[13rem_1fr]"
          >
            <dt className="text-muted">{group.title}</dt>
            <dd>{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
