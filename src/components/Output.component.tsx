import styles from '@/styles/node.module.css'
import { NodeProps } from '@/types/node.types'
import { PointerEvent } from 'react'

export function Output({
  value,
  position,
  onInputPointerUp,
}: NodeProps & {
  onInputPointerUp: (event: PointerEvent<HTMLButtonElement>, nodeValue: number) => void
}) {
  return (
    <article className={styles.node} style={{ left: position.x, top: position.y }}>
      <div className={styles.inputs}>
        <button className={styles.port} onPointerUp={(event) => onInputPointerUp(event, value)} />
      </div>
      <output className={styles.value}>{value}</output>
    </article>
  )
}
