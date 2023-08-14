import styles from '@/styles/node.module.css'
import type { NodeProps } from '@/types/node.types'

export function Output(node: NodeProps) {
  return (
    <article className={styles.node} style={{ left: node.position.x, top: node.position.y }}>
      <div className={styles.inputs}>
        <button className={styles.port} />
      </div>
      <output className={styles.value}>{node.value}</output>
    </article>
  )
}
