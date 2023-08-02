import { inter } from '@/app/fonts'
import '@/styles/globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Project Nodes',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
