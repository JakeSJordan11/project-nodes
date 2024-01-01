import { Graph } from '@/components/graph/graph'
import { Library } from '@/components/library'
import { Output } from '@/components/output'
import { Properties } from '@/components/properties'
import styles from '@/styles/app.page.module.css'

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.mainSection}>
        <Graph />
        <Library />
      </section>
      <section className={styles.sideSection}>
        <Output />
        <Properties />
      </section>
    </main>
  )
}
