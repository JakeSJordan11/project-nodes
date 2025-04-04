import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Project-Nodes',
  description: 'A node based tool',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.className} lang='en'>
      <body>{children}</body>
    </html>
  )
}
