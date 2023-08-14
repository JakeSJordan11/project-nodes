import styles from '@/styles/node.module.css'
import { NodeProps } from '@/types/node.types'
import { ChangeEvent, PointerEvent } from 'react'

export function Input({
  id,
  value,
  position,
  onInputValueChange,
  onOutputPointerDown,
}: NodeProps & {
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>, nodeId: string) => void
  onOutputPointerDown: (event: PointerEvent<HTMLButtonElement>, nodeId: string) => void
}) {
  return (
    <article className={styles.node} style={{ left: position.x, top: position.y }}>
      <output className={styles.value}>{value}</output>
      <input
        className={styles.slider}
        type='range'
        max={10}
        value={value}
        onChange={(event) => onInputValueChange(event, id)}
      />
      <div className={styles.outputs}>
        <button className={styles.port} onPointerDown={(event) => onOutputPointerDown(event, id)} />
      </div>
    </article>
  )
}
