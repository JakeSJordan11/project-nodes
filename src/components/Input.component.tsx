import styles from '@/styles/node.module.css'
import type { NodeProps } from '@/types/node.types'

export function Input(node: NodeProps) {
  return (
    <article className={styles.node} style={{ left: node.position.x, top: node.position.y }}>
      <output className={styles.value}>{node.value}</output>
      <input className={styles.slider} type='range' max={10} />
      <div className={styles.outputs}>
        <button className={styles.port} />
      </div>
    </article>
  )
}
