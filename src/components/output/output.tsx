'use client'

import { useGraph } from '../graph'
import styles from './output.module.css'

export function Output() {
  const { state } = useGraph()
  return (
    <article className={styles.output}>
      {state.nodes.map((node) => {
        if (!node.selected) return null
        return <output key={node.id}>{node.value}</output>
      })}
    </article>
  )
}
