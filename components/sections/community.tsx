"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Reveal } from "@/components/motion/fade-in"

// Card trapezoid (Figma node 206:58): the card is not a rectangle — the right
// side is taller (top edge rises toward the right, bottom edge drops toward the
// right), matching the brand's skewed-shape motif (see header MobileMenuShape).
// Slopes expressed as fractions of width/height so the angle holds at any size.
const CARD_GRADIENT_ID = "labs-card-brand-gradient"
const CARD_CORNER_RADIUS = 8
const CARD_STROKE_WIDTH = 3
const CARD_TOP_SLOPE = 0.05
const CARD_BOTTOM_SLOPE = 0.035
const CARD_RIGHT_LEAN = 0.03

type Point = { x: number; y: number }

// Point on the segment from `v` toward `toward`, at distance `d` (clamped to
// half the segment so adjacent corners never overlap).
function cornerInset(v: Point, toward: Point, d: number): Point {
  const dx = toward.x - v.x
  const dy = toward.y - v.y
  const len = Math.hypot(dx, dy)
  const t = Math.min(d, len / 2) / len
  return { x: v.x + dx * t, y: v.y + dy * t }
}

// Draws the card's trapezoid outline (rounded corners) from its measured pixel
// size, filled dark with a brand-gradient stroke + cyan/violet glow.
function CardShape() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { width: w, height: h } = size
  const r = CARD_CORNER_RADIUS
  const inset = CARD_STROKE_WIDTH / 2
  const left = inset
  const top = inset
  const right = w - inset
  const bottom = h - inset

  let path = ""
  if (w > 0 && h > 0) {
    // Cap the tilt in px so a wide (desktop) card stays subtly skewed instead
    // of leaning hard like the narrow mobile card.
    const topDrop = Math.min(CARD_TOP_SLOPE * (right - left), 20)
    const bottomRise = Math.min(CARD_BOTTOM_SLOPE * (right - left), 14)
    const rightLean = Math.min(CARD_RIGHT_LEAN * (bottom - top), 10)
    const verts: Point[] = [
      { x: left, y: top + topDrop },
      { x: right, y: top },
      { x: right - rightLean, y: bottom },
      { x: left, y: bottom - bottomRise },
    ]
    path =
      verts
        .map((v, i) => {
          const prev = verts[(i + verts.length - 1) % verts.length]
          const next = verts[(i + 1) % verts.length]
          const entry = cornerInset(v, prev, r)
          const exit = cornerInset(v, next, r)
          return `${i === 0 ? "M" : "L"}${entry.x},${entry.y} Q${v.x},${v.y} ${exit.x},${exit.y}`
        })
        .join(" ") + " Z"
  }

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 h-full w-full">
      {path && (
        <>
          {/* En lg la sombra/glow vive en su propia capa detrás del blob crema
              (-z-20 < blob -z-10 en el isolate de la sección): el glow se ve
              contra el hero oscuro pero la crema opaca lo tapa — la sombra no
              mancha el blob y la card queda encima. */}
          <div className="absolute inset-0 -z-20 hidden lg:block" aria-hidden="true">
            <svg style={{ width: w, height: h }} className="labs-card-glow" fill="none">
              <path d={path} fill="var(--color-bg-elev-dark)" />
            </svg>
          </div>
          <svg
            style={{ width: w, height: h }}
            className="labs-card-glow lg:filter-none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={path}
              fill="var(--color-bg-elev-dark)"
              stroke={`url(#${CARD_GRADIENT_ID})`}
              strokeWidth={CARD_STROKE_WIDTH}
            />
            <defs>
              <linearGradient
                id={CARD_GRADIENT_ID}
                x1={w}
                y1={h}
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-brand-mint)" />
                <stop offset="0.466597" stopColor="var(--color-brand-blue)" />
                <stop offset="0.932457" stopColor="var(--color-brand-violet)" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}
    </div>
  )
}

// Blob-crema mobile: sombra vía CSS `filter` sobre el <svg>, no un <filter> SVG
// sobre el <g>. Safari CPU-rasteriza la región del filtro en cada frame que se
// scrollea (medido en / vs /labs: stalls de 0.6-1s, ~27fps → 56fps al pasarlo
// a CSS). El drop-shadow CSS es un efecto de capa compuesto en GPU.
const MOBILE_BLOB_SHADOW = "drop-shadow(10px 10px 12px rgba(7,15,34,0.16))"

