import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Urban Mining Hub",
  description: "Hardware logistics, forensic sanitization, and precious metal recovery.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
