import styles from '@/styles/operator.module.css'
import type { NodeProps } from '@/types/node'

export function Operator({ ...node }: NodeProps) {
  return (
    <>
      <output className={styles.contentContainer}>{node.value}</output>
      <select className={styles.selector}>
        <option value='addition'>Addition</option>
        <option value='subtraction'>Subtraction</option>
        <option value='multiplication'>Multiplication</option>
        <option value='division'>Division</option>
      </select>
    </>
  )
}
