import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Elite Document Converter | 100% Secure & Free Online PDF Tools",
  description: "Best free browser-based document converter. Convert PDF to Image, Word to PDF, and ZIP files locally. No uploads, 100% private and secure.",
  keywords: ["Elite Document Converter", "free pdf to image", "secure online converter", "Muhammad Hussain Shakir"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Elite Document Converter",
              "operatingSystem": "All",
              "applicationCategory": "UtilityApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "87"
              },
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
