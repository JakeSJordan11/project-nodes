import { Library, Properties, SuperGraph, Viewport2D } from '@/components'
import { SuperGraphProvider } from '@/providers'
import styles from './page.module.css'

export default function Home() {
  return (
    <SuperGraphProvider>
      <main className={styles.main}>
        <SuperGraph />
        <Library />
        <Viewport2D />
        <Properties />
      </main>
    </SuperGraphProvider>
  )
}
