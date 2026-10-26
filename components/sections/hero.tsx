import Header from "@/components/layout/header"
import LocationFilledIcon from "@/components/svgs/location-filled-icon"
import { Reveal } from "@/components/motion/fade-in"

export default function Hero() {
  return (
    <section
      className="font-inter relative w-full min-h-[80svh] md:min-h-[85svh] flex flex-col overflow-hidden"
    >
      {/* Preload the mobile hero crop only — it's the LCP element on phones and
          this is the throttled-mobile metric Lighthouse scores. Desktop gets
          its crop from <picture> without a competing preload. */}
      <link
        rel="preload"
        as="image"
        href="/downloads/hero-image-1080.webp"
        imageSrcSet="/downloads/hero-image-640.webp 640w, /downloads/hero-image-828.webp 828w, /downloads/hero-image-1080.webp 1080w"
        imageSizes="100vw"
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      {/* Background Image — native <picture> for art direction. A hand-rolled
          <img> (not next/image) so we control fetchpriority and emit exactly
          one preload. The crops are pre-resized WebP; they sit under a dark
          gradient + blur so quality 78 is plenty. */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            media="(min-width: 768px)"
            type="image/webp"
            srcSet="/downloads/hero-desktop-1280.webp 1280w, /downloads/hero-desktop-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/downloads/hero-image-1080.webp"
            srcSet="/downloads/hero-image-640.webp 640w, /downloads/hero-image-828.webp 828w, /downloads/hero-image-1080.webp 1080w"
            sizes="100vw"
            alt="Nodo Serrano background"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Gradient Overlay. The linear gradients carry the dark tint on every
          screen; the huge blur circles + infinite animate-pulse are desktop
          only — on mobile they were continuous compositor work that starved
          the scroll-reveal animations on iOS. */}
      <div className="absolute inset-0 z-1 md:backdrop-blur-[6px]">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-bg-elev-dark)/85 via-violet-900/40 to-(--color-bg-elev-dark)/85" />
        <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full filter blur-[128px] animate-pulse" />
        <div className="hidden md:block absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-[128px] animate-pulse animation-delay-2000" />
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full filter blur-[200px]" />
      </div>

      {/* Header — sits inside Hero, fixed position, shares the hero background */}
      <Header />

      {/* Content — staggered entrance, framer-motion-free (see Reveal).
          pb reserves the Labs card overlap (community.tsx -mt-[190px]/md:-mt-[235px]);
          md:pt clears the fixed header and mirrors the pb bump so tall screens
          keep the same vertical center. min-h (not h) lets short viewports grow
          the hero instead of sliding "Tandil" under the card. */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-left px-4 md:px-12 pt-20 pb-48 md:pt-[107px] md:pb-[235px]">
        <div className="max-w-3xl md:max-w-[654px] space-y-8 md:space-y-9">
          {/* Headings */}
          <div className="space-y-3 md:space-y-9">
            <Reveal
              as="h1"
              delay={400}
              className="font-display text-mob-display-xl md:text-display-lg text-(--color-text-primary-dark)"
            >
              Hackerspace y Semillero
            </Reveal>

            <Reveal
              variant="scale-x"
              delay={500}
              className="h-[3px] w-full max-w-[330px] md:max-w-none rounded-full bg-gradient-brand"
            />

            <Reveal
              as="h2"
              delay={600}
              className="font-display text-mob-h2 md:text-h2 text-(--color-text-primary-dark) max-w-2xl sm:mx-auto md:max-w-none md:mx-0 leading-relaxed"
            >
              Investigación y educación con foco en Ethereum Ecosystem
            </Reveal>

            {/* Location — part of the same first-wave reveal as the headings above */}
            <Reveal
              delay={700}
              className="flex items-end justify-start gap-2 text-(--color-text-primary-dark)"
            >
              <LocationFilledIcon className="h-3.5 w-3.5 md:h-[25px] md:w-[25px] mb-0.5 md:mb-0" />
              <span className="text-body-lg md:text-h3 font-normal">Tandil</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
