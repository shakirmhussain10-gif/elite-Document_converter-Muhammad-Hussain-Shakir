import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// --- SEO & GOOGLE RANKING METADATA ---
export const metadata: Metadata = {
  title: "Elite Document Converter | 100% Secure & Free Online PDF Tools",
  description: "Best free browser-based document converter. Convert PDF to Image, Word to PDF, and ZIP files locally. No uploads, 100% private and secure.",
  keywords: [
    "Elite Document Converter",
    "free pdf to image converter",
    "secure online document converter",
    "no upload pdf converter",
    "Muhammad Hussain Shakir tools",
    "convert word to pdf free",
    "browser based file converter",
    "fastest online converter 2026"
  ],
  authors: [{ name: "Muhammad Hussain Shakir" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* --- GOOGLE SEARCH STARS & BRANDING SCHEMA --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Elite Document Converter",
              "operatingSystem": "Windows, MacOS, Android, iOS",
              "applicationCategory": "UtilityApplication",
              "description": "A high-speed, secure, and local browser-based document converter created by Muhammad Hussain Shakir.",
              "author": {
                "@type": "Person",
                "name": "Muhammad Hussain Shakir"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "bestRating": "5",
                "ratingCount": "87" 
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
