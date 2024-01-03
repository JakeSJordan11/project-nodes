'use client'

import { ContextMenu } from '@/components/graph/graph.menu'
import { Node } from '@/components/nodes/node'
import { NodeMenu } from '@/components/nodes/node.menu'
import { Stream } from '@/components/stream'
import { useGraph } from '@/contexts/graph.povider'
import styles from '@/styles/graph.module.css'
import { DragEvent, useState, type PointerEvent } from 'react'

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

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_drop', payload: { event: event } })
    console.log(event.dataTransfer.getData('node'))
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  return (
    <article
      className={styles.graph}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={handleContextMenu}
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
      {state.ContextMenus.node.hidden ? null : <NodeMenu />}
      {state.ContextMenus.graph.hidden ? null : <ContextMenu />}
    </article>
  )
}
