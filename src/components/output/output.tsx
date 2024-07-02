'use client'

import { useGraph } from '../graph'
import { NodeVariant } from '../node'
import WebGPU from '../node/node'
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
              <WebGPU key={node.id} />
            ) : (
              node.value
            )}
          </output>
        )
      })}
    </article>
  )
}