// Organic cream blob = section background on the dark page. slice makes it cover
// the section box; corners stay transparent so the dark page shows through the
// organic edges. Figma ships a different blob per breakpoint: a landscape shape
// for mobile (node 91:292) and a near-square one for desktop (node 38:83).
function BlobBackground() {
  return (
    <>
      {/* Mobile / tablet (Figma 91:292, landscape) */}
      <svg
        viewBox="0 0 1063 812"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
        style={{ filter: MOBILE_BLOB_SHADOW }}
        className="pointer-events-none absolute left-0 -top-[145px] h-[calc(100%+145px)] w-full -z-10 md:-top-[205px] md:h-[calc(100%+205px)] lg:hidden"
      >
        <path
          d="M965.708 286.578C1037.68 351.271 1007.72 495.547 957.76 568.678C873.003 774.075 565.138 688.392 373.298 746.972C181.459 805.551 -13.6548 614.046 76.807 563.455C227.333 479.274 -2.22957 305.912 72.0614 150.353C146.352 -5.20683 530.21 75.0987 631.275 72.0095C851.97 65.2638 973.081 115.327 938.785 157.427C902.487 201.984 893.739 221.885 965.708 286.578Z"
          fill="var(--color-bg-light)"
        />
      </svg>

      {/* Desktop (Figma 38:83, near-square). Align top so the organic top edge
          is the hero→section transition.
          Figma frames the 1983px-wide blob on a 1280 viewport (155%): keep that
          framing by stretching width to 155vw while pinning the height 1:1 with
          the viewBox, so the top waves keep their exact Figma height at any
          viewport width instead of scaling up and hiding behind the card.
          Centered via left calc, NOT translate: Safari silently drops the
          composited layer a transform creates on an svg this large.

          Va en DOS capas y no en una con `filter` sobre el <g>:

          El body ya es crema (--color-bg-light), así que fuera del hero el
          relleno del blob es del mismo color que el fondo y lo único que dibuja
          es su sombra. Con una sola capa, el borde inferior del blob proyectaba
          sombra sobre ese crema y se leía como una línea recta a todo el ancho
          cruzando la sección Somos (medido: escalón de 248→220 en el canal R).

          Capa 1 (sombra): mismo path pero con el viewBox recortado a los
          primeros 700px, que es donde la sombra hace falta — el filo orgánico
          contra la foto oscura del hero. Su corte recto abajo también proyecta,
          pero cae dentro de la silueta de la capa 2.
          Capa 2 (relleno): la forma completa, opaca y sin filtro, pintada
          encima; tapa el corte de la capa 1. A y=700 el path ya desborda los dos
          lados del viewBox (x va de −51 a 1987), así que lo tapa a todo el ancho.

          El alto del relleno es 1950 y no el 1881 del export porque el path baja
          hasta y=1948: con 1881 la forma perdía sus últimos ~69px de curva.
          viewBox y alto CSS cambian juntos para que la escala vertical siga 1:1. */}
      <svg
        viewBox="0 0 1983 700"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(50%-max(77.5vw,991.5px))] -top-[220px] hidden h-[700px] w-[max(155vw,1983px)] z-0 lg:block"
      >
        {/* CSS drop-shadow, not an SVG <filter>: Safari silently drops the
            whole element when an SVG filter region is this large (the Somos
            deco uses the same CSS pattern and renders fine there). */}
        <g style={{ filter: "var(--drop-shadow-neumorphic-soft)" }}>
          <path d="M1846.81 629.655C1986.93 791.366 1925.92 1154.99 1826.8 1339.86C1657.37 1858.19 1054.98 1647.35 677.856 1797.81C300.734 1948.27 -78.8866 1469.29 99.305 1340.52C395.81 1126.27 -51.6497 693.497 96.4764 300.771C244.602 -91.9563 996.099 104.163 1194.34 94.8029C1627.23 74.3625 1863.95 198.479 1796.04 304.987C1724.16 417.713 1706.69 467.943 1846.81 629.655Z" fill="var(--color-bg-light)" />
        </g>
      </svg>
      <svg
        viewBox="0 0 1983 1950"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(50%-max(77.5vw,991.5px))] -top-[220px] hidden h-[1950px] w-[max(155vw,1983px)] z-0 lg:block"
      >
        <path d="M1846.81 629.655C1986.93 791.366 1925.92 1154.99 1826.8 1339.86C1657.37 1858.19 1054.98 1647.35 677.856 1797.81C300.734 1948.27 -78.8866 1469.29 99.305 1340.52C395.81 1126.27 -51.6497 693.497 96.4764 300.771C244.602 -91.9563 996.099 104.163 1194.34 94.8029C1627.23 74.3625 1863.95 198.479 1796.04 304.987C1724.16 417.713 1706.69 467.943 1846.81 629.655Z" fill="var(--color-bg-light)" />
      </svg>
    </>
  )
}

