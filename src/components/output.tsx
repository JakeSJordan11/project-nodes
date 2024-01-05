'use client'

import { useGraph } from '@/contexts/graph.povider'
import styles from '@/styles/output.module.css'

export function Output() {
  const { state } = useGraph()
  return (
    <article className={styles.output}>
      {state.nodes.map((node) => {
        if (!node.selected) return null
        return (
          <h1 key={node.id} className={styles.value}>
            {node.value}
          </h1>
        )
      })}
    </article>
  )
}
