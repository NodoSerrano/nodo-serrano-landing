// Flecha decorativa de la home (Figma "web-nodo-final-a-produccion", nodo 16:274).
//
// Va fija al viewport y en -z-10, así que pinta encima del fondo crema del canvas
// pero por debajo de TODAS las secciones: todas declaran z-10/z-20/z-30 y ni
// <div id="top"> ni <main> crean stacking context, con lo cual esos z-index viven
// en el stacking context raíz. Resultado: la flecha solo asoma por los huecos
// transparentes que dejan los blobs curvos entre secciones.
//
// Es un server component a propósito (SVG estático + CSS, cero JS) para no sumar
// nada al bundle cliente ni al camino crítico del LCP.

const FILTER_ID = "scroll-arrow-inner-shadow";
const GRADIENT_RIGHT_ID = "scroll-arrow-gradient-right";
const GRADIENT_LEFT_ID = "scroll-arrow-gradient-left";

export default function ScrollArrow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed -z-10 bottom-[6vh] left-1/2 w-[72vw] -translate-x-1/2 md:w-[46vw] lg:w-[38vw] lg:max-w-[460px]"
    >
      {/* Capa aparte para el float: si la animación fuera en el wrapper, su
          transform pisaría el -translate-x-1/2 del centrado. */}
      <div className="animate-arrow-float motion-reduce:animate-none">
        <svg
          className="block h-auto w-full"
          viewBox="0 0 328.21 278.377"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter={`url(#${FILTER_ID})`}>
            <path
              d="M165.823 85.779L328.21 0L328.21 12.9478L165.823 278.377L165.823 85.779Z"
              fill={`url(#${GRADIENT_RIGHT_ID})`}
            />
            <path
              d="M165.823 85.779L0 0L0 12.9478L165.823 278.377L165.823 85.779Z"
              fill={`url(#${GRADIENT_LEFT_ID})`}
            />
          </g>
          <defs>
            {/* Neumorfismo pressed del Figma. filterUnits queda en su default
                objectBoundingBox (región en %): la versión userSpaceOnUse que
                exporta Figma es justo la que Safari dropea en filtros grandes
                — ver components/sections/blob-shadow-filter.tsx. */}
            <filter
              id={FILTER_ID}
              x="-9%"
              y="-10%"
              width="118%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-26" dy="-26" />
              <feGaussianBlur stdDeviation="26" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.49 0"
              />
              <feBlend mode="overlay" in2="shape" result="innerShadowLight" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="26" dy="26" />
              <feGaussianBlur stdDeviation="26" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.115385 0 0 0 0 0.0846893 0 0 0 0 0.0232988 0 0 0 0.25 0"
              />
              <feBlend mode="overlay" in2="innerShadowLight" />
            </filter>
            <linearGradient
              id={GRADIENT_RIGHT_ID}
              x1="328.21"
              y1="0"
              x2="101.815"
              y2="149.889"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--color-brand-mint)" />
              <stop offset="0.466597" stopColor="var(--color-brand-blue)" />
              <stop offset="0.932457" stopColor="var(--color-brand-violet)" />
            </linearGradient>
            <linearGradient
              id={GRADIENT_LEFT_ID}
              x1="0"
              y1="0"
              x2="228.211"
              y2="154.289"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--color-brand-mint)" />
              <stop offset="0.466597" stopColor="var(--color-brand-blue)" />
              <stop offset="0.932457" stopColor="var(--color-brand-violet)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
