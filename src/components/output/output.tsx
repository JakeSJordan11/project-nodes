'use client'

import { useGraph } from '../graph'
import { NodeStatus, NodeVariant } from '../node'
import { Storage, Triangle, Uniforms } from '../webgpu'
import { Translation } from '../webgpu/translation'
import styles from './output.module.css'

export function Output() {
  const { state } = useGraph()
  const selectedNode = state.nodes.find(
    (node) =>
      node.status === NodeStatus.Selected || node.status === NodeStatus.Dragging
  )
  return (
    <article className={styles.output}>
      <output key={selectedNode?.id} className={styles.value}>
        {selectedNode?.variant === NodeVariant.Uniforms ? (
          <Uniforms />
        ) : selectedNode?.variant === NodeVariant.Triangle ? (
          <Triangle />
        ) : selectedNode?.variant === NodeVariant.Storage ? (
          <Storage />
        ) : selectedNode?.variant === NodeVariant.Translation ? (
          <Translation
            valueX={selectedNode.valueX}
            valueY={selectedNode.valueY}
          />
        ) : (
          selectedNode?.value
        )}
      </output>
    </article>
  )
}
