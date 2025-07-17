import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "SaaS Starter - Complete Next.js SaaS Template",
  description:
    "The most comprehensive Next.js SaaS template with authentication, payments, dashboard, and API infrastructure. Everything you need to launch your SaaS product quickly.",
  keywords: [
    "SaaS template",
    "Next.js template",
    "SaaS starter",
    "authentication",
    "Stripe payments",
    "dashboard template",
    "API template",
    "React SaaS",
    "TypeScript SaaS",
    "SaaS boilerplate",
    "startup template",
    "web app template",
  ],
  authors: [{ name: "SaaS Starter Team" }],
  creator: "SaaS Starter",
  publisher: "SaaS Starter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://saas-starter.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SaaS Starter - Complete Next.js SaaS Template",
    description:
      "The most comprehensive Next.js SaaS template with authentication, payments, dashboard, and API infrastructure. Everything you need to launch your SaaS product quickly.",
    url: "https://saas-starter.vercel.app",
    siteName: "SaaS Starter",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SaaS Starter - Next.js SaaS Template",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Starter - Complete Next.js SaaS Template",
    description:
      "The most comprehensive Next.js SaaS template with authentication, payments, dashboard, and API infrastructure.",
    images: ["/og-image.jpg"],
    creator: "@saas_starter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SaaS Starter",
              description: "The most comprehensive Next.js SaaS template with authentication, payments, dashboard, and API infrastructure",
              url: "https://saas-starter.vercel.app",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free tier with 100 API calls per month",
              },
              creator: {
                "@type": "Organization",
                name: "SaaS Starter",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
