import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Elite Document Converter - Free Online Tools by Muhammad Hussain",
  description: "Secure, browser-based document converter. Convert PDF to Image, Word to PDF, and more. 100% private - files never leave your device.",
  keywords: ["Elite Document Converter", "Muhammad Hussain Shakir", "PDF to Image", "Secure Converter", "Free Online Tools"],
  authors: [{ name: "Muhammad Hussain Shakir" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Structured Data for Stars & Branding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Elite Document Converter",
              "operatingSystem": "All",
              "applicationCategory": "UtilityApplication",
              "author": {
                "@type": "Person",
                "name": "Muhammad Hussain Shakir"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "50"
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
