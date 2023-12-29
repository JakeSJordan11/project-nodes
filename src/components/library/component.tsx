import { nodeData } from './data'
import styles from './styles.module.css'

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
