import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Elite Document Converter - Free Online Tools by Muhammad Hussain",
  description:
    "Free all-in-one document converter: PDF to Image, Image to PDF, PDF to Word, Word to PDF, Photo Filters, B/W Converter, ZIP Creator, Password Protect and more. 100% browser-based, secure, no upload.",
  keywords:
    "PDF converter, Image to PDF, PDF to Word, Word to PDF, photo filters, B/W converter, ZIP creator, password protect, document tools",
  authors: [{ name: "Muhammad Hussain Shakir" }],
  manifest: "/manifest.json",
  verification: {
    google: "rD3v7YZmBXyaymcC4lkuGjiLnL4i1WvMs8arXoPuSiw",
  },
}

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
