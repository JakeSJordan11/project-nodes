import { Graph, GraphProvider } from '@/components/graph'
import { Library } from '@/components/library'
import { Output } from '@/components/output'
import { Properties } from '@/components/properties'
import styles from './page.module.css'

export default function Home() {
  return (
    <GraphProvider>
      <main className={styles.main}>
        <article className={styles.right}>
          <Graph />
          <Library />
        </article>
        <article className={styles.left}>
          <Output />
          <Properties />
        </article>
      </main>
    </GraphProvider>
  )
}
