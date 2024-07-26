'use client'

import styles from '@/styles/output.module.css'
import { useGraph } from '../graph'

export function Output() {
  const { state } = useGraph()
  return (
    <article className={styles.output}>
      {state.nodes.map((node) => {
        if (!node.isSelected) return null
        return (
          <output key={node.id} className={styles.value}>
            {node.value}
          </output>
        )
      })}
    </article>
  )
}
