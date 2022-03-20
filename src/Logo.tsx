import React from 'react'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 225 225"
        preserveAspectRatio="xMidYMid meet"
        className="cursor-pointer"
      >
        <g
          transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
          fill="red"
          stroke="none"
        >
          <path d="M0 1125 l0 -1125 1125 0 1125 0 0 1125 0 1125 -1125 0 -1125 0 0 -1125z m1375 880 c120 -35 198 -74 292 -144 231 -172 357 -409 370 -696 15 -329 -136 -623 -414 -808 -284 -189 -686 -194 -977 -13 -142 89 -278 238 -345 381 -137 290 -115 639 56 898 117 176 279 302 470 367 127 42 180 49 328 45 104 -2 148 -8 220 -30z" />
          <path d="M650 1473 c-68 -142 -163 -341 -212 -443 l-89 -185 24 -20 c13 -11 75 -62 137 -113 l113 -93 89 253 c134 383 140 399 149 396 5 -2 65 -69 133 -151 69 -81 127 -149 130 -150 2 -1 61 66 130 148 70 83 130 151 135 153 5 2 16 -16 25 -40 14 -40 197 -565 208 -597 3 -12 126 83 271 209 4 3 -30 85 -77 181 -72 149 -127 265 -308 647 -16 35 -34 62 -38 60 -8 -3 -140 -150 -270 -301 -36 -42 -69 -74 -75 -73 -5 1 -83 85 -172 187 -89 101 -166 185 -171 187 -4 1 -64 -113 -132 -255z" />
        </g>
      </svg>
    </Link>
  )
}

export default Logo
