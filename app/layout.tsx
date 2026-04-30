import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Raman Sanga | Portfolio CMS",
    template: "%s | Raman Sanga",
  },
  description: "Premium portfolio powered by a full-stack CMS with Next.js and Prisma.",
  openGraph: {
    title: "Raman Sanga | Portfolio CMS",
    description: "Full-stack developer portfolio with projects, experience, and certifications.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raman Sanga | Portfolio CMS",
    description: "Full-stack developer portfolio with projects, experience, and certifications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
