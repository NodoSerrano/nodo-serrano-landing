import type React from "react"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

// Two families only: Inter (body + nav) and Space Grotesk (headings, font-display).
// Both render above the fold and are preloaded by next/font.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter-base", display: "swap" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" })

export const metadata = {
  title: "Nodo Serrano",
  description: "Comunidad de Ethereum - Investigación y educación en Tandil",
  icons: {
    // favicon.svg is self-contained: full logo as vectors plus a 128px PNG of the
    // top gradient (~15 KB total). It previously <use>d nodo-logo.svg, which
    // embedded a ~110 KB base64 PNG and was fetched on every page load.
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-bg-light text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
