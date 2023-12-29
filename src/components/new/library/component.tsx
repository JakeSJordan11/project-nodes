import styles from './styles.module.css'
import { nodeData } from './data'

export function NewLibrary() {
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
