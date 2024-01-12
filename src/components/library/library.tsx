'use client'

import type { DragEvent } from 'react'
import { NodeVariant } from '../node'
import styles from './library.module.css'

export function Library() {
  function handleonDragStart(event: DragEvent<HTMLElement>, variant: string) {
    event.dataTransfer.setData('variant', variant)
    event.dataTransfer.setData('offsetx', event.nativeEvent.offsetX.toString())
    event.dataTransfer.setData('offsety', event.nativeEvent.offsetY.toString())
  }
  return (
    <article className={styles.library}>
      {Object.values(NodeVariant).map((variant) => (
        <article
          key={variant}
          className={styles.item}
          draggable={true}
          onDragStart={(event) => handleonDragStart(event, variant)}
        >
          <h1 className={styles.title}>{variant}</h1>
        </article>
      ))}
    </article>
  )
}
