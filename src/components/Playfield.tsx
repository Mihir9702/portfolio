'use client'

import { useEffect, useRef } from 'react'

type Platform = { left: number; right: number; top: number; el: HTMLElement }

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ttl: number
  size: number
  color: string
}

// Physics runs in units of 1% of the name's font size, so the level scales with the type
const GRAVITY = 1900
const JUMP_SPEED = 680
const RUN_SPEED = 270
const GROUND_ACCEL = 2600
const AIR_ACCEL = 1700
const GROUND_FRICTION = 3000
const AIR_FRICTION = 500
const MAX_FALL = 1500
const JUMP_CUT = 0.45
// Grace periods (seconds) that make jumps feel fair: jumping just after running
// off a ledge, or pressing jump just before landing, still counts
const COYOTE_TIME = 0.09
const JUMP_BUFFER = 0.12
const DROP_TIME = 0.25

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

// A tiny platformer played on the letters of the heading it sits next to.
// The letters are one-way platforms: you can jump up through them and land on top.
export default function Playfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = canvas?.parentElement
    const heading = stage?.querySelector('h1')
    if (!canvas || !stage || !heading) return
    return runGame(canvas, stage, heading)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 size-full"
    />
  )
}

function runGame(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  heading: HTMLElement,
) {
  const context = canvas.getContext('2d')
  const measureContext = document.createElement('canvas').getContext('2d')
  if (!context || !measureContext) return
  const ctx = context
  const measurer = measureContext

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)')

  let width = 0
  let height = 0
  let unit = 1
  let size = 16
  let fontFamily = ''
  let platforms: Platform[] = []
  let colors = { player: '', outline: '', eye: '', coin: '', ink: '' }

  const player = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    facing: 1,
    grounded: false,
    on: null as Platform | null,
    squash: 0,
    stretch: 0,
  }
  const input = {
    left: false,
    right: false,
    down: false,
    jumpHeld: false,
    target: null as number | null,
  }
  const coin = { x: 0, y: 0, visible: false, respawnAt: 0, count: 0 }
  let particles: Particle[] = []

  let clock = 0
  let coyote = 0
  let buffer = 0
  let dropUntil = 0
  let canCut = false
  let tapJump = false
  let blinkAt = 2
  let blinkUntil = 0
  let spawned = false
  let playing = false
  let visible = false
  let active = false
  let disposed = false
  let frame = 0
  let last = 0
  let press: { x: number; y: number; time: number } | null = null

  function readColors() {
    const style = getComputedStyle(stage)
    const read = (name: string) => style.getPropertyValue(name).trim()
    colors = {
      player: read('--player'),
      outline: read('--player-outline'),
      eye: read('--player-eye'),
      coin: read('--coin'),
      ink: read('--ink'),
    }
  }

  function measure() {
    const box = stage.getBoundingClientRect()
    width = stage.clientWidth
    height = stage.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const style = getComputedStyle(heading)
    const fontSize = parseFloat(style.fontSize)
    unit = fontSize / 100
    size = Math.round(clamp(fontSize * 0.17, 14, 28))
    fontFamily = style.fontFamily
    measurer.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const metrics = measurer.measureText('M')
    const ascent = metrics.fontBoundingBoxAscent
    const descent = metrics.fontBoundingBoxDescent

    platforms = Array.from(
      heading.querySelectorAll<HTMLElement>('[data-letter]'),
      el => {
        const rect = el.getBoundingClientRect()
        const glyph = measurer.measureText(el.textContent ?? '')
        const x = rect.left - box.left - stage.clientLeft
        // An inline-block's baseline sits half its leftover leading below its top, plus the ascent
        const baseline =
          rect.top -
          box.top -
          stage.clientTop +
          (rect.height - ascent - descent) / 2 +
          ascent
        return {
          left: x - glyph.actualBoundingBoxLeft,
          right: x + glyph.actualBoundingBoxRight,
          top: baseline - glyph.actualBoundingBoxAscent,
          el,
        }
      },
    )

    if (!spawned) return
    // Keep the player on whatever it was standing on after the layout shifts
    player.x = clamp(player.x, 0, width - size)
    const standingOn = platforms.find(p => p.el === player.on?.el)
    if (standingOn) {
      player.on = standingOn
      player.y = standingOn.top - size
    } else if (player.y + size > height) {
      player.y = height - size
    }
  }

  function spawn() {
    const first = platforms[0]
    if (!first) return
    player.x = (first.left + first.right) / 2 - size / 2
    if (reducedMotion.matches) {
      player.y = first.top - size
      player.grounded = true
      player.on = first
    } else {
      // Drop in from above and land on the first letter
      player.y = -size
    }
    spawned = true
    placeCoin(first)
  }

  function placeCoin(avoid: Platform | null) {
    const options = platforms.filter(p => p !== avoid)
    const p = options[Math.floor(Math.random() * options.length)]
    if (!p) return
    coin.x = (p.left + p.right) / 2
    coin.y = p.top - size * 1.5
    coin.visible = true
  }

  function burst(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4
      const speed = (110 + Math.random() * 60) * unit
      const ttl = 0.35 + Math.random() * 0.2
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: ttl,
        ttl,
        size: Math.max(2, Math.round(size / 7)),
        color: colors.coin,
      })
    }
  }

  function dust(x: number, y: number, strength: number) {
    for (const direction of [-1, 1]) {
      for (let i = 0; i < 2; i++) {
        const ttl = 0.25 + Math.random() * 0.15
        particles.push({
          x,
          y: y - 2,
          vx: direction * (60 + Math.random() * 80) * unit * strength,
          vy: -(20 + Math.random() * 40) * unit,
          life: ttl,
          ttl,
          size: Math.max(2, Math.round(size / 8)),
          color: colors.ink,
        })
      }
    }
  }

  function onLand(impact: number, platform: Platform | null) {
    tapJump = false
    const strength = clamp(impact / (MAX_FALL * unit * 0.6), 0, 1)
    if (strength < 0.2) return
    player.squash = strength
    if (reducedMotion.matches) return
    dust(player.x + size / 2, player.y + size, strength)
    // The letter gives a little under the player's weight
    const dip = Math.max(2, Math.round(size * 0.22 * strength))
    platform?.el.animate(
      [
        { transform: 'translateY(0)' },
        { transform: `translateY(${dip}px)` },
        { transform: 'translateY(0)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    )
  }

  function update(dt: number) {
    clock += dt
    const run = RUN_SPEED * unit

    // Direction comes from the keys, or from steering toward the last tap
    let direction = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    if (direction !== 0) {
      input.target = null
    } else if (input.target !== null) {
      const dx = input.target - (player.x + size / 2)
      if (Math.abs(dx) < size / 3) input.target = null
      else direction = Math.sign(dx)
    }

    if (direction !== 0) {
      const accel = (player.grounded ? GROUND_ACCEL : AIR_ACCEL) * unit
      player.vx = clamp(player.vx + direction * accel * dt, -run, run)
      player.facing = direction
    } else {
      const friction =
        (player.grounded ? GROUND_FRICTION : AIR_FRICTION) * unit * dt
      player.vx =
        Math.abs(player.vx) <= friction
          ? 0
          : player.vx - Math.sign(player.vx) * friction
    }

    coyote = player.grounded ? COYOTE_TIME : Math.max(0, coyote - dt)
    buffer = Math.max(0, buffer - dt)
    if (buffer > 0 && coyote > 0) {
      player.vy = -JUMP_SPEED * unit
      player.grounded = false
      player.on = null
      player.stretch = 1
      coyote = 0
      buffer = 0
      canCut = !tapJump
    }
    // Letting go of jump early makes a shorter hop
    if (canCut && !input.jumpHeld && player.vy < 0) {
      player.vy *= JUMP_CUT
      canCut = false
    }

    if (input.down && player.grounded && player.on) {
      dropUntil = clock + DROP_TIME
      player.grounded = false
      player.on = null
    }
    input.down = false

    player.vy = Math.min(player.vy + GRAVITY * unit * dt, MAX_FALL * unit)
    const previousBottom = player.y + size
    const wasGrounded = player.grounded
    const impact = player.vy

    player.x += player.vx * dt
    if (player.x < 0 || player.x > width - size) {
      player.x = clamp(player.x, 0, width - size)
      player.vx = 0
    }
    player.y += player.vy * dt
    if (player.y < 0 && player.vy < 0) {
      player.y = 0
      player.vy = 0
    }

    // Only catch the player when it falls onto a letter from above
    player.grounded = false
    if (player.vy >= 0) {
      const bottom = player.y + size
      let ground = height
      let landing: Platform | null = null
      if (clock >= dropUntil) {
        for (const p of platforms) {
          const over = player.x + size > p.left + 1 && player.x < p.right - 1
          if (
            over &&
            previousBottom <= p.top + 1 &&
            bottom >= p.top &&
            p.top < ground
          ) {
            ground = p.top
            landing = p
          }
        }
      }
      if (bottom >= ground) {
        player.y = ground - size
        player.vy = 0
        player.grounded = true
        player.on = landing
        if (!wasGrounded) onLand(impact, landing)
      }
    }

    if (coin.visible) {
      const dx = Math.abs(player.x + size / 2 - coin.x)
      const dy = Math.abs(player.y + size / 2 - coin.y)
      if (dx < size * 0.75 && dy < size * 0.85) {
        coin.visible = false
        coin.count += 1
        coin.respawnAt = clock + 0.6
        burst(coin.x, coin.y)
      }
    } else if (coin.respawnAt > 0 && clock >= coin.respawnAt) {
      coin.respawnAt = 0
      placeCoin(player.on)
    }

    particles = particles.filter(p => (p.life -= dt) > 0)
    for (const p of particles) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += GRAVITY * 0.35 * unit * dt
    }

    if (clock > blinkAt) {
      blinkUntil = clock + 0.12
      blinkAt = clock + 2.5 + Math.random() * 3
    }
    if (reducedMotion.matches) {
      player.squash = 0
      player.stretch = 0
    } else {
      player.squash = Math.max(0, player.squash - dt * 7)
      player.stretch = Math.max(0, player.stretch - dt * 5)
    }
  }

  function drawCoin(x: number, y: number, spin: number, radius: number) {
    const w = Math.max(2, Math.round(radius * 2 * spin))
    const h = Math.round(radius * 2)
    ctx.fillStyle = colors.coin
    ctx.fillRect(Math.round(x - w / 2), Math.round(y - h / 2), w, h)
    if (spin > 0.5) {
      ctx.fillStyle = 'rgb(255 255 255 / 0.55)'
      ctx.fillRect(
        Math.round(x - w / 2 + w * 0.2),
        Math.round(y - h / 2 + h * 0.2),
        Math.max(1, Math.round(w * 0.2)),
        Math.round(h * 0.4),
      )
    }
  }

  function drawPlayer() {
    const scaleX = 1 + 0.28 * player.squash - 0.16 * player.stretch
    const scaleY = 1 - 0.24 * player.squash + 0.2 * player.stretch
    const w = Math.round(size * scaleX)
    const h = Math.round(size * scaleY)
    const left = Math.round(player.x + (size - w) / 2)
    const top = Math.round(player.y + size - h)
    // The sprite is designed on a 16px grid, like the favicon
    const px = size / 16
    const border = Math.max(1, Math.round(px))

    ctx.fillStyle = colors.outline
    ctx.fillRect(left, top, w, h)
    ctx.fillStyle = colors.player
    ctx.fillRect(left + border, top + border, w - border * 2, h - border * 2)

    const blinking = clock < blinkUntil
    const look = Math.round(player.facing * px)
    const eyeWidth = Math.max(2, Math.round(2 * px))
    const eyeHeight = blinking
      ? Math.max(1, Math.round(px))
      : Math.max(3, Math.round(4 * px * scaleY))
    const eyeTop = top + Math.round((blinking ? 7 : 4) * px * scaleY)
    ctx.fillStyle = colors.eye
    ctx.fillRect(
      left + Math.round(4 * px * scaleX) + look,
      eyeTop,
      eyeWidth,
      eyeHeight,
    )
    ctx.fillRect(
      left + Math.round(9 * px * scaleX) + look,
      eyeTop,
      eyeWidth,
      eyeHeight,
    )
  }

  function draw() {
    ctx.clearRect(0, 0, width, height)
    const motion = !reducedMotion.matches

    if (coin.visible) {
      const bob = motion ? Math.sin(clock * 3) * size * 0.12 : 0
      const spin = motion ? Math.abs(Math.cos(clock * 2.5)) : 1
      drawCoin(coin.x, coin.y + bob, spin, size * 0.32)
    }

    for (const p of particles) {
      ctx.globalAlpha = p.life / p.ttl
      ctx.fillStyle = p.color
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
    }
    ctx.globalAlpha = 1

    drawPlayer()

    if (coin.count > 0) {
      const textSize = Math.round(size * 0.9)
      ctx.font = `700 ${textSize}px ${fontFamily}`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = colors.ink
      const label = `× ${coin.count}`
      ctx.fillText(label, width, textSize)
      const labelWidth = ctx.measureText(label).width
      drawCoin(
        width - labelWidth - textSize * 0.6,
        textSize,
        1,
        textSize * 0.32,
      )
    }
  }

  function tick(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 30)
    last = now
    update(dt)
    draw()
    frame = requestAnimationFrame(tick)
  }

  function start() {
    if (frame || !spawned || !visible || document.hidden) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  function releaseKeys() {
    input.left = false
    input.right = false
    input.down = false
    input.jumpHeld = false
  }

  function onKeyDown(event: KeyboardEvent) {
    if (
      !active ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      isEditable(event.target)
    )
      return
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        input.left = true
        break
      case 'ArrowRight':
      case 'KeyD':
        input.right = true
        break
      case 'Space':
      case 'ArrowUp':
      case 'KeyW':
        if (!event.repeat) {
          buffer = JUMP_BUFFER
          input.jumpHeld = true
        }
        break
      case 'ArrowDown':
      case 'KeyS':
        // Only drop through a letter once someone is playing; otherwise let the page scroll
        if (!playing || !player.on) return
        input.down = true
        break
      default:
        return
    }
    playing = true
    input.target = null
    event.preventDefault()
  }

  function onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        input.left = false
        break
      case 'ArrowRight':
      case 'KeyD':
        input.right = false
        break
      case 'Space':
      case 'ArrowUp':
      case 'KeyW':
        input.jumpHeld = false
        break
    }
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button === 0) {
      press = { x: event.clientX, y: event.clientY, time: event.timeStamp }
    }
  }

  // A tap jumps toward the tapped spot; drags are left alone so the page can scroll
  function onPointerUp(event: PointerEvent) {
    if (!press) return
    const distance = Math.hypot(
      event.clientX - press.x,
      event.clientY - press.y,
    )
    const quick = event.timeStamp - press.time < 400
    press = null
    if (distance > 10 || !quick) return
    const box = stage.getBoundingClientRect()
    input.target = event.clientX - box.left - stage.clientLeft
    buffer = JUMP_BUFFER
    tapJump = true
    playing = true
  }

  function onPointerCancel() {
    press = null
  }

  function onVisibilityChange() {
    if (document.hidden) stop()
    else start()
  }

  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting
      active = entry.intersectionRatio >= 0.5
      if (!active) {
        playing = false
        releaseKeys()
      }
      if (visible) start()
      else stop()
    },
    { threshold: [0, 0.5] },
  )

  const resize = new ResizeObserver(() => {
    measure()
    if (!frame && spawned) draw()
  })

  readColors()
  measure()
  intersection.observe(stage)
  resize.observe(stage)
  document.fonts.ready.then(() => {
    if (disposed) return
    measure()
    spawn()
    start()
  })

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', releaseKeys)
  stage.addEventListener('pointerdown', onPointerDown)
  stage.addEventListener('pointerup', onPointerUp)
  stage.addEventListener('pointercancel', onPointerCancel)
  document.addEventListener('visibilitychange', onVisibilityChange)
  darkMode.addEventListener('change', readColors)

  return () => {
    disposed = true
    stop()
    intersection.disconnect()
    resize.disconnect()
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', releaseKeys)
    stage.removeEventListener('pointerdown', onPointerDown)
    stage.removeEventListener('pointerup', onPointerUp)
    stage.removeEventListener('pointercancel', onPointerCancel)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    darkMode.removeEventListener('change', readColors)
  }
}
