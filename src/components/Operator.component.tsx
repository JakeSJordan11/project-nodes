import { OperationVariants } from '@/constants/node.constant'
import styles from '@/styles/node.module.css'
import type { NodeProps } from '@/types'

export function Operator(node: NodeProps) {
  return (
    <article className={styles.node} style={{ left: node.position.x, top: node.position.y }}>
      <div className={styles.inputs}>
        <button className={styles.port} />
        <button className={styles.port} />
      </div>
      <output className={styles.value}>{node.value}</output>
      <select className={styles.selector} value={node.value}>
        <option value={OperationVariants.Addition}>Addition</option>
        <option value={OperationVariants.Subtraction}>Subtraction</option>
        <option value={OperationVariants.Multiplication}>Multiplication</option>
        <option value={OperationVariants.Division}>Division</option>
        <option value={OperationVariants.Exponentiation}>Exponentiation</option>
        <option value={OperationVariants.Modulo}>Modulo</option>
      </select>
      <div className={styles.outputs}>
        <button className={styles.port} />
      </div>
    </article>
  )
}
