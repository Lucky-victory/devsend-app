import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "DevSend - Email campaigns for developers and marketers",
  description:
    "The email platform that bridges developers and marketers. Code-first where it matters, visual where it helps. Build with React components or drag-and-drop — your choice.",
  openGraph: {
    title: "DevSend - Email campaigns for developers and marketers",
    description:
      "The email platform that bridges developers and marketers. Code-first where it matters, visual where it helps. Build with React components or drag-and-drop — your choice.",
    images: ["/og.png"],
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL!,
    siteName: "DevSend",
    locale: "en_US",
    countryName: "United States",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSend - Email campaigns for developers and marketers",
    description:
      "The email platform that bridges developers and marketers. Code-first where it matters, visual where it helps. Build with React components or drag-and-drop — your choice.",
    images: ["/og.png"],
  },
    generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
