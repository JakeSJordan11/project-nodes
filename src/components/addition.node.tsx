import styles from '@/styles/addition.node.module.css'
import { AdditionNodeProps } from '@/types/addition.node'

export function AdditionNode({ position }: AdditionNodeProps) {
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
    >
      <button className={styles.inputPort1} />
      <button className={styles.inputPort2} />
      <h1 className={styles.title}>Addition</h1>
      <output className={styles.value}></output>
      <button className={styles.outputPort} />
    </article>
  )
}
