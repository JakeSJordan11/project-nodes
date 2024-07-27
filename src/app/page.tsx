import { Graph, Library, Output, Properties } from '@/components'
import { GraphProvider } from '@/providers'
import styles from './page.module.css'

export default function Home() {
  return (
    <GraphProvider>
      <main className={styles.main}>
        <Graph />
        <Library />
        <Output />
        <Properties />
      </main>
    </GraphProvider>
  )
}
