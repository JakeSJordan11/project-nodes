import { nodeData } from '@/data/library'
import styles from '@/styles/library.module.css'

export function Library() {
  return (
    <article className={styles.library}>
      {nodeData.map((node) => (
        <article key={node} className={styles.item}>
          {node}
        </article>
      ))}
    </article>
  )
}
