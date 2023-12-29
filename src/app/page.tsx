import { Graph, Library, Output, Properties } from '../components'
import styles from './styles.module.css'

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
