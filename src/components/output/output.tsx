'use client'

import { useGraph } from '../graph'
import { NodeVariant, WebGPUComponent } from '../node'
import styles from './output.module.css'

export function Output() {
  const { state } = useGraph()
  return (
    <article className={styles.output}>
      {state.nodes.map((node) => {
        if (!node.isSelected) return null
        return (
          <output key={node.id} className={styles.value}>
            {node.variant === NodeVariant.WebGPU ? (
              <WebGPUComponent {...node} />
            ) : (
              node.value
            )}
          </output>
        )
      })}
    </article>
  )
}
