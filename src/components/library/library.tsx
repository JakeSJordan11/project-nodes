'use client'

import { nodeDragStart } from '@/actions'
import { useGraph } from '@/hooks'
import { NodeVariant } from '@/types'
import type { DragEvent } from 'react'
import styles from './Library.module.css'

export function Library() {
  const { dispatch } = useGraph()

  function handleonDragStart(event: DragEvent<HTMLElement>, variant: string) {
    dispatch(nodeDragStart(event, variant))
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
