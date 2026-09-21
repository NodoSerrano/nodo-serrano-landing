import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Botón CTA con trapecio inclinado partido en dos + flecha — el mismo motivo que
// la card "Nodo LABS" del home (community.tsx). Soporta rutas internas (Link),
// anchors de la misma página y mailto: (ambos como <a>).
export function SkewedCta({
  href,
  label,
  warm = false,
}: {
  href: string
  label: string
  warm?: boolean
}) {
  const gradient = warm ? "bg-gradient-warm" : "bg-gradient-brand"
  const shadow = { boxShadow: warm ? "var(--shadow-btn-warm)" : "var(--shadow-btn-cool)" }
  const className =
    "group inline-flex -skew-x-[10deg] items-stretch transition-opacity hover:opacity-90"

  const inner = (
    <>
      <span
        className={`flex items-center rounded-tl-[8px] ${gradient} p-[1.5px]`}
        style={shadow}
      >
        <span className="flex items-center rounded-tl-[7px] bg-(--color-bg-elev-dark) px-5 py-2.5">
          <span className="skew-x-[10deg] font-display text-body font-medium text-(--color-text-primary-dark)">
            {label}
          </span>
        </span>
      </span>
      <span
        className={`flex items-center justify-center rounded-br-[8px] ${gradient} px-3`}
        style={shadow}
      >
        <ArrowRight
          className="size-5 skew-x-[10deg] text-(--color-text-primary-dark)"
          strokeWidth={2.5}
        />
      </span>
    </>
  )

  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}
