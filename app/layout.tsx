import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Medstaq Technologies",
  description: "Medstaq is the unified platform connecting hospitals, doctors, and patients to build the future of digital healthcare.",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favidon/apple-touch-icon.png",
  },

  // // The canonical URL for the site
  // // canonical: "https://joboy-dev.com",

  // // Open Graph metadata for social sharing
  // openGraph: {
  //   title: "Medstaq Technologies",
  //   description: "The central ecosystem for digital healthcare innovation.",
  //   url: "https://joboy-dev.com",
  //   siteName: "Medstaq Technologies",
  //   images: [
  //     {
  //       url: "https://joboy-dev.com/og-image.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "Medstaq Technologies",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },

  // // Twitter Card metadata
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Medstaq Technologies",
  //   description: "The central ecosystem for digital healthcare innovation.",
  //   site: "@joboydev",
  //   creator: "@joboydev",
  //   images: ["https://joboy-dev.com/og-image.png"],
  // },

  // // Theme color for browsers
  // themeColor: "#0f172a",

  // // Robots meta tag for search engines
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     "max-snippet": -1,
  //     "max-image-preview": "large",
  //     "max-video-preview": -1,
  //   },
  // },

  // Manifest for PWA support (if applicable)
  // manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <html lang="en">
        <body className="bg-background font-sans antialiased">
          {children}
        </body>
      </html>
    </>
  );
}
