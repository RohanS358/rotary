import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rotaryclubofpashupati.org.np"),
  title: {
    default: "Rotary Club of Pashupati Kathmandu",
    template: "%s | Rotary Club of Pashupati Kathmandu",
  },
  description:
    "Rotary Club of Pashupati Kathmandu — Service Above Self. Serving Kathmandu since 1998 through health, education, empowerment, and environmental community projects.",
  keywords: [
    "Rotary Club",
    "Pashupati",
    "Kathmandu",
    "Nepal",
    "Service",
    "NGO",
    "Rotary International",
    "District 3292",
    "Community Service",
    "Humanitarian",
  ],
  authors: [{ name: "Rotary Club of Pashupati Kathmandu" }],
  creator: "Rotary Club of Pashupati Kathmandu",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rotary Club of Pashupati Kathmandu",
    title: "Rotary Club of Pashupati Kathmandu",
    description:
      "Service Above Self. A global network of neighbors, friends, leaders, and problem-solvers committed to lasting change.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Rotary Club of Pashupati Kathmandu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotary Club of Pashupati Kathmandu",
    description: "Service Above Self — Serving Kathmandu since 1998.",
    images: ["/og-default.jpg"],
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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Rotary Club of Pashupati Kathmandu",
  url: "https://rotaryclubofpashupati.org.np",
  logo: "https://rotaryclubofpashupati.org.np/rotary-logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "09 Sinamangal",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+977-9851197327",
    email: "pashupatirotaryclub@gmail.com",
    contactType: "customer service",
  },
  openingHours: "Su-Fr 09:00-18:00",
  memberOf: {
    "@type": "Organization",
    name: "Rotary International",
    url: "https://www.rotary.org",
  },
  description:
    "Rotary Club of Pashupati Kathmandu is a service club in District 3292, dedicated to community service in health, education, environment, and economic development.",
  foundingDate: "1998",
  areaServed: "Kathmandu, Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
