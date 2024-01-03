'use client'

import { nodeData } from '@/data/library'
import styles from '@/styles/library.module.css'

export function Library() {
  function handleonDragStart(
    event: React.DragEvent<HTMLElement>,
    node: string
  ) {
    const target = event.target as HTMLElement
    const bounds = target.getBoundingClientRect()
    event.dataTransfer.setData('node', node)
    event.dataTransfer.setData('offsetX', String(bounds.x + bounds.width))
    event.dataTransfer.setData('offsetY', String(bounds.y + bounds.height))
    console.log('drag start', event.dataTransfer.getData('offsetX'))
  }
  return (
    <article className={styles.library}>
      {nodeData.map((node) => (
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
