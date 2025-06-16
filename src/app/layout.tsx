import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Square_Peg } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const squarePeg = Square_Peg({
  variable: "--font-square-peg",
  subsets: ["latin"],
  weight: "400",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Photo Booth – Take Filtered Photos Online | Built by Jasper Ayawan",
  description: "Capture fun, high-quality selfies and portraits with filters and frames. Try out the photo booth made by Jasper Ayawan – fast, free, and no downloads required!",
  keywords: [
    "photo booth", 
    "online photo booth", 
    "selfie app", 
    "take pictures online", 
    "filtered selfies", 
    "camera app web", 
    "Jasper Ayawan"
  ],
  authors: [{ name: "Jasper Ayawan", url: "https://jasperayawan.netlify.app" }],
  creator: "Jasper Ayawan",
  openGraph: {
    title: "Photo Booth – Take Filtered Photos Online | Built by Jasper Ayawan",
    description: "Try a fun, free photo booth app to take and download pictures with filters. Created by Jasper Ayawan.",
    // url: "https://your-photo-booth-site.com",
    siteName: "Jasper.dev Photo Booth",
    images: [
      {
        url: "https://your-photo-booth-site.com/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Preview of Jasper Ayawan's Online Photo Booth",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Booth – Take Photos Online | Built by Jasper Ayawan",
    description: "A fun photo booth with filters and frames – no download needed.",
    creator: "@xiaoyan_ku", 
    images: ["https://your-photo-booth-site.com/og-image.png"],
  },
  metadataBase: new URL("https://photo-booth-jasper-dev.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${squarePeg.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
