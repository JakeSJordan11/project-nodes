'use client'

import { NodeVariant } from '../node'
import styles from './library.module.css'

export function Library() {
  function handleonDragStart(
    event: React.DragEvent<HTMLElement>,
    node: string
  ) {
    event.dataTransfer.setData('node', node)
  }

  return (
    <article className={styles.library}>
      {Array(NodeVariant.Number, NodeVariant.Math).map((node) => (
        <article
          key={node}
          className={styles.item}
          draggable={true}
          onDragStart={(event) => handleonDragStart(event, node)}
        >
          {node}
        </article>
      ))}
    </article>
  )
}
