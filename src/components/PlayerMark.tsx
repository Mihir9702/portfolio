// The square from Jump, drawn on the same 16px grid as the in-page player and the favicon
export default function PlayerMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        className="fill-(--player-outline)"
      />
      <rect x="2" y="2" width="12" height="12" className="fill-(--player)" />
      <rect x="5" y="5" width="2" height="4" className="fill-(--player-eye)" />
      <rect x="9" y="5" width="2" height="4" className="fill-(--player-eye)" />
    </svg>
  )
}
