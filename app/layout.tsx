import type { Metadata } from "next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CursorTracker } from "@/components/cursor-tracker"

export const metadata: Metadata = {
  title: "Nosakhare Model Education Centre | Excellence in Education",
  description: "Nosakhare Model Education Centre (NOMEC) — a private institution in Benin City, Nigeria, since 1996. Motto: Diligence, Knowledge, Faith in God.",
  keywords: "Nosakhare, NOMEC, private school, Benin City, Nigeria, education, Montessori, secondary school",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-nomec-green focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <CursorTracker />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
