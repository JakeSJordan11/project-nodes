'use client'

import { WheelEvent, useState, type DragEvent, type MouseEvent } from 'react'
import { Node } from '../node'
import { Stream } from '../stream'
import { GraphActionTypes, useGraph } from './graph.context'
import styles from './graph.module.css'

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

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const { deltaY, deltaX } = event
    const { x, y } = scrollPosition
    setScrollPosition({ x: x + deltaX, y: y + deltaY })
    dispatch({
      type: GraphActionTypes.GRAPH_WHEEL,
      payload: { event: event },
    })
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
        {state.streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </article>
  )
}
