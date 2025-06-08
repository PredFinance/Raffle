import type React from "react"
import { Providers } from "@/components/providers"
import { ToastProvider } from "@/components/toast-provider"
import { Poetsen_One } from "next/font/google"
import "./globals.css"

const poetsenOne = Poetsen_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poetsen-one",
})

export const metadata = {
  title: "WheatChain Raffle | Modular DeFi on Sui",
  description:
    "Join WheatChain's gamified raffle system. Modular DeFi protocol offering liquid staking, yield strategies, and gamified rewards — built on Sui.",
  keywords: ["WheatChain", "DeFi", "Sui", "liquid staking", "yield farming", "raffle", "gamified rewards"],
  authors: [{ name: "WheatChain Team" }],
  openGraph: {
    title: "WheatChain Raffle | Modular DeFi on Sui",
    description:
      "Join WheatChain's gamified raffle system. Modular DeFi protocol offering liquid staking, yield strategies, and gamified rewards — built on Sui.",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
    siteName: "WheatChain",
  },
  twitter: {
    card: "summary_large_image",
    title: "WheatChain Raffle | Modular DeFi on Sui",
    description:
      "Join WheatChain's gamified raffle system. Modular DeFi protocol offering liquid staking, yield strategies, and gamified rewards — built on Sui.",
    images: ["/twitter-image.jpg"],
    creator: "@WheatChain",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poetsenOne.variable}>
      <body>
        <Providers>
          <ToastProvider />
          <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
