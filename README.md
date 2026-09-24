# Portfolio

My personal site: [mihir-patel.vercel.app](https://mihir-patel.vercel.app)

The name at the top of the page is a tiny platformer. Run with ← → (or A / D), jump with space, and on a phone tap where you want to go. The letters are one-way platforms, and the player is the cyan square from my game [Jump](https://mihir9702.github.io/jump/).

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and TypeScript.

## Run it locally

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

## Editing content

Everything the site says lives in `src/content/`:

- `site.ts`: name, role, location, social links, and an optional email for the contact line
- `projects.ts`: the work list (screenshots go in `src/assets/`)
- `skills.ts`: the stack list

The game is `src/components/Playfield.tsx`, and the palette is at the top of `src/app/globals.css`.

## Deploying

The site deploys on Vercel. Metadata, the sitemap and the social preview image use Vercel's production domain, so adding a custom domain in Vercel needs no code changes.

Fonts: Pixelify Sans and Atkinson Hyperlegible Next, both under the SIL Open Font License (copies in `src/assets/fonts/`).
