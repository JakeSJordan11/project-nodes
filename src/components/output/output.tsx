'use client'

import { useGraph } from '../graph'
import { NodeStatus } from '../node'
import styles from './output.module.css'

export function Output() {
  const { state } = useGraph()
  return (
    <article className={styles.output}>
      {state.nodes.map((node) => {
        if (node.status !== NodeStatus.Selected) return null
        return (
          <output key={node.id} className={styles.value}>
            {node.value}
          </output>
        )
      })}
    </article>
  )
}
