import { GraphProvider } from '@/contexts/graph.povider'
import styles from '@/styles/app.layout.module.css'
import { inter } from '@/styles/fonts'
import '@/styles/globals.css'
import { RootLayoutProps } from '@/types/root.layout.types'

export const metadata = {
  title: 'Project Nodes',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={inter.className} lang='en'>
      <body className={styles.body}>
        <GraphProvider>{children}</GraphProvider>
      </body>
    </html>
  )
}
