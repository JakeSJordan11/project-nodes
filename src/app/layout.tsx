import { inter } from '@/app/fonts'
import '@/styles/globals.css'
import styles from '@/styles/layout.module.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Project Nodes',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={`${styles.html} ${inter.className}`}>
      <body className={styles.body}>{children}</body>
    </html>
  )
}
