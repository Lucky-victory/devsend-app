import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexProvider } from "@/components/convex-provider"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevSend - Developer-Centric Email Campaigns",
  description: "Intelligent and lightweight email campaign platform for developers, indie hackers, and small teams.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ConvexProvider>
      </body>
    </html>
  )
}
