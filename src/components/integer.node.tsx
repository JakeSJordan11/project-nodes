import styles from '@/styles/integer.node.module.css'
import { IntegerNodeProps } from '@/types/integer.node'
import { useState } from 'react'

export function IntegerNode({ position }: IntegerNodeProps) {
  const [value, setValue] = useState(0)
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
    >
      <h1 className={styles.title}>Integer</h1>
      <output className={styles.value}>{value}</output>
      <input
        className={styles.slider}
        type='range'
        min='0'
        max='10'
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
      />
      <button className={styles.port} value={value} />
    </article>
  )
}
