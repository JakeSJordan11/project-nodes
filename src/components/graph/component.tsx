'use client'

import { useState, type PointerEvent } from 'react'
import { ContextMenu, useGraph } from '.'
import { Node, NodeMenu, Stream } from '..'
import styles from './styles.module.css'

export function Graph() {
  const { state, dispatch } = useGraph()
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_move', payload: { event: event } })
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_up', payload: { event: event } })
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_leave', payload: { event: event } })
  }

  function handleContextMenu(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_menu_show', payload: { event: event } })
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_down', payload: { event: event } })
  }

  return (
    <article
      className={styles.graph}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={handleContextMenu}
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
      {state.ContextMenus.node.hidden ? null : <NodeMenu />}
      {state.ContextMenus.graph.hidden ? null : <ContextMenu />}
    </article>
  )
}
