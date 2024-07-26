import { Graph } from '@/components/graph'
import { Library } from '@/components/library'
import { Output } from '@/components/output'
import { Properties } from '@/components/properties'
import { GraphProvider } from '@/providers/graph.provider'
import styles from '@/styles/app.module.css'

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
