import '@/styles/globals.css'
import { inter } from '@/utilities'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

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
