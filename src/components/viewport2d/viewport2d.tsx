'use client'

import { useGraph } from '@/hooks'
import styles from './Viewport2d.module.css'

export function Viewport2D() {
  const { state } = useGraph()
  return (
    <article className={styles.viewport2d}>
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