// CTA card (Figma node 206:58): dark surface, brand-gradient border + cyan/violet
// glow, "Nodo LABS" lockup, and a skewed trapezoid button (hero button motif).
function LabsCard() {
  return (
    <div className="relative w-full lg:max-w-[814px]">
      <CardShape />
      <div className="relative flex flex-col items-center gap-6 px-8 py-9 text-center md:px-12 md:py-10 lg:gap-5 lg:py-12">
        <p className="font-inter text-[17px] uppercase tracking-[0.12em] text-(--color-warm-yellow)">
          DESARROLLO
        </p>

        {/* Nodo LABS lockup */}
        <div className="flex items-center gap-1.5 font-display text-[2rem] font-bold leading-none lg:text-[2.75rem]">
          <span className="text-(--color-text-primary-dark)">Nodo</span>
          <span className="rounded-[4px] bg-gradient-brand px-2.5 py-1 text-(--color-text-primary-dark)">
            LABS
          </span>
        </div>

        <p className="font-inter text-body text-(--color-text-primary-dark)">
          Servicios B2B del Nodo Serrano
        </p>

        {/* Skewed trapezoid CTA */}
        <Link
          href="/labs"
          className="group mt-1 inline-flex -skew-x-[10deg] items-stretch transition-opacity hover:opacity-90"
        >
          <span
            className="flex items-center rounded-tl-[8px] bg-gradient-brand p-[1.5px]"
            style={{ boxShadow: "var(--shadow-btn-cool)" }}
          >
            <span className="flex items-center rounded-tl-[7px] bg-(--color-bg-elev-dark) px-5 py-2.5">
              <span className="skew-x-[10deg] font-display text-body font-medium text-(--color-text-primary-dark)">
                Quiero conectar
              </span>
            </span>
          </span>
          <span
            className="flex items-center justify-center rounded-br-[8px] bg-gradient-brand px-3"
            style={{ boxShadow: "var(--shadow-btn-cool)" }}
          >
            <ArrowRight
              className="size-5 skew-x-[10deg] text-(--color-text-primary-dark)"
              strokeWidth={2.5}
            />
          </span>
        </Link>
      </div>
    </div>
  )
}

export default function Community() {
  return (
    <section className="relative isolate z-20 flex min-h-[80svh] overflow-x-clip flex-col bg-(--color-bg-light) pb-[100px] lg:bg-transparent">
      <BlobBackground />

      <Container className="flex flex-1 flex-col">
        <div className="relative flex w-full flex-1 flex-col items-center pb-12 md:pb-10">
          {/* Card straddles the hero/section transition line (its center on the blob's top edge).
              Delayed past the hero's own reveals (up to 800ms) so it visibly follows them in. */}
          <div className="-mt-[190px] flex w-full justify-center md:-mt-[235px]">
            <Reveal delay={900} className="flex w-full justify-center">
              <LabsCard />
            </Reveal>
          </div>

          {/* Text block (Figma node 14:138) — vertically centered in the cream area */}
          <div className="flex flex-1 items-center">
            <Reveal className="flex max-w-[340px] flex-col items-center text-center md:max-w-[600px]">
              <h2 className="font-display text-mob-h2 font-medium text-(--color-text-primary-light) md:text-h2">
                Integramos el primer semillero dedicado a Ethereum en Tandil.
              </h2>

              <div className="my-6 h-[3px] w-[280px] max-w-full rounded-full bg-gradient-brand md:my-8" />

              <div className="space-y-5 font-inter text-mob-body-lg leading-relaxed text-(--color-text-primary-light) md:text-body-lg">
                <p>
                  Un lugar donde{" "}
                  <strong className="font-semibold">
                    la comunidad puede ser protagonista
                  </strong>{" "}
                  en el proceso de investigación y educación en el futuro
                  descentralizado.
                </p>
                <p>
                  Participamos en investigación, educación y desarrollo de la red,{" "}
                  <strong className="font-semibold">
                    contribuyendo activamente a la investigación educativa y
                    desarrollo ético
                  </strong>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
