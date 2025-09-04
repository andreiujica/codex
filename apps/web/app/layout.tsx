import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import {
  TanstackProvider,
  ThemeProvider,
} from "@/providers/index"

/**
 * We use the Geist font for the app.
 */
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/**
 * This layout wraps every single page in the app. In our case,
 * it is just one - page.tsx - the main one.
 * 
 * It appends the providers for Tanstack Query and ThemeProvider.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <TanstackProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  )
}
