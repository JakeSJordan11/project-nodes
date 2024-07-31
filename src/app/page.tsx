import { SuperGraph, Library, Properties, Viewport2D } from '@/components'
import { GraphProvider } from '@/providers'
import styles from './page.module.css'

export default function Home() {
  return (
    <GraphProvider>
      <main className={styles.main}>
        <SuperGraph />
        <Library />
        <Viewport2D />
        <Properties />
      </main>
    </GraphProvider>
  )
}
