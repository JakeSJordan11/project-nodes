'use client'

import type { PointerEvent } from 'react'
import { Node } from '../node/component'
import { NodeMenu } from '../node/menu/component'
import { Stream } from '../stream/component'
import { useGraph } from './context/component'
import { ContextMenu } from './menu/component'
import styles from './styles.module.css'

export default function Graph() {
  const { state, dispatch } = useGraph()

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
    >
      <h1 className={styles.title}>Project Nodes</h1>
      <p
        className={
          state.nodes.length === 0 ? styles.directions : styles.directionsfade
        }
      >
        right click to create a node
      </p>
      <p className={styles.signature}>created by: Jake Jordan</p>
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
