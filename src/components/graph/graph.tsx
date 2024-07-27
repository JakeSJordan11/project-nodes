'use client'

import {
  graphDrop,
  graphMouseLeave,
  graphMouseMove,
  graphMouseUp,
  graphWheel,
} from '@/actions'
import { Edge, Node } from '@/components'
import { useGraph } from '@/hooks'
import { WheelEvent, useState, type DragEvent, type MouseEvent } from 'react'
import styles from './graph.module.css'

export function Graph() {
  const { state, dispatch } = useGraph()
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    dispatch(graphMouseMove(event))
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    dispatch(graphMouseUp(event))
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    dispatch(graphMouseLeave(event))
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    dispatch(graphDrop(event))
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const { deltaY, deltaX } = event
    const { x, y } = scrollPosition
    setScrollPosition({ x: x + deltaX, y: y + deltaY })
    dispatch(graphWheel(event))
  }

  return (
    <article
      className={styles.graph}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onWheel={handleWheel}
    >
      {state.nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <svg
        className={styles.svg}
        style={{
          backgroundPosition: `${scrollPosition.x}px ${scrollPosition.y}px`,
        }}
      >
        {state.edges.map((edge) => (
          <Edge key={edge.id} {...edge} />
        ))}
      </svg>
    </article>
  )
}
