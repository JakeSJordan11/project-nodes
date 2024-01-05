'use client'

import { Node } from '@/components/node'
import { Stream } from '@/components/stream'
import { useGraph } from '@/contexts/graph.povider'
import { GraphActionTypes } from '@/enums/graph'
import styles from '@/styles/graph.module.css'
import { useState, type DragEvent, type MouseEvent } from 'react'

export function Graph() {
  const { state, dispatch } = useGraph()
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    dispatch({
      type: GraphActionTypes.GRAPH_MOUSE_MOVE,
      payload: { event: event },
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    dispatch({
      type: GraphActionTypes.GRAPH_MOUSE_UP,
      payload: { event: event },
    })
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    dispatch({
      type: GraphActionTypes.GRAPH_MOUSE_LEAVE,
      payload: { event: event },
    })
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    dispatch({ type: GraphActionTypes.GRAPH_DROP, payload: { event: event } })
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  return (
    <article
      className={styles.graph}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onWheel={(event) => {
        setScrollPosition({
          x: scrollPosition.x + event.deltaX,
          y: scrollPosition.y + event.deltaY,
        })
      }}
      style={{
        backgroundImage: `url(/grid.svg)`,
        backgroundPosition: `${scrollPosition.x}px ${scrollPosition.y}px`,
      }}
    >
      {state.nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <svg className={styles.svg}>
        {state.streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </article>
  )
}
