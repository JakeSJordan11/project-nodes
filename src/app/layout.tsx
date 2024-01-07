import { GraphProvider } from '@/components/graph'
import type { ReactNode } from 'react'
import styles from './app.layout.module.css'
import { inter } from './fonts'
import './globals.css'

export const metadata = {
  title: 'Project Nodes',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.className} lang='en'>
      <body className={styles.body}>
        <GraphProvider>{children}</GraphProvider>
      </body>
    </html>
  )
}
