'use client'

import { useGraph } from '@/hooks/useGraph'
import styles from '@/styles/output.module.css'

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
