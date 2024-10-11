import { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { GoogleAnalytics } from '@next/third-parties/google'
import { SwayideProviders } from "@/components/providers"
import { cn } from "@/lib/utils"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Swayide | Sway IDE",
    template: `%s - Solide`,
  },
  description: "Lightweight Move IDE",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

const fontSpace = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <html lang="en" suppressHydrationWarning>
    <head />
    <body
      className={cn(
        "bg-grayscale-000 font-sans antialiased",
        fontSpace.variable
      )}
    >
      <SwayideProviders>
        {children}
      </SwayideProviders>
    </body>
    <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS || ""} />
  </html>
}