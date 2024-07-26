'use client'

import styles from '@/styles/library.module.css'
import { NodeVariant } from '@/types/node.types'
import type { DragEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'

export function Library() {
  const { dispatch } = useGraph()

  function handleonDragStart(event: DragEvent<HTMLElement>, variant: string) {
    dispatch({
      type: GraphActionTypes.NODE_DRAG_START,
      payload: { event: event, variant: variant },
    })
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
