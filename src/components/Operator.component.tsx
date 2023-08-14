import { OperationVariants } from '@/constants/node.constant'
import styles from '@/styles/node.module.css'
import { NodeProps } from '@/types/node.types'
import { PointerEvent } from 'react'

export function Operator({
  id,
  value,
  position,
  onInputPointerUp,
  onOutputPointerDown,
}: NodeProps & {
  onInputPointerUp: (event: PointerEvent<HTMLButtonElement>, nodeValue: number) => void
  onOutputPointerDown: (event: PointerEvent<HTMLButtonElement>, nodeId: string) => void
}) {
  return (
    <article className={styles.node} style={{ left: position.x, top: position.y }}>
      <div className={styles.inputs}>
        <button className={styles.port} onPointerUp={(event) => onInputPointerUp(event, value)} />
        <button className={styles.port} onPointerUp={(event) => onInputPointerUp(event, value)} />
      </div>
      <output className={styles.value}>{value}</output>
      <select className={styles.selector} value={value}>
        <option value={OperationVariants.Addition}>Addition</option>
        <option value={OperationVariants.Subtraction}>Subtraction</option>
        <option value={OperationVariants.Multiplication}>Multiplication</option>
        <option value={OperationVariants.Division}>Division</option>
        <option value={OperationVariants.Exponentiation}>Exponentiation</option>
        <option value={OperationVariants.Modulo}>Modulo</option>
      </select>
      <div className={styles.outputs}>
        <button className={styles.port} onPointerDown={(event) => onOutputPointerDown(event, id)} />
      </div>
    </article>
  )
}
