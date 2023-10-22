import { InputPort } from '@/components/input.port'
import { OutputNodeProps } from '@/types/output.node'
import styles from '@/styles/output.node.module.css'

export function OutputNode({ position }: OutputNodeProps) {
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
    >
      <InputPort />
      <h1 className={styles.title}>Output</h1>
      <output className={styles.value}>value</output>
    </article>
  )
}
