import { inter } from './fonts'
import './globals.css'
import styles from './styles.module.css'
import { RootLayoutProps } from './types'

export const metadata = {
  title: 'Project Nodes',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={inter.className} lang='en'>
      <body className={styles.body}>{children}</body>
    </html>
  )
}
