import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { site } from '@/content/site'

export const alt = `${site.name}, ${site.role.toLowerCase()} in ${site.location}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const fontDir = join(process.cwd(), 'src/assets/fonts')
const [pixelify, atkinson] = await Promise.all([
  readFile(join(fontDir, 'PixelifySans-Bold.ttf')),
  readFile(join(fontDir, 'AtkinsonHyperlegibleNext-Regular.ttf')),
])

// The light palette from globals.css
const paper = '#e9eee6'
const ink = '#132420'
const muted = '#50655e'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        padding: '0 80px 64px',
        backgroundColor: paper,
        color: ink,
        fontFamily: 'Atkinson',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'relative',
          paddingBottom: 36,
          borderBottom: `6px solid ${ink}`,
          fontFamily: 'Pixelify',
          fontSize: 156,
          lineHeight: 0.9,
        }}
      >
        {site.name}
        {/* Mid-jump over the gap between the two words */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
          style={{ position: 'absolute', left: 452, top: -150 }}
        >
          <rect x="1" y="1" width="14" height="14" fill="#0a6f7c" />
          <rect x="2" y="2" width="12" height="12" fill="#11b5c9" />
          <rect x="5" y="5" width="2" height="4" fill={ink} />
          <rect x="9" y="5" width="2" height="4" fill={ink} />
        </svg>
      </div>
      <div style={{ marginTop: 28, fontSize: 40, color: muted }}>
        {`${site.role} in ${site.location}`}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Pixelify', data: pixelify, weight: 700, style: 'normal' },
        { name: 'Atkinson', data: atkinson, weight: 400, style: 'normal' },
      ],
    },
  )
}
